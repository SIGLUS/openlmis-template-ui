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
     * @name stock-card-summary-list.controller:StockCardSummaryListController
     *
     * @description
     * Controller responsible displaying Stock Card Summaries.
     */
    angular
        .module('stock-card-summary-list')
        .controller('StockCardSummaryListController', controller);

    controller.$inject = [
        'loadingModalService', '$state', '$stateParams', 'StockCardSummaryRepositoryImpl', 'filteredStockCardSummaries',
        'user', 'facility', 'programs', '$scope', 'stockCardDataService', 'SIGLUS_TIME', '$q', 'localStorageService',
        '$window', 'moment'
    ];
    function controller(
        loadingModalService, $state, $stateParams, StockCardSummaryRepositoryImpl, filteredStockCardSummaries,
        user, facility, programs, $scope, stockCardDataService, SIGLUS_TIME, $q, localStorageService,
        $window, moment
    ) {
        var vm = this;

        vm.$onInit = onInit;
        vm.loadStockCardSummaries = loadStockCardSummaries;
        vm.viewSingleCard = viewSingleCard;
        vm.print = print;
        vm.removeExpiredProducts = removeExpiredProducts;

        // SIGLUS-REFACTOR: starts here
        vm.viewProductStockCard = viewProductStockCard;

        vm.programs = [];
        vm.program = null;
        vm.facility = facility;
        vm.isArchivedProducts = false;
        vm.isLocationManagement = false;

        /**
         * @ngdoc property
         * @propertyOf stock-card-summary-list.controller:StockCardSummaryListController
         * @name stockCardSummaries
         * @type {Array}
         *
         * @description
         * List of Stock Card Summaries.
         */
        vm.stockCardSummaries = [];

        /**
         * @ngdoc method
         * @methodOf stock-card-summary-list.controller:StockCardSummaryListController
         * @name getStockSummaries
         *
         * @description
         * Initialization method for StockCardSummaryListController.
         */
        function onInit() {
            vm.keyword = $stateParams.keyword;
            vm.isArchivedProducts = $stateParams.isArchivedProducts;
            vm.isLocationManagement = $stateParams.isLocationManagement;
            vm.stockCardSummaries = filteredStockCardSummaries;

            vm.programs = _.filter(programs, function(program) {
                return program.code !== 'MMC' && program.code !== 'ML';
            });

            vm.program = _.find(programs, function(p) {
                return p.id === $stateParams.program;
            });
        }

        /**
         * @ngdoc method
         * @methodOf stock-card-summary-list.controller:StockCardSummaryListController
         * @name loadStockCardSummaries
         *
         * @description
         * Responsible for retrieving Stock Card Summaries based on selected program and facility.
         */
        function loadStockCardSummaries() {
            var stateParams = angular.copy($stateParams);

            stateParams.facility = vm.facility && vm.facility.id;
            stateParams.program = vm.program && vm.program.id;
            stateParams.supervised = vm.isSupervised;
            stateParams.stockCardListPage = 0;
            if (vm.isLocationManagement) {
                $state.go(
                    'openlmis.locationManagement.archivedProductSummaries',
                    stateParams,
                    {
                        reload: true
                    }
                );
            } else {
                $state.go(
                    vm.isArchivedProducts
                        ? 'openlmis.stockmanagement.archivedProductSummaries'
                        : 'openlmis.stockmanagement.stockCardSummaries',
                    stateParams,
                    {
                        reload: true
                    }
                );
            }

        }

        /**
         * @ngdoc method
         * @methodOf stock-card-summary-list.controller:StockCardSummaryListController
         * @name viewSingleCard
         *
         * @description
         * Go to the clicked stock card's page to view its details.
         *
         * @param {string} stockCardId the Stock Card UUID
         */
        function viewSingleCard(stockCardId) {
            $state.go(
                vm.isArchivedProducts
                    ? 'openlmis.stockmanagement.archivedProductSummaries.singleCard'
                    : 'openlmis.stockmanagement.stockCardSummaries.singleCard',
                {
                    stockCardId: stockCardId,
                    isViewProductCard: false,
                    page: 0
                }
            );
        }

        /**
         * @ngdoc method
         * @methodOf stock-card-summary-list.controller:StockCardSummaryListController
         * @name print
         *
         * @description
         * Print SOH summary of current selected program and facility.
         */
        function print() {
            localStorageService.add('stockCardSummariesPrint', JSON.stringify(
                _.get(stockCardDataService.getDisplaySummary(angular.merge($stateParams, {
                    size: '2147483647',
                    page: '0'
                })), ['content'])
            ));
            var PRINT_URL = $window.location.href.split('!/')[0]
                    + '!/'
                    + 'stockmanagement/stockCardSummaries/print?program='
                    + $stateParams.program;
            $window.open(
                PRINT_URL,
                '_blank'
            );
        }

        function removeExpiredProducts() {
            $state.go('openlmis.stockmanagement.expiredProducts');
        }

        function viewProductStockCard(orderableId) {
            if (!vm.isArchivedProducts) {
                $state.go('openlmis.stockmanagement.stockCardSummaries.productCard', {
                    orderable: orderableId,
                    page: 0
                });
                return;
            }
            if (vm.isLocationManagement) {
                $state.go(
                    'openlmis.locationManagement.archivedProductSummaries.productDetail',
                    {
                        orderable: orderableId,
                        isViewProductCard: true,
                        page: 0
                    }
                );
            } else {
                $state.go(
                    'openlmis.stockmanagement.archivedProductSummaries.singleCard',
                    {
                        orderable: orderableId,
                        isViewProductCard: true,
                        page: 0
                    }
                );
            }

        }

        $scope.$on('$stateChangeStart', function(_e, toState, _toParams, fromState) {
            if (toState.name !== fromState.name) {
                stockCardDataService.clear();
            }
        });
        // SIGLUS-REFACTOR: ends here

        // SIGLUS-REFACTOR: starts here
        vm.search = function() {
            $stateParams.keyword = vm.keyword;
            return reload();
        };

        vm.doCancelFilter = function() {
            if (vm.keyword) {
                vm.keyword = null;
                $stateParams.keyword = null;
                reload();
            }
        };

        $scope.$watch(function() {
            return vm.keyword;
        }, function(newValue, oldValue) {
            if (oldValue && !newValue && $stateParams.keyword) {
                $stateParams.keyword = null;
                reload();
            }
        });

        function reload() {
            loadingModalService.open();
            return delayPromise(SIGLUS_TIME.LOADING_TIME).then(function() {
                var stateParams = angular.copy($stateParams);
                stateParams.facility = vm.facility && vm.facility.id;
                stateParams.program = vm.program && vm.program.id;
                stateParams.supervised = vm.isSupervised;
                stateParams.keyword = vm.keyword;

                if (vm.isLocationManagement) {
                    $state.go(
                        'openlmis.locationManagement.archivedProductSummaries',
                        stateParams,
                        {
                            reload: true
                        }
                    );
                } else {
                    $state.go(
                        vm.isArchivedProducts
                            ? 'openlmis.stockmanagement.archivedProductSummaries'
                            : 'openlmis.stockmanagement.stockCardSummaries',
                        stateParams,
                        {
                            reload: true
                        }
                    );
                }
            });
        }

        function delayPromise(delay) {
            var deferred = $q.defer();
            setTimeout(function() {
                deferred.resolve();
            }, delay);
            return deferred.promise;
        }
        // SIGLUS-REFACTOR: ends here

        vm.formatDate = function(date) {
            return moment(date).format('YYYY-MM-DD');
        };
    }
})();
