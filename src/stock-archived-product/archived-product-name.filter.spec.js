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

describe('archived product name filter', function() {
    var OrderableGroupDataBuilder;

    beforeEach(function() {
        module('stock-archived-product');
        module('stock-orderable-group');

        inject(function($injector) {
            this.$filter = $injector.get('$filter');
            OrderableGroupDataBuilder = $injector.get('OrderableGroupDataBuilder');
        });

        this.archivedProductNameFilter = this.$filter('archivedProductName');
        this.orderableGroup = new OrderableGroupDataBuilder().build();
    });

    it('should return undefined for undefined', function() {
        expect(this.archivedProductNameFilter()).toBeUndefined();
    });

    it('should return name with tag when the orderable group is archived', function() {
        this.orderableGroup[0].archived = true;

        expect(this.archivedProductNameFilter(this.orderableGroup)).toEqual('[archived]Product 1');
    });

    it('should return fullProductName when the orderable group is not archived', function() {
        this.orderableGroup[0].archived = false;

        expect(this.archivedProductNameFilter(this.orderableGroup)).toEqual('Product 1');
    });
});