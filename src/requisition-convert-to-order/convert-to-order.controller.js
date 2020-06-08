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
     * @ngdoc controller
     * @name requisition-convert-to-order.controller:ConvertToOrderController
     *
     * @description
     * Controller for converting requisitions to orders.
     */

    angular
        .module('requisition-convert-to-order')
        .controller('ConvertToOrderController', ConvertToOrderController);

    ConvertToOrderController.$inject = [
        '$stateParams', 'requisitionService', 'notificationService', 'facilities', 'programs',
        'confirmService', 'loadingModalService', 'requisitions', '$state', 'UuidGenerator'
    ];

    function ConvertToOrderController($stateParams, requisitionService, notificationService, facilities, programs,
                                      confirmService, loadingModalService, requisitions, $state, UuidGenerator) {

        var vm = this,
            uuidGenerator = new UuidGenerator(),
            key = uuidGenerator.generate();

        vm.convertToOrder = convertToOrder;
        vm.releaseWithoutOrder = releaseWithoutOrder;
        vm.getSelected = getSelected;
        vm.toggleSelectAll = toggleSelectAll;
        vm.setSelectAll = setSelectAll;
        vm.search = search;

        /**
         * @ngdoc property
         * @propertyOf requisition-convert-to-order.controller:ConvertToOrderController
         * @name requisitions
         * @type {String}
         *
         * @description
         * Holds requisitions that will be displayed on screen.
         */
        vm.requisitions = requisitions;

        /**
         * @ngdoc property
         * @propertyOf requisition-convert-to-order.controller:ConvertToOrderController
         * @name facilities
         * @type {Array}
         *
         * @description
         * Holds facilities for program select.
         */
        vm.facilities = facilities;

        /**
         * @ngdoc property
         * @propertyOf requisition-convert-to-order.controller:ConvertToOrderController
         * @name programs
         * @type {Array}
         *
         * @description
         * Holds programs for program select.
         */
        vm.programs = programs;

        /**
         * @ngdoc property
         * @propertyOf requisition-convert-to-order.controller:ConvertToOrderController
         * @name programId
         * @type {String}
         *
         * @description
         * Holds program id filter.
         */
        vm.programId = $stateParams.programId;

        /**
         * @ngdoc property
         * @propertyOf requisition-convert-to-order.controller:ConvertToOrderController
         * @name facilityId
         * @type {String}
         *
         * @description
         * Holds filter value.
         */
        vm.facilityId = $stateParams.facilityId;

        /**
         * @ngdoc property
         * @propertyOf requisition-convert-to-order.controller:ConvertToOrderController
         * @name sort
         * @type {String}
         *
         * @description
         * Holds field to sort by.
         */
        vm.sort = $stateParams.sort;

        /**
         * @ngdoc property
         * @propertyOf requisition-convert-to-order.controller:ConvertToOrderController
         * @name infoMessage
         * @type {Object}
         *
         * @description
         * Holds message that should be displayed to user.
         */
        vm.infoMessage = getInfoMessage();

        /**
         * @ngdoc property
         * @propertyOf requisition-convert-to-order.controller:ConvertToOrderController
         * @name selectAll
         * @type {Boolean}
         *
         * @description
         * Indicates if all requisitions from list all selected or not.
         */
        vm.selectAll = false;

        /**
         * @ngdoc method
         * @methodOf requisition-convert-to-order.controller:ConvertToOrderController
         * @name getSelected
         *
         * @description
         * Returns a list of requisitions selected by user, that are supposed to be converted to
         *     orders.
         *
         * @return {Array} list of selected requisitions
         */
        function getSelected() {
            var selected = [];
            angular.forEach(vm.requisitions, function(requisition) {
                if (requisition.$selected) {
                    selected.push(requisition);
                }
            });
            return selected;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-convert-to-order.controller:ConvertToOrderController
         * @name toggleSelectAll
         *
         * @description
         * Responsible for marking/unmarking all requisitions as selected.
         *
         * @param {Boolean} selectAll Determines if all requisitions should be selected or not
         */
        function toggleSelectAll(selectAll) {
            angular.forEach(vm.requisitions, function(requisition) {
                requisition.$selected = selectAll;
            });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-convert-to-order.controller:ConvertToOrderController
         * @name setSelectAll
         *
         * @description
         * Responsible for making the checkbox "select all" checked when all requisitions are
         *     selected by user.
         */
        function setSelectAll() {
            var value = true;
            angular.forEach(vm.requisitions, function(requisition) {
                value = value && requisition.$selected;
            });
            vm.selectAll = value;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-convert-to-order.controller:ConvertToOrderController
         * @name convertToOrder
         *
         * @description
         * Responsible for converting selected requisitions to orders.
         */
        function convertToOrder() {
            release(true);
        }

        /**
         * @ngdoc method
         * @methodOf requisition-convert-to-order.controller:ConvertToOrderController
         * @name releaseWithoutOrder
         *
         * @description
         * Responsible for releasing selected requisitions without creating orders.
         */
        function releaseWithoutOrder() {
            release(false);
        }

        /**
         * @ngdoc method
         * @methodOf requisition-convert-to-order.controller:ConvertToOrderController
         * @name getInfoMessage
         *
         * @description
         * Responsible for setting proper info message to display to user.
         *
         * @return {Object} message that should be displayed to user
         */
        function getInfoMessage() {
            if (!vm.requisitions.length) {
                return 'requisitionConvertToOrder.noSearchResults';
            }
            return undefined;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-convert-to-order.controller:ConvertToOrderController
         * @name search
         *
         * @description
         * Reloads the page with new search parameters.
         */
        function search() {
            var stateParams = angular.copy($stateParams);

            stateParams.programId = vm.programId;
            stateParams.facilityId = vm.facilityId;
            stateParams.sort = vm.sort;

            $state.go('openlmis.requisitions.convertToOrder', stateParams, {
                reload: true
            });
        }

        function release(withOrder) {
            var requisitions = getSelected();
            if (requisitions.length > 0) {
                var missingDepots = requisitions
                    .filter(function(item) {
                        return !item.requisition.supplyingFacility;
                    });
                if (missingDepots.length > 0) {
                    notificationService.error('requisitionConvertToOrder.noSupplyingDepotSelected');
                } else {
                    confirmService.confirm(withOrder ?
                        'requisitionConvertToOrder.convertToOrder.confirm' :
                        'requisitionConvertToOrder.releaseWithoutOrder.confirm')
                        .then(function() {
                            loadingModalService.open();

                            var promise = withOrder ?
                                requisitionService.convertToOrder(requisitions, key) :
                                requisitionService.releaseWithoutOrder(requisitions, key);

                            promise
                                .then(function() {
                                    notificationService.success(withOrder ?
                                        'requisitionConvertToOrder.convertToOrder.success' :
                                        'requisitionConvertToOrder.releaseWithoutOrder.success');
                                    // #245: redirecting to fulfill orders after convert to order
                                    withOrder ? $state.go('openlmis.orders.fulfillment') : $state.reload();
                                    // #245: ends here
                                })
                                .catch(function() {
                                    loadingModalService.close();
                                    notificationService.error('requisitionConvertToOrder.errorOccurred');
                                    key = uuidGenerator.generate();
                                });
                        });
                }
            } else {
                notificationService.error('requisitionConvertToOrder.selectAtLeastOneRnr');
            }
        }
    }

})();
