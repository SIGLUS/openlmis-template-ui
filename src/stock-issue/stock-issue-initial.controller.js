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
     * @name stock-adjustment.controller:StockAdjustmentController
     *
     * @description
     * Controller for making adjustment.
     */
    angular
        .module('stock-issue')
        .controller('StockIssueInitialController', controller);

    // SIGLUS-REFACTOR: add user, drafts
    controller.$inject = ['$stateParams', 'facility', 'programs', 'adjustmentType',
        '$state', 'user', 'siglusInitialIssueModalService',
        'siglusStockIssueService', 'DRAFT_TYPE', 'loadingModalService', 'siglusStockUtilsService',
        'siglusStockDispatchService', 'moduleType'];
    // SIGLUS-REFACTOR: ends here

    function controller($stateParams, facility, programs, adjustmentType, $state, user,
                        siglusInitialIssueModalService, siglusStockIssueService,
                        DRAFT_TYPE,
                        loadingModalService, siglusStockUtilsService, siglusStockDispatchService, moduleType) {
        var vm = this;

        /**
         * @ngdoc property
         * @propertyOf stock-adjustment.controller:StockAdjustmentController
         * @name facility
         * @type {Object}
         *
         * @description
         * Holds user's home facility.
         */
        vm.facility = facility;

        vm.initialDraftInfo = {};

        /**
         * @ngdoc property
         * @propertyOf stock-adjustment.controller:StockAdjustmentController
         * @name programs
         * @type {Array}
         *
         * @description
         * Holds available programs for home facility.
         */
        vm.programs = programs;

        vm.hasExistInitialDraft = false;

        vm.draftType = DRAFT_TYPE[moduleType][adjustmentType.state];

        vm.key = function(secondaryKey) {
            return adjustmentType.prefix + '.' + secondaryKey;
        };

        vm.proceedForIssue = function(program) {
            $state.go('openlmis.' + moduleType + '.' + adjustmentType.state + '.draft', {
                facility: facility,
                programId: program.id,
                initialDraftId: vm.initialDraftInfo.id,
                initialDraftInfo: vm.initialDraftInfo,
                draftType: adjustmentType.state,
                moduleType: moduleType
            });
        };

        vm.start = function(program) {
            siglusInitialIssueModalService.show(program.id, facility.id, adjustmentType.state, moduleType)
                .then(function(loadIssueToInfo) {
                    if (loadIssueToInfo) {
                        loadingModalService.open();
                        siglusStockDispatchService.queryInitialDraftInfo(program.id,
                            vm.draftType, moduleType, facility.id)
                            .then(function(data) {
                                vm.initialDraftInfo = data;
                                vm.hasExistInitialDraft = true;
                            })
                            .finally(function() {
                                loadingModalService.close();
                            });
                    }
                });
        };

        vm.$onInit = function() {
            loadingModalService.open();
            siglusStockDispatchService.queryInitialDraftInfo(
                _.get(programs, [0, 'id']), vm.draftType, moduleType, facility.id
            ).then(function(data) {
                vm.initialDraftInfo = data;
                vm.hasExistInitialDraft = siglusStockUtilsService.isExistInitialDraft(data, adjustmentType.state);
            })
                .finally(function() {
                    loadingModalService.close();
                });
        };
    }
})();
