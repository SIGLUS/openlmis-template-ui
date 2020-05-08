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
     * @ngdoc service
     * @name stock-confirm-discard.confirmDiscardService
     *
     * @description
     * Service allows to register handler on window's beforeunload event and confirm service.
     */
    angular.module('stock-confirm-discard')
        .service('confirmDiscardService', confirmDiscardService);

    confirmDiscardService.$inject = ['$state', 'loadingModalService', 'confirmService'];

    function confirmDiscardService($state, loadingModalService, confirmService) {

        /**
         * @ngdoc method
         * @methodOf stock-confirm-discard.confirmDiscardService
         * @name register
         *
         * @description
         * Register handler on window's beforeunload event and confirm service.
         *
         * @param {Object} scope               The scope will register event handler
         * @param {String} transitionStateName The state should not be prevented
         */
        this.register = function(scope, transitionStateName) {
            var isConfirmQuit = false;
            var isConfirmModalOpening = false;

            window.onbeforeunload = askConfirm;

            function askConfirm() {
                if (scope.needToConfirm) {
                    // According to the document of https://www.chromestatus.com/feature/5349061406228480,
                    // we can't custom messages in onbeforeunload dialogs now.
                    return '';
                }
            }
            scope.$on('$stateChangeStart', function(event, toState) {
                // SIGLUS-REFACTOR: starts here
                // skip check when just change page
                if (scope.isInitialInventory
                    && (toState.name === 'openlmis.stockmanagement.initialInventory'
                        || toState.name === 'auth.login')) {
                    return;
                }
                // SIGLUS-REFACTOR: ends here

                if (shouldConfirmTransition(transitionStateName, toState, isConfirmQuit) && scope.needToConfirm) {
                    event.preventDefault();
                    loadingModalService.close();
                    if (!isConfirmModalOpening) {
                        confirmService.confirm('stockConfirmDiscard.discardDraft', 'stockConfirmDiscard.leave')
                            .then(function() {
                                isConfirmQuit = true;
                                isConfirmModalOpening = false;
                                window.onbeforeunload = null;
                                // SIGLUS-REFACTOR: starts here
                                if (scope.isInitialInventory) {
                                    $state.go('openlmis.home');
                                } else {
                                    $state.go(toState.name);
                                }
                                // SIGLUS-REFACTOR: ends here
                            }, function() {
                                isConfirmModalOpening = false;
                            });
                    }
                    isConfirmModalOpening = true;
                    // SIGLUS-REFACTOR: starts here
                } else if (shouldConfirmTransition(transitionStateName, toState, isConfirmQuit) &&
                    scope.isInitialInventory) {
                    $state.go('openlmis.home');
                    // SIGLUS-REFACTOR: ends here
                } else {
                    window.onbeforeunload = null;
                }
            });
        };

        function shouldConfirmTransition(transitionStateName, toState, isConfirmQuit) {
            var isPreventedState = toState.name !== 'auth.login' && toState.name !== transitionStateName;
            return toState.name !== $state.current.name && !isConfirmQuit && isPreventedState;
        }
    }
})();
