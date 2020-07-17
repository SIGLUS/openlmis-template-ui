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
     * @ngdoc object
     * @name order.ORDER_STATUS
     *
     * @description
     * Contains all possible order statuses.
     */
    angular
        .module('order')
        .constant('ORDER_STATUS', status());

    function status() {

        return {
            ORDERED: 'ORDERED',
            FULFILLING: 'FULFILLING',
            SHIPPED: 'SHIPPED',
            RECEIVED: 'RECEIVED',
            TRANSFER_FAILED: 'TRANSFER_FAILED',
            IN_ROUTE: 'IN_ROUTE',
            READY_TO_PACK: 'READY_TO_PACK',
            // #400: Facility user partially fulfill an order and create sub-order for an requisition
            PARTIALLY_FULFILLED: 'PARTIALLY_FULFILLED'
            // #400: ends here
        };
    }

})();
