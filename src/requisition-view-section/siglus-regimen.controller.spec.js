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

describe('SiglusRegimentController', function() {

    var vm, columnsDefination, sections, $controller, requisitionUtils, selectProductsModalService, $q, $rootScope;

    beforeEach(function() {
        module('requisition-view-section');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            requisitionUtils = $injector.get('requisitionUtils');
            selectProductsModalService = $injector.get('selectProductsModalService');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
        });
        columnsDefination = [{
            name: 'patients',
            label: 'Total patients',
            indicator: 'RE',
            displayOrder: 0,
            isDisplayed: true,
            option: null,
            definition: 'record the number of patients',
            tag: null,
            source: 'USER_INPUT',
            id: '60a3a5ab-7f59-45f8-af98-e79ff8c1818d'
        }, {
            name: 'community',
            label: 'Community pharmacy',
            indicator: 'RE',
            displayOrder: 1,
            isDisplayed: true,
            option: null,
            definition: 'record the number of patients in community pharmacy',
            tag: null,
            source: 'USER_INPUT',
            id: '30d4e767-a206-4eb1-bea0-1ff3a48da633'
        }];
        sections = [{
            name: 'regimen',
            columns: columnsDefination
        }, {
            name: 'summary',
            columns: columnsDefination
        }];

        spyOn(requisitionUtils, 'getBasicLineItemsTotal').andReturn(1);
        vm = $controller('SiglusRegimentController');
        vm.sections = sections;
        vm.regimenLineItems = [{
            columns: {
                community: {
                    id: '1',
                    value: undefined
                }
            },
            regimen: {
                fullProductName: 'AZT+3TC+EFV (2FDC+EFV 200)',
                regimenDispatchLine: {
                    name: 'Outros'
                }
            }
        }];
        vm.regimenDispatchLineItems = [{
            columns: {
                patients: {
                    id: '2',
                    value: undefined
                }
            },
            regimenDispatchLine: {
                name: 'Outros'
            }
        }];
        vm.$onInit();
    });

    describe('onInit', function() {
        it('should set regimenSection', function() {
            expect(vm.regimenSection).toEqual({
                name: 'regimen',
                columns: columnsDefination
            });
        });

        it('should set summarySection', function() {
            expect(vm.summarySection).toEqual({
                name: 'summary',
                columns: columnsDefination
            });
        });

        it('should enhance regimenLineItems with regimen config date', function() {
            expect(vm.regimenLineItems).toEqual([{
                columns: {
                    community: {
                        id: '1',
                        value: undefined,
                        name: 'community',
                        label: 'Community pharmacy',
                        indicator: 'RE',
                        displayOrder: 1,
                        isDisplayed: true,
                        option: null,
                        definition: 'record the number of patients in community pharmacy',
                        tag: null,
                        source: 'USER_INPUT'
                    }
                },
                regimen: {
                    fullProductName: 'AZT+3TC+EFV (2FDC+EFV 200)',
                    regimenDispatchLine: {
                        name: 'Outros'
                    }
                }
            }]);
        });

        it('should enhance regimenDispatchLineItems with regimen config date', function() {
            expect(vm.regimenDispatchLineItems).toEqual([{
                columns: {
                    patients: {
                        id: '2',
                        value: undefined,
                        name: 'patients',
                        label: 'Total patients',
                        indicator: 'RE',
                        displayOrder: 0,
                        isDisplayed: true,
                        option: null,
                        definition: 'record the number of patients',
                        tag: null,
                        source: 'USER_INPUT'
                    }
                },
                regimenDispatchLine: {
                    name: 'Outros'
                }
            }]);
        });
    });

    describe('validateTotal', function() {

        it('should return nothing when total is 1', function() {
            expect(vm.validateTotal(vm.regimenLineItems, vm.regimenLineItems[0].columns.community)).toBeUndefined();
        });

        it('should return nothing when total is 2147483647', function() {
            requisitionUtils.getBasicLineItemsTotal.andReturn(2147483647);

            expect(vm.validateTotal(vm.regimenLineItems, vm.regimenLineItems[0].columns.community)).toBeUndefined();
        });

        it('should return error message when total is 2147483648', function() {
            requisitionUtils.getBasicLineItemsTotal.andReturn(2147483648);

            expect(vm.validateTotal(vm.regimenLineItems, vm.regimenLineItems[0].columns.community))
                .toBe('requisitionValidation.numberTooLarge');
        });
    });

    describe('addRegimen', function() {
        beforeEach(function() {
            vm.customRegimens = [{
                active: true,
                code: 'TDF+3TC+LPV/r',
                displayOrder: 34,
                fullProductName: 'TDF+3TC+LPV/r',
                id: 'd5cc175e-e05d-11e9-a67f-0242ac1a0008',
                isCustom: true,
                programId: '10845cb9-d365-4aaa-badd-b4fa39c6a26a',
                regimenCategory: {
                    displayOrder: 1,
                    id: '3d250db0-de25-11e9-8785-0242ac130007',
                    name: 'Adults'
                }
            }, {
                active: true,
                code: 'AZT+3TC+LPV/r (2DFC+LPV/r 80/20)',
                displayOrder: 26,
                fullProductName: 'AZT+3TC+LPV/r (2DFC+LPV/r 80/20)',
                id: 'd5cbbaac-e05d-11e9-a67f-0242ac1a0008',
                isCustom: true,
                programId: '10845cb9-d365-4aaa-badd-b4fa39c6a26a',
                regimenCategory: {
                    displayOrder: 2,
                    id: '3d251de6-de25-11e9-8785-0242ac130007',
                    name: 'Paediatrics'
                }
            }];
        });

        it('should add Adults regimen when category is Adults', function() {
            spyOn(selectProductsModalService, 'show').andReturn($q.resolve([vm.customRegimens[0]]));
            vm.addRegimen('Adults');
            $rootScope.$apply();

            expect(selectProductsModalService.show).toHaveBeenCalledWith({
                products: [vm.customRegimens[0]],
                state: '.addRegimens'
            });

            expect(vm.regimenLineItems[1]).toEqual({
                columns: {
                    patients: {
                        name: 'patients',
                        label: 'Total patients',
                        indicator: 'RE',
                        displayOrder: 0,
                        isDisplayed: true,
                        option: null,
                        definition: 'record the number of patients',
                        tag: null,
                        source: 'USER_INPUT',
                        id: null
                    },
                    community: {
                        name: 'community',
                        label: 'Community pharmacy',
                        indicator: 'RE',
                        displayOrder: 1,
                        isDisplayed: true,
                        option: null,
                        definition: 'record the number of patients in community pharmacy',
                        tag: null,
                        source: 'USER_INPUT',
                        id: null
                    }
                },
                regimen: vm.customRegimens[0]
            });
        });

        it('should be filter out when regimen is already added', function() {
            spyOn(selectProductsModalService, 'show').andReturn($q.resolve([vm.customRegimens[0]]));
            vm.addRegimen('Adults');
            $rootScope.$apply();
            vm.addRegimen('Adults');
            $rootScope.$apply();

            expect(selectProductsModalService.show.calls[1].args[0]).toEqual({
                products: [],
                state: '.addRegimens'
            });
        });
    });

    describe('removeRegimen', function() {

        it('should remove the regimen', function() {
            vm.removeRegimen(vm.regimenLineItems[0]);

            expect(vm.regimenLineItems.length).toBe(0);
        });
    });
});
