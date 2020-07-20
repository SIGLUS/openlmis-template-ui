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
        .module('siglus-requisition-grid-cell')
        .directive('requisitionGridCell', requisitionGridCell);

    requisitionGridCell.$inject = ['$templateRequest', '$compile', 'requisitionValidator'];

    function requisitionGridCell($templateRequest, $compile, requisitionValidator) {

        return {
            restrict: 'A',
            link: link,
            scope: {
                lineItemField: '=',
                testConsumptionLineItems: '=?'
            }
        };

        function link(scope, element) {
            scope.update = requisitionValidator.validateSiglusLineItemField;
            if (!_.isUndefined(scope.testConsumptionLineItems)) {
                scope.update = requisitionValidator.validateTestConsumptionLineItems;
            }

            updateCellContents();

            function updateCellContents() {
                replaceCell();
            }

            function replaceCell() {
                var templateHtml = 'siglus-requisition-grid-cell/siglus-requisition-grid-cell.html';
                $templateRequest(templateHtml).then(function(template) {
                    var cell = $compile(template)(scope);
                    element.replaceWith(cell);

                    element = cell;
                });
            }
        }
    }

})();
