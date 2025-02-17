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

    angular
        .module('siglus-location-receive-creation')
        .config(routes);

    routes.$inject = [
        '$stateProvider',
        'STOCKMANAGEMENT_RIGHTS'
    ];

    function routes($stateProvider, STOCKMANAGEMENT_RIGHTS) {
        $stateProvider.state('openlmis.locationManagement.receive.draft.creation', {
            url: '/:draftId/create?page&size&keyword',
            label: '',
            views: {
                '@openlmis': {
                    controller: 'siglusLocationReceiveCreationController',
                    templateUrl: 'siglus-location-receive/siglus-location-receive-creation/' +
                      'siglus-location-receive-creation.html',
                    controllerAs: 'vm'
                }
            },
            accessRights: [STOCKMANAGEMENT_RIGHTS.STOCK_ADJUST],
            params: {
                facility: undefined,
                displayItems: undefined,
                addedLineItems: undefined,
                draftInfo: undefined,
                locations: undefined,
                size: '10',
                reasons: undefined,
                initialDraftInfo: undefined,
                productList: undefined,
                keyword: undefined
            },
            resolve: {
                isMerge: function() {
                    return false;
                },
                program: function($stateParams) {
                    return $stateParams.programId;
                },
                facility: function($stateParams, facilityFactory) {
                    if ($stateParams.facility) {
                        return $stateParams.facility;
                    }
                    return facilityFactory.getUserHomeFacility();

                },
                initialDraftInfo: function($stateParams, facility, siglusStockDispatchService, DRAFT_TYPE) {
                    if ($stateParams.initialDraftInfo) {
                        return $stateParams.initialDraftInfo;
                    }
                    var type = DRAFT_TYPE[$stateParams.moduleType][$stateParams.draftType];
                    return siglusStockDispatchService.queryInitialDraftInfo(
                        $stateParams.programId, type, $stateParams.moduleType, facility.id
                    ).then(function(result) {
                        return result[0];
                    });
                },
                reasons: function($stateParams, stockReasonsFactory, facility) {
                    if (_.isUndefined($stateParams.reasons)) {
                        return stockReasonsFactory.getIssueReasons($stateParams.programId, facility.type.id);
                    }
                    return $stateParams.reasons;
                },
                productList: function(siglusLocationCommonApiService, $stateParams) {
                    if ($stateParams.productList) {
                        return $stateParams.productList;
                    }
                    return siglusLocationCommonApiService.getAllProductList($stateParams.draftId);
                },
                mergedItems: function() {
                    return [];
                },
                draftInfo: function($stateParams, siglusStockDispatchService) {
                    if ($stateParams.draftInfo) {
                        return $stateParams.draftInfo;
                    }
                    return siglusStockDispatchService.getDraftById($stateParams.initialDraftId,
                        $stateParams.draftId, $stateParams.moduleType);
                },

                areaLocationInfo: function($stateParams, siglusStockIssueLocationService) {
                    if ($stateParams.areaLocationInfo) {
                        return $stateParams.areaLocationInfo;
                    }
                    return siglusStockIssueLocationService.getLocationAreaInfo(undefined, true);
                },
                locations: function(siglusLocationCommonApiService, draftInfo, $stateParams) {
                    if ($stateParams.locations) {
                        return $stateParams.locations;
                    }
                    var orderableIds = _.map(draftInfo.lineItems, function(lineItem) {
                        return lineItem.orderableId;
                    });
                    return siglusLocationCommonApiService.getOrderableLocationLotsInfo({
                        isAdjustment: false,
                        extraData: true,
                        returnNoMovementLots: true
                    }, orderableIds);
                },
                addedLineItems: function($stateParams, draftInfo, locations, productList,
                    addAndRemoveReceiveLineItemIssueService) {
                    if ($stateParams.addedLineItems) {
                        return $stateParams.addedLineItems;
                    }
                    return addAndRemoveReceiveLineItemIssueService.prepareAddedLineItems(draftInfo, locations,
                        productList);
                },
                orderablesPrice: function(siglusOrderableLotService) {
                    return siglusOrderableLotService.getOrderablesPrice();
                },
                displayItems: function($stateParams, siglusLocationCommonFilterService, addedLineItems) {
                    var displayItems = siglusLocationCommonFilterService
                        .filterList($stateParams.keyword || '', addedLineItems);

                    return displayItems;
                },
                orderableGroups: function($stateParams, facility, draftInfo, orderableGroupService) {
                    if (!$stateParams.orderableGroups) {
                        var allLineOrderableIds = draftInfo.lineItems.map(function(line) {
                            return line.orderableId;
                        });
                        return orderableGroupService.findAvailableProductsAndCreateOrderableGroups(
                            $stateParams.programId, facility.id, true, STOCKMANAGEMENT_RIGHTS.STOCK_ADJUST,
                            $stateParams.draftId, allLineOrderableIds
                        );
                    }
                    return $stateParams.orderableGroups;
                }
            }
        });
    }

})();
