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
     * @ngdoc filter
     * @name stock-archived-product.filter:archivedProductName
     *
     * @description
     * Add archived tag for archived product name.
     *
     * @param   {Object} orderableGroup
     * @return  {String}
     */
    angular
        .module('stock-archived-product')
        .filter('archivedProductName', archivedProductNameFilter);

    function archivedProductNameFilter() {
        return function(orderableGroup) {
            if (!orderableGroup) {
                return undefined;
            }

            var archived = orderableGroup.find(function(item) {
                return item.archived;
            });
            var name = '';

            if (archived) {
                name = '[archived]' + orderableGroup[0].orderable.fullProductName;
            } else {
                name = orderableGroup[0].orderable.fullProductName;
            }
            return name;
        };
    }

})();
