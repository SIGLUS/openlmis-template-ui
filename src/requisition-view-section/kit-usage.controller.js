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
        .module('requisition-view-section')
        .controller('KitUsageController', controller);

    controller.$inject = ['columnUtils', 'templateConfigureService', 'SERVICE_TYPES'];

    function controller(columnUtils, templateConfigureService, SERVICE_TYPES) {

        var vm = this;

        vm.$onInit = onInit;
        vm.isUserInput = isUserInput;

        function onInit() {
            var collection = templateConfigureService.getCollection(vm.sections);
            var collectionColumnsMap = templateConfigureService.getSectionColumnsMap(collection);
            var service = templateConfigureService.getService(vm.sections);
            var serviceColumnsMap = templateConfigureService.getSectionColumnsMap(service);
            vm.lineItems = _.map(vm.lineItems, function(lineItem) {
                var enhancedLineItem = angular.merge({}, collectionColumnsMap[lineItem.collection], lineItem);
                _.forEach(Object.keys(enhancedLineItem.services), function(serviceName) {
                    enhancedLineItem.services[serviceName] = angular.merge({},
                        serviceColumnsMap[serviceName], enhancedLineItem.services[serviceName]);
                });
                return enhancedLineItem;
            });
        }

        function getColumn(service, collection) {
            return service.name === SERVICE_TYPES.HF ? collection : service;
        }

        function isUserInput(service, collection) {
            return vm.canEdit && columnUtils.isUserInput(getColumn(service, collection));
        }
    }

})();
