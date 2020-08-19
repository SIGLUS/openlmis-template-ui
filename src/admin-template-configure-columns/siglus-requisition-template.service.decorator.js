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
     * @name admin-template-configure-columns.requisitionTemplateService
     *
     * @description
     * Decorates requisitionTemplateService with new api.
     */
    angular.module('admin-template-configure-columns')
        .config(config);

    config.$inject = ['$provide'];

    function config($provide) {
        $provide.decorator('requisitionTemplateService', decorator);
    }

    decorator.$inject = ['$delegate', 'requisitionUrlFactory', '$resource', 'Template'];

    function decorator($delegate, requisitionUrlFactory, $resource, Template) {
        var resource = $resource(requisitionUrlFactory('/api/siglusapi/requisitionTemplates/:id'), {}, {
            update: {
                method: 'PUT'
            },
            get: {
                method: 'GET'
            }
        });

        $delegate.get = get;
        $delegate.save = save;

        return $delegate;

        /**
         * @ngdoc method
         * @methodOf admin-template-configure-columns.requisitionTemplateService
         * @name get
         *
         * @description
         * Gets requisition template by id.
         *
         * @param  {String}  id Requisition template UUID
         * @return {Promise}    Requisition template info
         */
        function get(id) {
            return resource.get({
                id: id
            }).$promise
                .then(function(response) {
                    return new Template(response);
                });
        }

        /**
         * @ngdoc method
         * @methodOf admin-template-configure-columns.requisitionTemplateService
         * @name  save
         *
         * @description
         * Saves changes to requisition template.
         *
         * @return {Promise} Saved requisition template
         */
        function save(template) {
            return resource.update({
                id: template.id
            }, template).$promise;
        }
    }
})();
