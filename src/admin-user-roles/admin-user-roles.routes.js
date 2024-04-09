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

    angular.module('admin-user-roles').config(routes);

    routes.$inject = ['$stateProvider', 'ADMINISTRATION_RIGHTS', 'ROLE_TYPES'];

    function routes($stateProvider, ADMINISTRATION_RIGHTS, ROLE_TYPES) {

        $stateProvider.state('openlmis.administration.users.roles', {
            abstract: true,
            label: 'adminUserRoles.editUserRoles',
            url: '/:id/roles',
            accessRights: [ADMINISTRATION_RIGHTS.USERS_MANAGE],
            resolve: {
                roles: function(referencedataRoleFactory) {
                    return referencedataRoleFactory.getAllWithType();
                },
                programs: function(programService) {
                    return programService.getAll();
                },
                facilitiesMap: function(facilityService, ObjectMapper) {
                    return facilityService.getAllMinimal()
                        .then(function(facilities) {
                            return new ObjectMapper().map(facilities);
                        });
                },
                supervisoryNodes: function(AdminUserRolesSupervisoryNodeResource, facilitiesMap) {
                    return new AdminUserRolesSupervisoryNodeResource(facilitiesMap).query()
                        .then(function(page) {
                            return page.content;
                        });
                },
                warehouses: function(facilityService) {
                    return facilityService.getAllMinimal();
                },
                user: function(userRoleAssignmentFactory, $stateParams, roles, programs, supervisoryNodes, warehouses) {
                    return userRoleAssignmentFactory.getUser($stateParams.id, roles, programs, supervisoryNodes,
                        warehouses);
                },
                roleRightsMap: function(roles, ObjectMapper) {
                    return new ObjectMapper().map(roles, 'rights');
                },
                availableGeographicList: function(UserRolesReportService) {
                    return UserRolesReportService.getAvailableGeographicList().then(function(result) {
                        return result;
                    });
                },
                userGeographicList: function(user, UserRolesReportService) {
                    return UserRolesReportService.getUserGeographicList(user.id).then(function(result) {
                        return result;
                    });
                }
            },
            views: {
                '@openlmis': {
                    templateUrl: 'admin-user-roles/user-roles.html',
                    controller: 'UserRolesController',
                    controllerAs: 'vm'
                }
            }
        });

        $stateProvider.state('openlmis.administration.users.roles.' + ROLE_TYPES.REPORTS, {
            label: ROLE_TYPES.getLabel(ROLE_TYPES.REPORTS),
            url: '/reports?page&size',
            controller: 'UserRolesReportController',
            controllerAs: 'vm',
            templateUrl: 'admin-user-roles/user-roles-report.html',
            resolve: {
                tab: function() {
                    return ROLE_TYPES.REPORTS;
                },
                roleAssignments: function(paginationService, $stateParams, user, tab) {
                    return paginationService.registerList(null, $stateParams, function() {
                        return user.getRoleAssignments(tab);
                    });
                },
                filteredRoles: function(roles, tab) {
                    return roles.filter(function(role) {
                        return role.type === tab;
                    });
                }
            }
        });

        addStateForRoleType(ROLE_TYPES.SUPERVISION, '/supervision?page&size', 'user-roles-supervision.html');
        addStateForRoleType(ROLE_TYPES.ORDER_FULFILLMENT, '/fulfillment?page&size', 'user-roles-fulfillment.html');
        addStateForRoleType(ROLE_TYPES.GENERAL_ADMIN, '/admin?page&size', 'user-roles-tab.html');

        function addStateForRoleType(type, url, templateFile) {
            $stateProvider.state('openlmis.administration.users.roles.' + type, {
                label: ROLE_TYPES.getLabel(type),
                url: url,
                controller: 'UserRolesTabController',
                templateUrl: 'admin-user-roles/' + templateFile,
                controllerAs: 'vm',
                resolve: {
                    tab: function() {
                        return type;
                    },
                    roleAssignments: function(paginationService, $stateParams, user, tab) {
                        return paginationService.registerList(null, $stateParams, function() {
                            return user.getRoleAssignments(tab);
                        });
                    },
                    filteredRoles: function(roles, tab) {
                        return roles.filter(function(role) {
                            return role.type === tab;
                        });
                    }
                }
            });
        }
    }
})();
