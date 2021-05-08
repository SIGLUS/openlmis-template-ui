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
    /**
    * @ngdoc filter
    * @name order-status-messages.orderStatus
    *
    * @description Change text to start with upperCase letter.
    *
    * @param {Object} status Status to be formatted
    *
    * @example
    * We want to display a status inside of a table
    * ```
    * <td>{{someStatus | orderStatus}}</td>
    * ```
    */
    angular
        .module('siglus-order-status-messages')
        .filter('orderStatus', filter);

    filter.$inject = ['ORDER_STATUS', 'messageService'];

    function filter(ORDER_STATUS, messageService) {
        return statusFilter;

        function statusFilter(status) {
            return messageService.get(ORDER_STATUS.$getDisplayName(status));
        }
    }
})();
