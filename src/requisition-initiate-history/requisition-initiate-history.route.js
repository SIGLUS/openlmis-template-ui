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
        .module('requisition-initiate-history')
        .config(routes);

    routes.$inject = ['$stateProvider', 'INITRNR_LABEL', 'REQUISITION_RIGHTS'];

    function routes($stateProvider, INITRNR_LABEL, REQUISITION_RIGHTS) {
        [INITRNR_LABEL.CREATE_AUTHORIZE, INITRNR_LABEL.CREATE, INITRNR_LABEL.AUTHORIZE].forEach(function(right) {
            addStateForRight(right);
        });

        function addStateForRight(right) {
            $stateProvider.state('openlmis.requisitions.' + right + '.history', {
                url: '/history?supervised&program&facility&emergency&report&page&size',
                params: {
                    page: '0',
                    size: '1000',
                    sort: ['createdDate,desc']
                },
                controller: 'RequisitionInitiateHistoryController',
                controllerAs: 'vm',
                templateUrl: 'requisition-initiate-history/requisition-initiate-history.html',
                accessRights: [
                    REQUISITION_RIGHTS.REQUISITION_CREATE,
                    REQUISITION_RIGHTS.REQUISITION_DELETE,
                    REQUISITION_RIGHTS.REQUISITION_AUTHORIZE
                ],
                resolve: {
                    facilities: function(requisitionSearchService) {
                        return requisitionSearchService.getFacilities();
                    },
                    program: function($stateParams, programService) {
                        return programService.get($stateParams.program);
                    },
                    requisitions: function(paginationService, requisitionService, $stateParams) {
                        return paginationService.registerUrl($stateParams, function(stateParams) {
                            if (stateParams.facility) {
                                var offlineFlag = stateParams.offline;
                                delete stateParams.offline;
                                return requisitionService.search(offlineFlag === 'true', {
                                    facility: stateParams.facility,
                                    program: stateParams.program,
                                    emergency: stateParams.emergency,
                                    page: stateParams.page,
                                    size: stateParams.size,
                                    sort: stateParams.sort
                                });
                            }
                            return undefined;
                        });
                    }
                }
            });
        }
    }

})();
