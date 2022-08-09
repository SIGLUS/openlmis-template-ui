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
     * @module proof-of-delivery-view
     *
     * @description
     * Responsible for view POD screen.
     */
    angular.module('proof-of-delivery-view', [
        'openlmis-i18n',
        'fulfillment',
        'proof-of-delivery',
        'openlmis-date',
        'openlmis-pagination',
        'order',
        'ui.router',
        'shipment',
        'stock-constants',
        'stock-valid-reason',
        'stock-reasons-modal',
        'openlmis-state-tracker',
        // SIGLUS-REFACTOR: starts here
        'siglus-order-status-messages',
        'siglus-alert-confirm-modal'
        // SIGLUS-REFACTOR: starts here
    ]);
})();
