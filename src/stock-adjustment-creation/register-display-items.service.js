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
     * @name stock-adjustment-creation.registerDisplayItemsService
     *
     * @description
     * Registers and provides display items.
     */
    angular
        .module('stock-adjustment-creation')
        .factory('registerDisplayItemsService', factory);

    factory.$inject = ['paginationService', 'stockAdjustmentCreationService'];

    function factory(paginationService, stockAdjustmentCreationService) {
        return function(stateParams) {
            var validator = function(item) {
                return _.chain(item.$errors).keys()
                    .all(function(key) {
                        return item.$errors[key] === false;
                    })
                    .value();
            };
            // #284: lost data when changing page
            var searchResult = stockAdjustmentCreationService.search(stateParams.keyword, stateParams.addedLineItems);
            return paginationService.registerList(validator, stateParams, function() {
                return searchResult || [];
            });
            // #284: ends here
        };
    }
})();
