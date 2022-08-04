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
     * @name siglus-proof-of-delivery-draft-list.controller:SiglusPODDraftListController
     *
     * @description
     * Controller for siglus POD draft list.
     */
    angular
        .module('siglus-proof-of-delivery-draft-list')
        .controller('SiglusPODDraftListController', controller);

    controller.$inject = ['$scope', '$stateParams', '$state',
        'alertService', 'loadingModalService',
        'alertConfirmModalService', 'proofOfDeliveryManageService', 'programName', 'facility'];

    function controller($scope, $stateParams, $state,
                        alertService, loadingModalService,
                        alertConfirmModalService, proofOfDeliveryManageService, programName, facility)  {
        var vm = this;
        vm.$onInit = onInit;

        vm.drafts = [];

        vm.showToolBar = false;

        vm.programName = undefined;
        vm.facilityName = undefined;
        vm.orderCode =  undefined;

        vm.actionMapper = {
            NOT_YET_STARTED: 'stockPhysicalInventory.start',
            DRAFT: 'stockPhysicalInventory.continue',
            SUBMITTED: 'stockIssue.view'
        };

        vm.statusMapperMapper = {
            NOT_YET_STARTED: 'stockIssue.notStarted',
            DRAFT: 'stockIssue.draft',
            SUBMITTED: 'stockIssue.submitted'
        };

        vm.draftType = $stateParams.draftType;

        vm.refreshDraftList = function() {
            loadingModalService.open();
            proofOfDeliveryManageService.getDraftList($stateParams.podId).then(function(result) {
                vm.drafts = result.subDrafts;
                vm.showToolBar = result.canMergeOrDeleteDrafts;
                vm.canSubmitDrafts = result.canSubmitDrafts;

            })
                .catch(function() {
                    $state.go('^', $stateParams, {
                        reload: true
                    });
                })
                .finally(function() {
                    loadingModalService.close();
                });
        };

        function isAllDraftSubmitted() {
            return _.size(_.filter(vm.drafts, function(item) {
                return item.status !== 'SUBMITTED';
            })) === 0;
        }

        vm.mergeDrafts = function() {
            if (isAllDraftSubmitted()) {
                $state.go('openlmis.orders.podManage.draftList.draft', {
                    podId: $stateParams.podId,
                    actionType: 'MERGE'
                });
            } else {
                alertService.error('PhysicalInventoryDraftList.mergeError');
            }
        };

        vm.deleteDrafts = function() {
            alertConfirmModalService.error(
                'PhysicalInventoryDraftList.deleteWarn',
                '',
                ['PhysicalInventoryDraftList.cancel', 'PhysicalInventoryDraftList.confirm']
            ).then(function() {
                loadingModalService.open();
                proofOfDeliveryManageService.deleteAllDraft($stateParams.podId)
                    .then(function() {
                        $state.go('^', {}, {
                            reload: true
                        });
                    })
                    .finally(function() {
                        loadingModalService.close();
                    });
            });
        };

        vm.proceed = function(draft) {
            var stateParams = angular.copy($stateParams);
            stateParams.subDraftId = draft.subDraftId;
            stateParams.actionType = draft.status;
            stateParams.draftNum = draft.groupNum;
            $state.go('openlmis.orders.podManage.draftList.draft', stateParams);
        };

        function onInit() {
            vm.programName = programName;
            vm.orderCode = $stateParams.orderCode;
            vm.facilityName = _.get(facility, 'name');
            vm.refreshDraftList();
        }

    }
})();
