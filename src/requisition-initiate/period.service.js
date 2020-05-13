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
     * @name requisition-initiate.periodService
     *
     * @description
     * Responsible for retrieving periods from server.
     */
    angular
        .module('requisition-initiate')
        .config(function($provide) {
            $provide.decorator('periodService', decorator);
        });

    decorator.$inject = ['$delegate', '$resource', '$q', 'alertService', 'requisitionUrlFactory', 'dateUtils'];

    function decorator($delegate, $resource, $q, alertService, requisitionUrlFactory, dateUtils) {
        // SIGLUS-REFACTOR: starts here
        var resource = $resource(requisitionUrlFactory('/api/siglusintegration/requisitions/periodsForInitiate'),
                {}, {
                    periodsForInitiate: {
                        method: 'GET',
                        isArray: true,
                        transformResponse: transformResponse
                    }
                }),
            periodService = $delegate;

        periodService.getPeriodsForInitiate = getPeriodsForInitiate;
        // SIGLUS-REFACTOR: ends here
        return periodService;

        /**
         * @ngdoc method
         * @methodOf requisition-initiate.periodService
         * @name getPeriodsForInitiate
         *
         * @description
         * Retrieves periods for initiate from server.
         *
         * @param  {String}  programId  program UUID
         * @param  {String}  facilityId facility UUID
         * @param  {Boolean} emergency  if searching for emergency periods
         * @return {Promise}            promise with periods array
         */
        function getPeriodsForInitiate(programId, facilityId, emergency) {
            return resource.periodsForInitiate({
                programId: programId,
                facilityId: facilityId,
                emergency: emergency
            }).$promise.catch(function(response) {
                if (response.status === 400) {
                    var data = angular.fromJson(response.data);
                    if (data.messageKey === 'requisition.error.facilityDoesNotSupportProgram') {
                        alertService.error(
                            'requisitionInitiate.programNotSupported.label',
                            'requisitionInitiate.programNotSupported.message'
                        );
                    }
                }
                $q.reject(response);
            });
        }

        function transformResponse(data, headers, status) {
            if (status === 200) {
                var periods = angular.fromJson(data);
                periods.forEach(function(period) {
                    period.startDate = dateUtils.toDate(period.startDate);
                    period.endDate = dateUtils.toDate(period.endDate);
                });
                return periods;
            }
            return data;
        }
    }
})();
