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

describe('openlmis.stockmanagement.stockCardSummaries state', function() {
    /*eslint-disable */
    // SIGLUS-REFACTOR: add facilityFactory, MinimalFacilityDataBuilder, homeFacility, UserDataBuilder, user
    var $q, $state, $rootScope, $location, $templateCache, state, STOCKMANAGEMENT_RIGHTS, authorizationService,
        stockCardRepositoryMock, StockCardSummaryDataBuilder, stockCardSummaries, facilityFactory,
        MinimalFacilityDataBuilder, homeFacility, UserDataBuilder, user, programService, stockProgramUtilService,
        stockCardDataService, siglusProductOrderableGroupService, filteredStockCardSummaries;
    // SIGLUS-REFACTOR: ends here
    /*eslint-enable */

    beforeEach(function() {
        loadModules();
        injectServices();
        prepareTestData();
        prepareSpies();
    });

    it('should be available under \'stockmanagement/stockCardSummaries\'', function() {
        expect($state.current.name).not.toEqual('openlmis.stockmanagement.stockCardSummaries');

        goToUrl('/stockmanagement/stockCardSummaries');

        expect($state.current.name).toEqual('openlmis.stockmanagement.stockCardSummaries');
    });

    it('should resolve stockCardSummaries', function() {
        goToUrl('/stockmanagement/stockCardSummaries?stockCardListPage=0&stockCardListSize=10&program=program-id');

        expect(getResolvedValue('stockCardSummaries')).toEqual(stockCardSummaries);
    });

    it('should call stock card summary repository with parameters', function() {
        goToUrl('/stockmanagement/stockCardSummaries' +
            '?stockCardListPage=0&stockCardListSize=10&facility=facility-id&program=program-id');

        expect(getResolvedValue('stockCardSummaries')).toEqual(stockCardSummaries);
        expect(siglusProductOrderableGroupService.queryStockOnHandsInfo).toHaveBeenCalledWith({
            page: 0,
            size: 2147483647,
            facilityId: 'facility-id',
            programId: 'program-id',
            nonEmptyOnly: true,
            // #103: archive product
            excludeArchived: true,
            // #103: ends here,
            // #225: cant view detail page when not have stock view right
            rightName: 'STOCK_CARDS_VIEW'
            // #225: ends here
        });
    });

    it('should use template', function() {
        spyOn($templateCache, 'get').andCallThrough();

        goToUrl('/stockmanagement/stockCardSummaries');

        expect($templateCache.get).toHaveBeenCalledWith('stock-card-summary-list/stock-card-summary-list.html');
    });

    it('should require stock cards view right to enter', function() {
        expect(state.accessRights).toEqual([STOCKMANAGEMENT_RIGHTS.STOCK_CARDS_VIEW]);
    });

    function loadModules() {
        stockCardRepositoryMock = jasmine.createSpyObj('stockCardSummaryRepository', ['query']);
        module('stock-card-summary-list', function($provide) {
            $provide.factory('StockCardSummaryRepository', function() {
                return function() {
                    return stockCardRepositoryMock;
                };
            });
        });
        // SIGLUS-REFACTOR: starts here
        module('stock-program-util');
        module('stock-card');
        module('stock-orderable-group');
        // SIGLUS-REFACTOR: ends here
    }

    function injectServices() {
        inject(function($injector) {
            $q = $injector.get('$q');
            $state = $injector.get('$state');
            $rootScope = $injector.get('$rootScope');
            siglusProductOrderableGroupService = $injector.get('siglusProductOrderableGroupService');
            $location = $injector.get('$location');
            $templateCache = $injector.get('$templateCache');
            authorizationService = $injector.get('authorizationService');
            STOCKMANAGEMENT_RIGHTS = $injector.get('STOCKMANAGEMENT_RIGHTS');
            StockCardSummaryDataBuilder = $injector.get('StockCardSummaryDataBuilder');
            // SIGLUS-REFACTOR: starts here
            facilityFactory = $injector.get('facilityFactory');
            MinimalFacilityDataBuilder = $injector.get('MinimalFacilityDataBuilder');
            UserDataBuilder = $injector.get('UserDataBuilder');
            programService = $injector.get('programService');
            stockProgramUtilService = $injector.get('stockProgramUtilService');
            stockCardDataService = $injector.get('stockCardDataService');
            // SIGLUS-REFACTOR: ends here
        });
    }

    function prepareTestData() {
        state = $state.get('openlmis.stockmanagement.stockCardSummaries');
        stockCardSummaries = [ {
            orderable: {
                id: 'object-id-1',
                href: 'http://localhost/api/api/orderables/object-id-1'
            },
            stockOnHand: 0,
            stockCardDetails: [  ]
        }, {
            orderable: {
                id: 'object-id-5',
                href: 'http://localhost/api/api/orderables/object-id-5'
            },
            stockOnHand: 0,
            stockCardDetails: [  ]
        } ];
        filteredStockCardSummaries = stockCardSummaries;
        // SIGLUS-REFACTOR: starts here
        homeFacility = new MinimalFacilityDataBuilder().build();
        user = new UserDataBuilder()
            .withHomeFacilityId(homeFacility.id)
            .build();
        // SIGLUS-REFACTOR: ends here
    }

    function prepareSpies() {
        stockCardRepositoryMock.query.andReturn($q.when({
            content: stockCardSummaries
        }));
        spyOn(authorizationService, 'hasRight').andReturn(true);
        // SIGLUS-REFACTOR: starts here
        spyOn(authorizationService, 'getUser').andReturn($q.resolve(user));
        spyOn(facilityFactory, 'getUserHomeFacility').andReturn($q.resolve(homeFacility));
        spyOn(siglusProductOrderableGroupService, 'queryStockOnHandsInfo').andReturn($q.resolve(stockCardSummaries));
        spyOn(programService, 'getAllProductsProgram').andReturn($q.resolve([]));
        spyOn(stockProgramUtilService, 'getPrograms').andReturn($q.resolve([]));
        // SIGLUS-REFACTOR: ends here
    }

    function getResolvedValue(name) {
        return $state.$current.locals.globals[name];
    }

    function goToUrl(url) {
        $location.url(url);
        $rootScope.$apply();
    }
});
