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
     * @name admin-template-configure-kit-usage.controller:KitUsageTemplateController
     *
     * @description
     * Controller for template view page.
     */
    angular
        .module('admin-template-configure-kit-usage')
        .controller('KitUsageTemplateController', KitUsageTemplateController);

    KitUsageTemplateController.$inject = ['COLUMN_SOURCES', 'templateConfigureService', 'template', 'tags'];

    function KitUsageTemplateController(COLUMN_SOURCES, templateConfigureService, template, tags) {
        var vm = this;

        vm.$onInit = onInit;
        vm.addCollectionColumn = addCollectionColumn;
        vm.addServiceColumn = addServiceColumn;

        vm.template = undefined;

        vm.tags = undefined;

        function onInit() {
            vm.template = template;
            vm.tags = tags;
            enableCurrentSection();
            vm.collection = templateConfigureService.getCollection(template.kitUsage);
            vm.service = templateConfigureService.getService(template.kitUsage);
        }

        function enableCurrentSection() {
            if (!vm.template.extension) {
                vm.template.extension = {};
            }
            vm.template.extension.enableKitUsage = true;
        }

        function addCollectionColumn() {
            vm.collection.columns.push(angular.merge({}, templateConfigureService.getDefaultColumn(), {
                columnDefinition: {
                    sources: [COLUMN_SOURCES.STOCK_CARDS, COLUMN_SOURCES.USER_INPUT]
                }
            }));
        }

        function addServiceColumn() {
            vm.service.columns.push(angular.merge({}, templateConfigureService.getDefaultColumn(), {
                source: COLUMN_SOURCES.USER_INPUT,
                columnDefinition: {
                    sources: [COLUMN_SOURCES.USER_INPUT],
                    supportsTag: false
                }
            }));
        }
    }
})();
