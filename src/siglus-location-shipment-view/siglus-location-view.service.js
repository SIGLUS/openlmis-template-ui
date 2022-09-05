/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
   * @ngdoc service
   * @name shipment.Shipment
   *
   * @description
   * Represents a single shipment (or shipment draft).
   */
    angular
        .module('siglus-location-shipment-view')
        .service('SiglusLocationViewService', SiglusLocationViewService);

    // #400: add $resource, fulfillmentUrlFactory
    SiglusLocationViewService.$inject = ['$resource', 'fulfillmentUrlFactory'];
    // #400: ends here

    function SiglusLocationViewService($resource, fulfillmentUrlFactory) {
    // #400: Facility user partially fulfill an order and create sub-order for an requisition
        var resource = $resource(fulfillmentUrlFactory('/api/siglusapi/locations'), {}, {
            saveDraft: {
                method: 'PUT',
                url: fulfillmentUrlFactory('/api/siglusapi/shipmentDraftsWithLocation/:id')
            },
            getDraftByOrderId: {
                url: fulfillmentUrlFactory('/api/siglusapi/shipmentDraftsWithLocation/:id'),
                method: 'GET',
                isArray: false
            },
            getOrderableLocationLotsInfo: {
                method: 'POST',
                isArray: true
            },
            createDraft: {
                url: fulfillmentUrlFactory('/api/siglusapi/shipmentDrafts'),
                method: 'POST'
            },
            deleteDraft: {
                url: fulfillmentUrlFactory('/api/siglusapi/shipmentDrafts/:id'),
                method: 'DELETE'
            },
            createSubOrder: {
                url: fulfillmentUrlFactory('/api/siglusapi/shipments'),
                method: 'POST'

            },
            submitOrder: {
                url: fulfillmentUrlFactory('/api/siglusapi/shipments1'),
                method: 'POST'
            }
        });

        this.getDraftByOrderId = function(order, stockCardSummaries) {
            return resource.getDraftByOrderId({
                id: order.id
            }).$promise.then(function(shipment) {
                var canFulfillForMeMap = mapCanFulfillForMe(stockCardSummaries);
                var orderableIds = Object.keys(canFulfillForMeMap);
                shipment.lineItems = shipment.lineItems.filter(function(lineItem) {
                    return orderableIds.includes(lineItem.orderable.id);
                });
                return combineResponses(shipment, order, canFulfillForMeMap);
            });
        };

        this.saveDraft = function(params) {
            return resource.saveDraft({
                id: params.id
            }, params).$promise;
        };

        this.deleteDraft = function(params) {
            return resource.deleteDraft(params).$promise;
        };

        this.createDraft = function(order, stockCardSummaries) {
            return resource.createDraft(buildFromOrder(order, stockCardSummaries)).$promise;
        };

        function buildFromOrder(order, stockCardSummaries) {
            var orderableIds = order.orderLineItems.map(function(lineItem) {
                return lineItem.orderable.id;
            });
            var shipmentViewLineItems = stockCardSummaries.reduce(function(shipmentViewLineItems, summary) {
                // todo summary
                return shipmentViewLineItems.concat(
                    summary.canFulfillForMe.map(function(canFulfillForMe) {
                        return {
                            orderable: {
                                id: canFulfillForMe.orderable.id,
                                versionNumber: canFulfillForMe.orderable.meta.versionNumber
                            },
                            lot: canFulfillForMe.lot,
                            quantityShipped: 0
                        };
                    })
                );
            }, []).filter(function(shipmentLineItem) {
                return orderableIds.includes(shipmentLineItem.orderable.id);
            });
            return {
                order: order,
                lineItems: shipmentViewLineItems
            };
        }

        this.getOrderableLocationLotsInfo = function(params) {
            return resource.getOrderableLocationLotsInfo({
                extraData: params.extraData
            }, params.orderableIds).$promise;
        };

        this.createSubOrder = function() {
            return resource.createSuborder({
                isSubOrder: true
            }).$promise;
        };

        this.submitOrder = function(params) {
            return resource.submitOrder(params).$promise;
        };

        function combineResponses(shipment, order, stockCardDetailMap) {
            shipment.order = order;

            shipment.lineItems.forEach(function(lineItem) {
                var lotId = _.get(lineItem.lot, 'id', undefined);
                lineItem.canFulfillForMe = stockCardDetailMap[lineItem.orderable.id][lotId];
            });

            return shipment;
        }

        function mapCanFulfillForMe(summaries) {
            var stockCardDetailMap = {};

            var orderableIds = [];
            _.forEach(summaries, function(summary) {
                _.forEach(summary.canFulfillForMe, function(stockCardDetail) {
                    var orderableId = stockCardDetail.orderable.id,
                        lotId = stockCardDetail.lot ? stockCardDetail.lot.id : undefined;

                    if (!stockCardDetailMap[orderableId]) {
                        stockCardDetailMap[orderableId] = {};
                    }
                    orderableIds.push(orderableId);
                    stockCardDetailMap[orderableId][lotId] = stockCardDetail;
                });
            });

            return stockCardDetailMap;
        }

    }

})();
