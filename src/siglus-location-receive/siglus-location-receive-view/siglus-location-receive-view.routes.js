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
        .module('siglus-location-receive')
        .config(routes);

    routes.$inject = ['$stateProvider', 'STOCKMANAGEMENT_RIGHTS', 'SEARCH_OPTIONS', 'ADJUSTMENT_TYPE'];

    function routes($stateProvider, STOCKMANAGEMENT_RIGHTS, SEARCH_OPTIONS, ADJUSTMENT_TYPE) {
        $stateProvider.state('openlmis.locationManagement.receive.draft.view', {
            url: '/:draftId/view?page&size&keyword',
            views: {
                '@openlmis': {
                    controller: 'SiglusLocationReceiveViewController',
                    templateUrl: 'siglus-location-receive/siglus-location-receive-view/' +
                        'siglus-location-receive-view.html',
                    controllerAs: 'vm'
                }
            },
            accessRights: [STOCKMANAGEMENT_RIGHTS.STOCK_ADJUST],
            params: {
                program: undefined,
                facility: undefined,
                displayItems: undefined,
                addedLineItems: undefined,
                draft: undefined,
                size: '50',
                page: '0',
                initialDraftInfo: undefined
            },
            resolve: {
                type: function($stateParams, DRAFT_TYPE) {
                    var moduleType = $stateParams.moduleType;
                    var draftType = $stateParams.draftType;
                    return DRAFT_TYPE[moduleType][draftType];
                },
                initialDraftInfo: function($stateParams, siglusStockIssueLocationService, type) {
                    if ($stateParams.initialDraftInfo) {
                        return $stateParams.initialDraftInfo;
                    }

                    return siglusStockIssueLocationService.queryInitialDraftInfo($stateParams.programId, type)
                        .then(function(result) {
                            return result[0];
                        });
                },
                adjustmentType: function() {
                    return ADJUSTMENT_TYPE.RECEIVE;
                },
                draft: function($stateParams, siglusStockIssueLocationService) {
                    if ($stateParams.draft) {
                        return $stateParams.draft;
                    }
                    return siglusStockIssueLocationService.getDraftById($stateParams.initialDraftId,
                        $stateParams.draftId);
                },
                addedLineItems: function(draft) {
                    return draft.lineItems;
                }
            }
        });
    }
})();
