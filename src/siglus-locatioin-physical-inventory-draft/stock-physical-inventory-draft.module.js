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
     * @module siglus-locatioin-physical-inventory-draft
     *
     * @description
     * Responsible for initiate requisition screen.
     */
    angular.module('siglus-locatioin-physical-inventory-draft', [
        'angular.filter',
        'ngResource',
        'requisition',
        'requisition-constants',
        'openlmis-i18n',
        'openlmis-auth',
        'openlmis-permissions',
        'openlmis-date',
        'openlmis-facility-program-select',
        'openlmis-uuid',
        'referencedata-facility',
        'referencedata-period',
        'openlmis-form',
        'openlmis-modal',
        'referencedata-program',
        'ui.router',
        'openlmis',
        // SIGLUS-REFACTOR: starts here
        'siglus-requisition-date-picker',
        'siglus-physical-inventory-creation'
        // SIGLUS-REFACTOR: ends here
    ]);

})();
