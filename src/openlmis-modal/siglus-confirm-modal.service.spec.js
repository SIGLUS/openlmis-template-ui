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

describe('siglusConfirmModalService', function() {

    beforeEach(function() {
        module('openlmis-modal');

        inject(function($injector) {
            this.siglusConfirmModalService = $injector.get('siglusConfirmModalService');
            this.openlmisModalService = $injector.get('openlmisModalService');
        });

        spyOn(this.openlmisModalService, 'createDialog');
    });

    describe('confirm', function() {

        it('should open modal with default values', function() {
            this.openlmisModalService.createDialog.andCallFake(function(options) {
                expect(options.resolve.className()).toEqual('primary');
                expect(options.resolve.message()).toEqual('someMessage');
                expect(options.resolve.firstConfirmMessage()).toEqual('openlmisModal.ok');
                expect(options.resolve.secondConfirmMessage()).toEqual('openlmisModal.ok');
                expect(options.resolve.cancelMessage()).toEqual('openlmisModal.cancel');
                expect(options.resolve.titleMessage()).toEqual(undefined);
            });

            this.siglusConfirmModalService.confirm('someMessage');
        });

        it('should open modal with passed values', function() {
            this.openlmisModalService.createDialog.andCallFake(function(options) {
                expect(options.resolve.className()).toEqual('primary');
                expect(options.resolve.message()).toEqual('someMessage');
                expect(options.resolve.firstConfirmMessage()).toEqual('firstButtonMessage');
                expect(options.resolve.secondConfirmMessage()).toEqual('secondButtonMessage');
                expect(options.resolve.cancelMessage()).toEqual('cancelButtonMessage');
                expect(options.resolve.titleMessage()).toEqual('titleMessage');
            });

            this.siglusConfirmModalService.confirm('someMessage', 'firstButtonMessage', 'secondButtonMessage',
                'cancelButtonMessage', 'titleMessage');
        });
    });

    describe('confirmDestroy', function() {

        it('should open modal with default values', function() {
            this.openlmisModalService.createDialog.andCallFake(function(options) {
                expect(options.resolve.className()).toEqual('danger');
                expect(options.resolve.message()).toEqual('someMessage');
                expect(options.resolve.firstConfirmMessage()).toEqual('openlmisModal.ok');
                expect(options.resolve.secondConfirmMessage()).toEqual('openlmisModal.ok');
                expect(options.resolve.cancelMessage()).toEqual('openlmisModal.cancel');
                expect(options.resolve.titleMessage()).toEqual(undefined);
            });

            this.siglusConfirmModalService.confirmDestroy('someMessage');
        });

        it('should open modal with passed values', function() {
            this.openlmisModalService.createDialog.andCallFake(function(options) {
                expect(options.resolve.className()).toEqual('danger');
                expect(options.resolve.message()).toEqual('someMessage');
                expect(options.resolve.firstConfirmMessage()).toEqual('firstButtonMessage');
                expect(options.resolve.secondConfirmMessage()).toEqual('secondButtonMessage');
                expect(options.resolve.cancelMessage()).toEqual('cancelButtonMessage');
                expect(options.resolve.titleMessage()).toEqual('titleMessage');
            });

            this.siglusConfirmModalService.confirmDestroy('someMessage', 'firstButtonMessage', 'secondButtonMessage',
                'cancelButtonMessage', 'titleMessage');
        });
    });
});
