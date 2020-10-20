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

describe('StockCardSummaryListController', function() {
    // SIGLUS-REFACTOR: add programs, facility
    var $controller, $state, implMock, StockCardSummaryDataBuilder, vm, stockCardSummaries, stateParams,
        programs, facility, stockCardDataService, $scope, $rootScope;
    // SIGLUS-REFACTOR: ends here

    beforeEach(function() {
        module('stock-card');
        module('stock-card-summary-list', function($provide) {
            implMock = jasmine.createSpyObj('impl', ['print']);

            $provide.factory('StockCardSummaryRepositoryImpl', function() {
                return function() {
                    return implMock;
                };
            });
        });

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            StockCardSummaryDataBuilder = $injector.get('StockCardSummaryDataBuilder');
            stockCardDataService = $injector.get('stockCardDataService');
        });

        stockCardSummaries = [
            new StockCardSummaryDataBuilder().build(),
            new StockCardSummaryDataBuilder().build()
        ];

        stateParams = {
            param: 'param'
        };

        // SIGLUS-REFACTOR: starts here
        programs = [{
            name: 'program',
            id: 'program'
        }];

        facility = {
            id: 'facility'
        };

        vm = $controller('StockCardSummaryListController', {
            stockCardSummaries: stockCardSummaries,
            $stateParams: stateParams,
            user: {},
            programs: programs,
            facility: facility,
            stockCardDataService: stockCardDataService,
            $scope: $scope
            // SIGLUS-REFACTOR: ends here
        });
        vm.$onInit();

        vm.program = {
            id: 'program'
        };
        vm.isSupervised = true;

        spyOn($state, 'go').andReturn(true);
    });

    describe('onInit', function() {

        it('should expose stockCardSummaries', function() {
            expect(vm.stockCardSummaries).toEqual(stockCardSummaries);
        });
    });

    describe('loadStockCardSummaries', function() {

        // #146: archived product list
        it('should call state go with openlmis.stockmanagement.stockCardSummaries', function() {
            vm.loadStockCardSummaries();

            expect($state.go).toHaveBeenCalledWith('openlmis.stockmanagement.stockCardSummaries', {
                param: 'param',
                facility: 'facility',
                program: 'program',
                supervised: true
            }, {
                reload: true
            });
        });

        it('should call state go with openlmis.stockmanagement.archivedProductSummaries', function() {
            vm.isArchivedProducts = true;
            vm.loadStockCardSummaries();

            expect($state.go).toHaveBeenCalledWith('openlmis.stockmanagement.archivedProductSummaries', {
                param: 'param',
                facility: 'facility',
                program: 'program',
                supervised: true
            }, {
                reload: true
            });
        });
        // #146: ends here
    });

    describe('viewSingleCard', function() {
        // #146: archived product list
        it('should call state go with openlmis.stockmanagement.stockCardSummaries.singleCard', function() {
            vm.viewSingleCard('stock-card-id');

            expect($state.go).toHaveBeenCalledWith('openlmis.stockmanagement.stockCardSummaries.singleCard', {
                stockCardId: 'stock-card-id',
                isViewProductCard: false,
                page: 0
            });
        });

        it('should call state go with openlmis.stockmanagement.archivedProductSummaries.singleCard', function() {
            vm.isArchivedProducts = true;
            vm.viewSingleCard('stock-card-id');

            expect($state.go).toHaveBeenCalledWith('openlmis.stockmanagement.archivedProductSummaries.singleCard', {
                stockCardId: 'stock-card-id',
                isViewProductCard: false,
                page: 0
            });
        });
        // #146: ends here
    });

    describe('print', function() {

        it('should call state go with proper parameters', function() {
            vm.print();

            expect(implMock.print).toHaveBeenCalledWith('program', 'facility');
        });
    });

    // #146: archived product list
    describe('viewProductStockCard', function() {

        it('should call state go with openlmis.stockmanagement.stockCardSummaries.singleCard', function() {
            vm.viewProductStockCard('orderable-id');

            expect($state.go).toHaveBeenCalledWith('openlmis.stockmanagement.stockCardSummaries.singleCard', {
                orderable: 'orderable-id',
                isViewProductCard: true,
                page: 0
            });
        });

        it('should call state go with openlmis.stockmanagement.archivedProductSummaries.singleCard', function() {
            vm.isArchivedProducts = true;
            vm.viewProductStockCard('orderable-id');

            expect($state.go).toHaveBeenCalledWith('openlmis.stockmanagement.archivedProductSummaries.singleCard', {
                orderable: 'orderable-id',
                isViewProductCard: true,
                page: 0
            });
        });
    });
    // #146: ends here
});
