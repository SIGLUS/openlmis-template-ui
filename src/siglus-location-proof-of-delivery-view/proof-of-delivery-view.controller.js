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
     * @name proof-of-delivery-view.controller:ProofOfDeliveryViewController
     *
     * @description
     * Controller that drives the POD view screen.
     */
    angular
        .module('proof-of-delivery-view')
        .controller('ProofOfDeliveryViewControllerWithLocation',
            ProofOfDeliveryViewControllerWithLocation);

    ProofOfDeliveryViewControllerWithLocation.$inject = ['$scope',
        'proofOfDelivery', 'order', 'reasons', 'messageService', 'VVM_STATUS',
        'orderLineItems', 'canEdit',
        'ProofOfDeliveryPrinter', '$q', 'loadingModalService',
        'proofOfDeliveryService', 'notificationService',
        '$stateParams', 'alertConfirmModalService', '$state',
        'PROOF_OF_DELIVERY_STATUS', 'confirmService',
        'confirmDiscardService', 'proofOfDeliveryManageService',
        'openlmisDateFilter', 'fulfillingLineItemFactory',
        'facilityFactory', 'siglusDownloadLoadingModalService', 'user', 'moment',
        'orderablesPrice', 'facility',
        'locations', 'areaLocationInfo', 'addAndRemoveLineItemService',
        'SiglusLocationCommonUtilsService',
        'alertService', 'printInfo', 'siglusSignatureWithLimitDateModalService'];

    function ProofOfDeliveryViewControllerWithLocation(
        $scope, proofOfDelivery, order, reasons, messageService
        , VVM_STATUS, orderLineItems, canEdit, ProofOfDeliveryPrinter
        , $q, loadingModalService, proofOfDeliveryService, notificationService
        , $stateParams, alertConfirmModalService, $state, PROOF_OF_DELIVERY_STATUS
        , confirmService, confirmDiscardService, proofOfDeliveryManageService
        , openlmisDateFilter, fulfillingLineItemFactory
        , facilityFactory, siglusDownloadLoadingModalService, user, moment
        , orderablesPrice, facility, locations, areaLocationInfo
        , addAndRemoveLineItemService, SiglusLocationCommonUtilsService, alertService, printInfo
        , siglusSignatureWithLimitDateModalService
    ) {

        if (canEdit) {
            orderLineItems.forEach(function(orderLineItem) {
                orderLineItem.groupedLineItems.forEach(function(fulfillingLineItem) {
                    addAndRemoveLineItemService.fillMovementOptions(fulfillingLineItem,
                        locations, areaLocationInfo);
                });
            });
        }
        var vm = this;

        vm.$onInit = onInit;
        vm.getStatusDisplayName = getStatusDisplayName;
        vm.getReasonName = getReasonName;
        vm.save = save;
        vm.submit = submit;
        vm.deleteDraft = deleteDraft;
        vm.returnBack = returnBack;
        vm.facilityId = facility.id;
        vm.isMerge = undefined;
        this.ProofOfDeliveryPrinter = ProofOfDeliveryPrinter;
        vm.maxDate = undefined;
        vm.minDate = undefined;
        vm.fileName = undefined;
        vm.getReason = function(reasonId) {
            // return
            var reasonMap = _.reduce(reasons, function(r, c) {
                r[c.id] = c.name;
                return r;
            }, {});
            return reasonMap[reasonId];
        };

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-view.controller:ProofOfDeliveryViewController
         * @name proofOfDelivery
         * @type {Object}
         *
         * @description
         * Holds Proof of Delivery.
         */
        vm.proofOfDelivery = undefined;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-view.controller:ProofOfDeliveryViewController
         * @name order
         * @type {Object}
         *
         * @description
         * Holds Order from Proof of Delivery.
         */
        vm.order = undefined;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-view.controller:ProofOfDeliveryViewController
         * @name orderLineItems
         * @type {Object}
         *
         * @description
         * Holds a map of Order Line Items with Proof of Delivery Line Items grouped by orderable.
         */
        vm.orderLineItems = undefined;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-view.controller:ProofOfDeliveryViewController
         * @name showVvmColumn
         * @type {boolean}
         *
         * @description
         * Indicates if VVM Status column should be shown for current Proof of Delivery.
         */
        vm.showVvmColumn = undefined;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-view.controller:ProofOfDeliveryViewController
         * @name canEdit
         * @type {boolean}
         *
         * @description
         * Indicates if PoD is in initiated status and if user has permission to edit it.
         */
        vm.canEdit = undefined;

        /**
         * @ngdoc property
         * @propertyOf proof-of-delivery-view.controller:ProofOfDeliveryViewController
         * @name reasons
         * @type {Array}
         *
         * @description
         * List of available stock reasons.
         */
        vm.reasons = undefined;

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery-view.controller:ProofOfDeliveryViewController
         * @name $onInit
         *
         * @description
         * Initialization method of the ProofOfDeliveryViewController.
         */
        function onInit() {

            vm.order = order;
            // SIGLUS-REFACTOR: starts here
            // vm.reasons = reasons;
            vm.reasons = _.filter(reasons, function(reason) {
                return _.contains(reason.tags, 'rejection');
            });
            // SIGLUS-REFACTOR: ends here
            vm.proofOfDelivery = proofOfDelivery;

            proofOfDeliveryManageService.getPodInfo(proofOfDelivery.id, order.id).then(function(res) {
                vm.nowTime = openlmisDateFilter(new Date(), 'd MMM y h:mm:ss a');
                vm.supplier = res.supplier;
                vm.preparedBy = res.preparedBy;
                vm.conferredBy = res.conferredBy;
                vm.client = res.client;
                vm.supplierDistrict = res.supplierDistrict;
                vm.supplierProvince = res.supplierProvince;
                vm.requisitionDate = openlmisDateFilter(res.requisitionDate, 'yyyy-MM-dd');
                vm.issueVoucherDate = openlmisDateFilter(res.issueVoucherDate, 'yyyy-MM-dd');
                vm.deliveredBy = res.deliveredBy;
                vm.receivedBy = res.receivedBy;
                vm.receivedDate = res.receivedDate;
                vm.podNum = '';
                var flag = order.orderCode.slice(-2) || '';
                if (flag.startsWith('-')) {
                    flag = flag.replace('-', '0');
                }
                if (flag.endsWith('E') || flag.endsWith('R')) {
                    flag = '01';
                }
                if (order.status === 'SHIPPED') {
                    vm.fileName = 'GR.' + res.requisitionNum + '_' + flag;
                    vm.requisitionNo = 'GR.' + res.requisitionNum + '/' + flag;
                }

                if (order.status === 'RECEIVED') {
                    vm.fileName = 'RR.' + res.requisitionNum + '_' + flag;
                    vm.requisitionNo = 'GR.' + res.requisitionNum + '/' + flag;
                    vm.podNum = 'RR.' + res.requisitionNum + '/' + flag;
                }
                vm.requisitionNum = res.requisitionNum;

                vm.requisitionId = res.requisitionId;

            });

            vm.orderLineItems = orderLineItems;
            vm.vvmStatuses = VVM_STATUS;
            vm.showVvmColumn = proofOfDelivery.hasProductsUseVvmStatus();
            vm.canEdit = canEdit;
            vm.orderCode = order.orderCode;
            vm.facility = facility;
            vm.facilityId = facility.id;
            vm.locations = locations;
            vm.areaLocationInfo = areaLocationInfo;
            vm.fileName = printInfo.fileName;
            vm.currentDate = moment().format('YYYY-MM-DD');
            facilityFactory.getUserHomeFacility()
                .then(function(res) {
                    vm.facility = res;
                });
            siglusSignatureWithLimitDateModalService.getMovementDate(
                vm.currentDate, vm.facility.id
            ).then(
                function(result) {
                    vm.minDate = result;
                }
            )
                .catch(function(error) {
                    if (error.data.messageKey
            === 'siglusapi.error.stockManagement.movement.date.invalid') {
                        alertService.error('openlmisModal.dateConflict');
                    }
                });
            vm.isMerge = $stateParams.actionType === 'MERGE'
          || $stateParams.actionType === 'VIEW';

            if ($stateParams.actionType === 'NOT_YET_STARTED') {
                save(true);
            }

            if ($stateParams.actionType === 'MERGE') {
                vm.proofOfDelivery.receivedBy = '';
                vm.maxDate = moment().format('YYYY-MM-DD');
            }

            $scope.$watch(function() {
                return vm.proofOfDelivery;
            }, function(newValue, oldValue) {
                $scope.needToConfirm =  !angular.equals(newValue, oldValue);
            }, true);
            confirmDiscardService.register($scope, 'openlmis.stockmanagement.stockCardSummaries');
            updateLabel();
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery-view.controller:ProofOfDeliveryViewController
         * @name getStatusDisplayName
         *
         * @description
         * Returns translated status display name.
         */
        function getStatusDisplayName(status) {
            return messageService.get(VVM_STATUS.$getDisplayName(status));
        }

        /**
         * @ngdoc method
         * @methodOf proof-of-delivery-view.controller:ProofOfDeliveryViewController
         * @name getReasonName
         *
         * @description
         * Returns a name of the reason with the given ID.
         *
         * @param  {string} id the ID of the reason
         * @return {string}    the name of the reason
         */
        function getReasonName(id) {
            if (!id) {
                return;
            }

            return vm.reasons.filter(function(reason) {
                return reason.id === id;
            })[0].name;
        }

        vm.getSumOfLot = function(lineItem, groupedLineItems) {
            return groupedLineItems.filter(function(lineItem) {
                return !lineItem.isMainGroup;
            }).filter(function(line) {
                return _.get(lineItem, ['orderable', 'id'], '') === _.get(line, ['orderable', 'id'], '') &&
                    _.get(lineItem, ['lot', 'id'], '') === _.get(line, ['lot', 'id'], '');
            })
                .map(function(line) {
                    return _.get(line, 'quantityAccepted', 0);
                })
                .reduce(function(accumulator, a) {
                    return accumulator + a;
                }, 0);
        };

        vm.getSumOfOrderableAcceptedQuantity = function(groupedLineItems) {
            return groupedLineItems.filter(function(lineItem) {
                return !lineItem.isMainGroup;
            })
                .map(function(line) {
                    return _.get(line, 'quantityAccepted', 0);
                })
                .reduce(function(accumulator, a) {
                    return accumulator + a;
                }, 0);
        };
        vm.getSumOfQuantityShipped = function(groupedLineItems) {
            return groupedLineItems.filter(function(lineItem) {
                return lineItem.isMainGroup || lineItem.isFirst;
            }).map(function(line) {
                return _.get(line, 'quantityShipped', 0);
            })
                .reduce(function(accumulator, a) {
                    return accumulator + a;
                }, 0);
        };

        vm.addItemForPod = function(lineItem, index, groupedLineItems) {
            $scope.needToConfirm = true;
            addAndRemoveLineItemService.addItemForPod(lineItem, index, groupedLineItems);
            groupedLineItems.forEach(function(line) {
                addAndRemoveLineItemService.fillMovementOptions(line, locations, areaLocationInfo);
            });
            console.log(groupedLineItems);
            // $state.go($state.current.name, $stateParams, {
            //     reload: true
            // });
        };

        vm.removeItemForPod = function(lineItem, index, groupedLineItems) {
            $scope.needToConfirm = true;
            addAndRemoveLineItemService.removeItemForPod(lineItem, index, groupedLineItems);
        };

        vm.changeArea = function(lineItem, groupedLineItems) {
            $scope.needToConfirm = true;
            lineItem.$error.areaError = _.isEmpty(_.get(lineItem.moveTo, 'area')) ? 'openlmisForm.required' : '';
            lineItem.destLocationOptions = SiglusLocationCommonUtilsService
                .getDesLocationList(lineItem, areaLocationInfo);
            // still need to verify all lines
            groupedLineItems.forEach(function(line) {
                vm.validateLocations(line, groupedLineItems);
            });
        };
        vm.changeMoveToLocation = function(lineItem, groupedLineItems) {
            $scope.needToConfirm = true;
            lineItem.$error.moveToLocationError = _.isEmpty(_.get(lineItem.moveTo, 'locationCode'))
                ? 'openlmisForm.required' : '';
            lineItem.destAreaOptions = SiglusLocationCommonUtilsService.getDesAreaList(lineItem, areaLocationInfo);
            // still need to verify all lines
            groupedLineItems.forEach(function(line) {
                vm.validateLocations(line, groupedLineItems);
            });
        };
        $scope.$on('locationCodeChange', function(event, data) {
            var lineItem = data.lineItem;
            var lineItems = data.lineItems;
            lineItem.destAreaOptions = SiglusLocationCommonUtilsService.getDesAreaList(lineItem, areaLocationInfo);
            if (_.get(lineItem.moveTo, 'locationCode')) {
                lineItem.moveTo.area = lineItem.destAreaOptions[0];
            } else {
                lineItem.moveTo.area = undefined;
            }
            vm.changeArea(lineItem, lineItems);
            vm.changeMoveToLocation(lineItem, lineItems);
        });

        vm.changeAcceptQuantity = function(lineItem, groupedLineItems) {
            $scope.needToConfirm = true;
            if (lineItem.isMainGroup || lineItem.isFirst) {
                lineItem.quantityRejected = vm.getRejectedQuantity(lineItem,
                    groupedLineItems);
            }
            vm.validateAcceptQuantity(lineItem, groupedLineItems);
        };

        vm.validateLocations = function(lineItem, groupedLineItems) {
            var relatedLineItems = groupedLineItems.filter(function(line) {
                return _.get(lineItem, ['orderable', 'id'], '') === _.get(line, ['orderable', 'id'], '') &&
                    _.get(lineItem, ['lot', 'id'], '') === _.get(line, ['lot', 'id'], '');
            }).filter(function(line) {
                return !line.isMainGroup;
            });
            var filterLineItems = relatedLineItems.filter(function(line) {
                return (_.get(line.moveTo, 'locationCode')
                    && _.get(lineItem, ['moveTo', 'locationCode']) === _.get(line.moveTo, 'locationCode'))
                && (_.get(line.moveTo, 'area')
                    && _.get(lineItem, ['moveTo', 'area']) === _.get(line.moveTo, 'area'));
            });

            if (filterLineItems.length > 1) {
                filterLineItems.forEach(function(lineItem) {
                    if (lineItem.lot) {
                        lineItem.$error.moveToLocationError = 'proofOfDeliveryView.duplicateLocation';
                        lineItem.$error.areaError = 'proofOfDeliveryView.duplicateLocation';
                    } else {
                        lineItem.$error.moveToLocationError = 'proofOfDeliveryView.duplicateLocationForKit';
                        lineItem.$error.areaError = 'proofOfDeliveryView.duplicateLocationForKit';
                    }
                });
            } else {
                filterLineItems.forEach(function(lineItem) {
                    if (lineItem.$error.moveToLocationError === 'proofOfDeliveryView.duplicateLocation'
                        || lineItem.$error.moveToLocationError === 'proofOfDeliveryView.duplicateLocationForKit') {
                        lineItem.$error.moveToLocationError = '';
                    }
                    if (lineItem.$error.areaError === 'proofOfDeliveryView.duplicateLocation'
                        || lineItem.$error.areaError === 'proofOfDeliveryView.duplicateLocationForKit') {
                        lineItem.$error.areaError = '';
                    }
                });
            }
        };

        function resetError(lineItem) {
            if (_.get(lineItem, 'rejectionReasonId')
                && lineItem.$error.rejectionReasonIdError === 'openlmisForm.required') {
                lineItem.$error.rejectionReasonIdError = '';
            }
            if (!_.get(lineItem, 'rejectionReasonId')
                && lineItem.$error.rejectionReasonIdError === 'proofOfDeliveryView.notAllowedRejectReasonId') {
                lineItem.$error.rejectionReasonIdError = '';
            }

            if (!_.isNumber(_.get(lineItem, 'quantityAccepted'))) {
                lineItem.$error.quantityAcceptedError = 'openlmisForm.required';
                return;
            }
            lineItem.$error.quantityAcceptedError = '';
        }
        vm.validateAcceptQuantity = function(lineItem, groupedLineItems) {
            resetError(lineItem);

            var sumOfLot = vm.getSumOfLot(lineItem, groupedLineItems);
            var relatedLines = groupedLineItems.filter(function(line) {
                return _.get(lineItem, ['lot', 'id'], '') === _.get(line, ['lot', 'id'], '');
            });
            var mainLine;
            if (relatedLines.length > 1) {
                mainLine = relatedLines.find(function(line) {
                    return line.isMainGroup;
                });
            } else {
                mainLine = lineItem;
            }

            var quantityShipped = mainLine.quantityShipped;
            if (sumOfLot > quantityShipped) {
                relatedLines.forEach(function(line) {
                    if (_.isNumber(_.get(line, 'quantityAccepted'))) {
                        line.$error.quantityAcceptedError = 'proofOfDeliveryView.gtQuantityShipped';
                    }
                });
                mainLine.$error.rejectionReasonIdError = '';
            } else {
                relatedLines.forEach(function(line) {
                    if (line.$error.quantityAcceptedError === 'proofOfDeliveryView.gtQuantityShipped') {
                        line.$error.quantityAcceptedError = '';
                    }
                });
                if (sumOfLot === quantityShipped) {
                    if (mainLine.rejectionReasonId) {
                        mainLine.rejectionReasonId = undefined;
                    }
                    relatedLines.forEach(function(line) {
                        line.$error.rejectionReasonIdError = '';
                    });
                } else if (sumOfLot < quantityShipped) {
                    if (mainLine.rejectionReasonId) {
                        relatedLines.forEach(function(line) {
                            line.$error.rejectionReasonIdError = '';
                        });
                    } else {
                        mainLine.$error.rejectionReasonIdError = 'openlmisForm.required';
                    }
                }
            }
        };

        vm.getRejectedQuantity = function(fulfillingLineItem, groupedLineItems) {
            var quantityAccepted = vm.getSumOfLot(fulfillingLineItem, groupedLineItems);
            return fulfillingLineItem.quantityShipped - quantityAccepted;
        };

        function getPodLineItemsToSend() {
            return _.flatten(vm.orderLineItems.map(function(orderLineItem) {
                return orderLineItem.groupedLineItems.filter(function(fulfillingLineItem) {
                    if (fulfillingLineItem.isMainGroup) {
                        fulfillingLineItem.quantityAccepted = vm.getSumOfLot(fulfillingLineItem,
                            orderLineItem.groupedLineItems);
                    }
                    if (fulfillingLineItem.isMainGroup || fulfillingLineItem.isFirst) {
                        fulfillingLineItem.quantityRejected = vm.getRejectedQuantity(fulfillingLineItem,
                            orderLineItem.groupedLineItems);
                    }
                    return fulfillingLineItem.isMainGroup || fulfillingLineItem.isFirst;
                });
            }));
        }
        function getPodLineItemLocationToSend() {
            return _.flatten(vm.orderLineItems.map(function(orderLineItem) {
                return orderLineItem.groupedLineItems.filter(function(fulfillingLineItem) {
                    return !fulfillingLineItem.isMainGroup;
                }).map(function(fulfillingLineItem) {
                    return {
                        podLineItemId: fulfillingLineItem.id,
                        locationCode: _.get(fulfillingLineItem, ['moveTo', 'locationCode'], undefined),
                        area: _.get(fulfillingLineItem, ['moveTo', 'area'], undefined),
                        quantityAccepted: fulfillingLineItem.quantityAccepted
                    };
                });
            }));
        }

        function save(notReload) {
            loadingModalService.open();
            // TODO lineitem here should be first & main
            vm.proofOfDelivery.lineItems = getPodLineItemsToSend();
            // TODO only pick no first, no main
            var podLineItemLocation = getPodLineItemLocationToSend();
            proofOfDeliveryService.updateSubDraftWithLocation($stateParams.podId,
                $stateParams.subDraftId, vm.proofOfDelivery, 'SAVE', podLineItemLocation).then(function() {
                $scope.needToConfirm = false;
                if (!notReload) {
                    notificationService.success('proofOfDeliveryView.proofOfDeliveryHasBeenSaved');
                }
                if (notReload) {
                    var stateParams = angular.copy($stateParams);
                    stateParams.actionType = 'DRAFT';
                    $state.go($state.current.name, stateParams, {
                        location: 'replace'
                    });
                }

            })
                .catch(function() {
                    notificationService.error('proofOfDeliveryView.failedToSaveProofOfDelivery');
                })
                .finally(loadingModalService.close);
        }

        vm.validateRequiredFields = function(lineItem) {
            if (!lineItem.isMainGroup) {
                if (_.isEmpty(_.get(lineItem.moveTo, 'locationCode'))) {
                    lineItem.$error.moveToLocationError = 'openlmisForm.required';
                }

                if (_.isEmpty(_.get(lineItem.moveTo, 'area'))) {
                    lineItem.$error.areaError = 'openlmisForm.required';
                }

                if (!_.isNumber(_.get(lineItem, 'quantityAccepted'))) {
                    lineItem.$error.quantityAcceptedError = 'openlmisForm.required';
                }
            }
        };

        function validateForm() {
            _.forEach(vm.orderLineItems, function(orderLineItem) {
                orderLineItem.groupedLineItems.forEach(function(lineItem) {
                    vm.validateRequiredFields(lineItem);
                    vm.validateAcceptQuantity(lineItem, orderLineItem.groupedLineItems);
                    vm.validateLocations(lineItem, orderLineItem.groupedLineItems);
                });
            });
            return _.every(vm.orderLineItems, function(orderLineItem) {
                return _.every(orderLineItem.groupedLineItems, function(lineItem) {
                    if (lineItem.isMainGroup) {
                        return true;
                    }
                    return _.chain(lineItem.$error)
                        .keys()
                        .all(function(key) {
                            return _.isEmpty(lineItem.$error[key]);
                        })
                        .value();
                });
            });
        }

        vm.validateMerge = function() {
            if (vm.proofOfDelivery.receivedBy) {
                vm.proofOfDelivery.receivedByError = '';
            } else {
                vm.proofOfDelivery.receivedByError = 'openlmisForm.required';
            }

            if (vm.proofOfDelivery.receivedDate) {
                vm.proofOfDelivery.receivedDateError = '';
            } else {
                vm.proofOfDelivery.receivedDateError = 'openlmisForm.required';
            }

            return Boolean(!vm.proofOfDelivery.receivedByError && !vm.proofOfDelivery.receivedDateError);
        };

        function submit() {
            $scope.$broadcast('openlmis-form-submit');
            if (validateForm()) {
                if (vm.isMerge) {
                    if (vm.validateMerge()) {
                        submitDraft();
                    } else {
                        alertService.error(messageService.get('openlmisForm.formInvalid'));
                    }
                } else {
                    submitSubDraft();
                }
            } else {
                alertService.error(messageService.get('openlmisForm.formInvalid'));
            }
        }

        // submit subDraft
        function submitSubDraft() {
            loadingModalService.open();
            vm.proofOfDelivery.lineItems = getPodLineItemsToSend();
            // TODO only pick no first, no main
            var podLineItemLocation = getPodLineItemLocationToSend();
            proofOfDeliveryService.updateSubDraftWithLocation($stateParams.podId,
                $stateParams.subDraftId, vm.proofOfDelivery, 'SUBMIT', podLineItemLocation).then(function() {
                $scope.needToConfirm = false;
                notificationService.success('proofOfDeliveryView.proofOfDeliveryHasBeenSubmitted');
                $state.go('^', $stateParams, {
                    reload: true
                });
            })
                .catch(function() {
                    notificationService.error('proofOfDeliveryView.failedToSaveProofOfDelivery');
                })
                .finally(loadingModalService.close);
        }

        function getSumQuantityAccepted(items) {
            var total = 0;
            _.each(items, function(item) {
                total = total + item.quantityAccepted;
            });
            return total;
        }
        function getDownloadLineItems() {
            var downloadLineItems = [];
            _.each(vm.orderLineItems, function(orderLineItem) {
                var validItems = orderLineItem.groupedLineItems.filter(function(item) {
                    return !item.isMainGroup;
                });
                var groupByLot = _.chain(validItems)
                    .groupBy(function(item) {
                        return _.get(item, ['lot', 'lotCode'], '');
                    })
                    .values()
                    .value();
                _.each(groupByLot, function(lotItems) {
                    var downloadLineItem = angular.copy(lotItems[0]);

                    var relatedMainLine = orderLineItem.groupedLineItems.filter(function(line) {
                        return _.get(downloadLineItem, ['lot', 'id'], '') === _.get(line, ['lot', 'id'], '');
                    }).find(function(line) {
                        return line.isMainGroup || line.isFirst;
                    });
                    downloadLineItem.rejectionReasonId = relatedMainLine.rejectionReasonId;
                    downloadLineItem.price = relatedMainLine.price;
                    downloadLineItem.notes = relatedMainLine.notes;
                    downloadLineItem.productCode = _.get(downloadLineItem, ['orderable', 'productCode'], '');
                    downloadLineItem.productName = _.get(downloadLineItem, ['orderable', 'fullProductName'], '');
                    downloadLineItem.lotCode = _.get(downloadLineItem, ['lot', 'lotCode'], '');
                    downloadLineItem.expirationDate = _.get(downloadLineItem, ['lot', 'expirationDate'], '');
                    downloadLineItem.orderedQuantity = orderLineItem.orderedQuantity;
                    downloadLineItem.partialFulfilledQuantity = orderLineItem.partialFulfilledQuantity;
                    downloadLineItem.quantityAccepted = getSumQuantityAccepted(lotItems);
                    downloadLineItems.push(downloadLineItem);
                });
            });
            return downloadLineItems;
        }

        // final merge and submit
        function submitDraft() {
            vm.downloadLineItems = getDownloadLineItems();
            vm.incosistencies = _.filter(vm.downloadLineItems, function(item) {
                return item.rejectionReasonId;
            });

            vm.totalPriceValue = _.reduce(vm.downloadLineItems, function(r, c) {
                var price = c.price ? c.price : 0;
                r = r + c.quantityShipped * price;
                return r;
            }, 0);
            vm.isLocation = true;
            vm.receivedBy = vm.proofOfDelivery.receivedBy;
            vm.receivedDate = vm.proofOfDelivery.receivedDate;
            downloadPrint();
            confirmService.confirm(
                'proofOfDeliveryView.confirm.message',
                'proofOfDeliveryView.confirm.label'
            )
                .then(function() {
                    loadingModalService.open();
                    var copy = angular.copy(vm.proofOfDelivery);
                    copy.lineItems = getPodLineItemsToSend();
                    var podLineItemLocation = getPodLineItemLocationToSend();
                    copy.status = PROOF_OF_DELIVERY_STATUS.CONFIRMED;
                    proofOfDeliveryService.submitDraftWithLocation($stateParams.podId,
                        copy, podLineItemLocation).then(function() {
                        $scope.needToConfirm = false;
                        notificationService.success(
                            'proofOfDeliveryView.proofOfDeliveryHasBeenConfirmed'
                        );
                        $state.go('openlmis.orders.podManage', {
                            requestingFacilityId: $stateParams.requestingFacilityId,
                            programId: $stateParams.programId
                        }, {
                            reload: true
                        });
                    })
                        .catch(function(error) {
                            if (
                                // eslint-disable-next-line max-len
                                _.get(error, ['data', 'messageKey']) === 'siglusapi.error.stockManagement.movement.date.invalid'
                            ) {
                                alertService.error('openlmisModal.dateConflict');
                            } else {
                                notificationService.error(
                                    'proofOfDeliveryView.failedToConfirmProofOfDelivery'
                                );
                            }
                        })
                        .finally(loadingModalService.close);
                });

        }

        function downloadPrint() {
            var printLineItems = angular.copy(vm.proofOfDelivery);
            printLineItems.lineItems = getPodLineItemsToSend();
            var podLineItemLocation = getPodLineItemLocationToSend();
            var newPrintLineItems = _.chain(podLineItemLocation)
                .map(function(item) {
                    var shipmentItem = _.find(printLineItems.lineItems, function(lineItem) {
                        return lineItem.id === item.podLineItemId;
                    });
                    item.productName = _.get(shipmentItem, ['orderable', 'fullProductName']);
                    item.productCode = _.get(shipmentItem, ['orderable', 'productCode']);
                    item.location = _.get(item, ['locationCode']);
                    item.lotCode = _.get(shipmentItem, ['lot', 'lotCode'], null);
                    item.expirationDate = _.get(shipmentItem, ['lot', 'expirationDate'], null);
                    item.pack = null;

                    if (shipmentItem.isKit) {
                        var mapKit = SiglusLocationCommonUtilsService.getOrderableLocationLotsMap(locations);
                        item.stockOnHand = _.get(mapKit[shipmentItem.orderable.id],
                            [item.locationCode, 0, 'stockOnHand'], 0);
                    } else {
                        var map = SiglusLocationCommonUtilsService.getOrderableLocationLotsMap(locations);
                        var locationLotList = _.get(map[shipmentItem.orderable.id], [item.locationCode]);
                        var locationLot = _.find(locationLotList, function(l) {
                            return l.id === _.get(shipmentItem, ['lot', 'id']);
                        });
                        item.stockOnHand = _.get(locationLot, 'stockOnHand', 0);
                    }
                    item.pallet =  Number(item.quantityAccepted) + Number(item.stockOnHand);
                    return item;
                })
                .filter(function(item) {
                    return item.pallet > 0 && item.pallet !== item.stockOnHand;
                })
                .value();
            vm.printLineItems = newPrintLineItems;
        }

        function deleteDraft() {
            alertConfirmModalService.error(
                'PhysicalInventoryDraftList.deleteDraftWarn',
                '',
                ['PhysicalInventoryDraftList.cancel', 'PhysicalInventoryDraftList.confirm']
            ).then(function() {
                loadingModalService.open();
                proofOfDeliveryService.deleteSubDraftWithLocation($stateParams.podId,
                    $stateParams.subDraftId).then(function() {
                    $scope.needToConfirm = false;
                    $state.go('^', $stateParams, {
                        reload: true
                    });
                })
                    .catch(function() {
                        loadingModalService.close();
                    })
                    .finally(loadingModalService.close);
            });
        }

        function returnBack() {
            $state.go('^', {}, {
                reload: true
            });
        }

        function updateLabel() {
            if ($stateParams.actionType === 'VIEW') {
                $state.current.label = messageService.get('proofOfDeliveryManage.view');
            } else if ($stateParams.actionType === 'MERGE') {
                $state.current.label = messageService.get('stockPhysicalInventoryDraft.mergeDraft');
            } else {
                $state.current.label =
                        messageService.get('stockPhysicalInventoryDraft.draft')
                        + ' '
                        + $stateParams.draftNum;
            }
        }

    }
}());
