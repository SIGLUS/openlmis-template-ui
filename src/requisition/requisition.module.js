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
     * @module
     *
     * @description
     * Main requisition module that provides basic logic.
     */
    angular.module('requisition', [
        'ngResource',
        'requisition-constants',
        'requisition-template',
        'requisition-validation',
        'openlmis-date',
        'openlmis-i18n',
        'openlmis-local-storage',
        'openlmis-modal',
        'openlmis-offline',
        'openlmis-pagination',
        'openlmis-rights',
        'openlmis-urls',
        'openlmis-auth',
        'openlmis-main-state',
        'openlmis-uuid',
        'referencedata-facility',
        'referencedata-program',
        'referencedata-period',
        'referencedata-orderable',
        'referencedata-facility-type-approved-product',
        'referencedata',
        'ui.router',
        'openlmis-database',
        // #105: activate archived product
        'stock-archived-product'
        // #105: ends here
    ]);

})();
