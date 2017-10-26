/**
 * Js Test cases for Integration Dashboard
 * @author Saradha.M
 */
describe('Unit Tests - integration Dashboard Controller', function() {

    var _intDashboardController;

    before(function() {
        _integartionDashboardController = Ext.create('JDA.dm.IntegrationDashboard.controller.IntegrationDashboardController');
        store = Ext.create('JDA.dm.IntegrationDashboard.store.IntegrationDashboardStore', {
            storeId: 'IntegrationDashboardStore',
            data: Ext.create('JDA.dm.IntegrationDashboard.model.IntegrationDashboarGridModel', {

            })
        });
        _integartionDashboardController.store = store;
        view = Ext.create('JDA.dm.IntegrationDashboard.view.IntegrationDashboardView');
    });

    it('should not error when created', function() {
        expect(_integartionDashboardController).not.to.be(undefined);

    });

    after(function() {
        Ext.destroy(_integartionDashboardController);
        _integartionDashboardController = undefined;
    });

    describe('JS Unit Test for showView function', function() {
        it('should call getIntegrationDashBoardData function', function() {
            sinon.stub(_integartionDashboardController, 'getIntegrationDashBoardData');
            _integartionDashboardController.showView();
            expect(_integartionDashboardController.getIntegrationDashBoardData.called).to.be(true);
        });

    });
    describe('JS Unit Test for getIntegrationDashBoardData function', function() {

        before(function() {
            controller = Ext.create('JDA.dm.IntegrationDashboard.controller.IntegrationDashboardController');
            controller.groupBy = null;
            controller.query = null;
            CSUnit.fakeServer.autoRespond = true;
            sinon.stub(controller, "updateIntegrationDashBoardData");
            sinon.stub(controller, "updateIntegrationDashBoardPanelData");
        });

        after(function() {
            Ext.destroy(controller);
            controller = undefined;
        });
        it('should call updateIntegrationDashBoardData function', function() {
            CSUnit.fakeServer.respondWith(/\/messagestore/, function(xhr) {
                xhr.respond(
                    // 200 'OK' status
                    200,
                    // Type of response is JSON
                    {
                        'content-type': 'application/json'
                    }, Ext.encode({
                        "message": "OK",
                        "count": 0,
                        "status": 0,
                        "data": [{
                            "type": "report",
                            "id": null,
                            "attributes": {
                                "messageGroups": [{
                                        "groupBy": "CurrentStatus",
                                        "groupName": "Error",
                                        "count": 40,
                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D%5D",
                                        "messageGroups": [{
                                                "groupBy": "OperationName",
                                                "groupName": "TransferOrder",
                                                "count": 23,
                                                "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D%5D",
                                                "messageGroups": [{
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.14",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.14%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.14%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.15",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.15%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.15%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.16",
                                                        "count": 2,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.16%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 2,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.16%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.17",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.17%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.17%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.18",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.18%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.18%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.19",
                                                        "count": 2,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.19%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 2,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.19%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.20",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.20%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.20%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.21",
                                                        "count": 2,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.21%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 2,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.21%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.01",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.01%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.01%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.02",
                                                        "count": 3,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.02%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 3,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.02%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.03",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.03%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.03%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.05",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.05%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.05%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.07",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.07%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.07%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.09",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.09%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.09%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.10",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.10%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.10%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.11",
                                                        "count": 2,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.11%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 2,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.11%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.13",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.13%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.13%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    }
                                                ]
                                            },
                                            {
                                                "groupBy": "OperationName",
                                                "groupName": "laborCapacityMessage",
                                                "count": 17,
                                                "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D%5D",
                                                "messageGroups": [{
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.15",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.15%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.15%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.16",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.16%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.16%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.18",
                                                        "count": 2,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.18%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 2,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.18%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.19",
                                                        "count": 2,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.19%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 2,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.19%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.22",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.22%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.22%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.23",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.23%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.23%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.00",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.00%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.00%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.01",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.01%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.01%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.1",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.1%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.1%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.11",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.11%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.11%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.12",
                                                        "count": 5,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.12%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 5,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AError%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.12%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "groupBy": "CurrentStatus",
                                        "groupName": "Processed",
                                        "count": 46,
                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D%5D",
                                        "messageGroups": [{
                                                "groupBy": "OperationName",
                                                "groupName": "TransferOrder",
                                                "count": 27,
                                                "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D%5D",
                                                "messageGroups": [{
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.14",
                                                        "count": 2,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.14%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 2,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.14%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.15",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.15%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.15%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.16",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.16%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.16%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.17",
                                                        "count": 2,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.17%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 2,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.17%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.18",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.18%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.18%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.19",
                                                        "count": 2,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.19%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 2,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.19%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.20",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.20%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.20%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.21",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.21%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.21%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.01",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.01%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.01%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.02",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.02%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.02%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.03",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.03%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.03%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.04",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.04%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.04%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.05",
                                                        "count": 2,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.05%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 2,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.05%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.06",
                                                        "count": 2,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.06%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 2,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.06%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.07",
                                                        "count": 2,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.07%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 2,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.07%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.08",
                                                        "count": 2,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.08%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 2,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.08%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.09",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.09%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.09%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.11",
                                                        "count": 2,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.11%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 2,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.11%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.13",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.13%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3ATransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.13%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    }
                                                ]
                                            },
                                            {
                                                "groupBy": "OperationName",
                                                "groupName": "laborCapacityMessage",
                                                "count": 19,
                                                "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D%5D",
                                                "messageGroups": [{
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.14",
                                                        "count": 2,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.14%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 2,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.14%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.15",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.15%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.15%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.21",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.21%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.21%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.7.23",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.23%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.7.23%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.00",
                                                        "count": 2,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.00%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 2,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.00%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.02",
                                                        "count": 1,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.02%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 1,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.02%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.11",
                                                        "count": 2,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.11%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 2,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.11%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    },
                                                    {
                                                        "groupBy": "DisplayByHr",
                                                        "groupName": "6.8.12",
                                                        "count": 9,
                                                        "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.12%7D%5D",
                                                        "messageGroups": [{
                                                            "groupBy": "ComponentName",
                                                            "groupName": "Gs1RefAdapter",
                                                            "count": 9,
                                                            "messageURL": "~/cxf/frameworkservices/v1/messagestore/messages?query=%5B%7B%22AND%22%3A%5B%7B%22column%22%3A%22ComponentName%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Gs1RefAdapter%22%7D,%7B%22OR%22%3A%5B%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Processed%22%7D,%7B%22column%22%3A%22CurrentStatus%22,%22operator%22%3A%22EQ%22,%22value%22%3A%22Error%22%7D%5D%7D%5D%7D,%7Bcolumn%3ACurrentStatus,operator%3AEQ,value%3AProcessed%7D,%7Bcolumn%3AOperationName,operator%3AEQ,value%3AlaborCapacityMessage%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,value%3A6.8.12%7D,%7Bcolumn%3AComponentName,operator%3AEQ,value%3AGs1RefAdapter%7D%5D"
                                                        }]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        }],
                        "type": "J"
                    }));
            });

            controller.getIntegrationDashBoardData();
            CSUnit.fakeServer.respond();
            expect(controller.updateIntegrationDashBoardData.called).to.be(false);
            expect(controller.updateIntegrationDashBoardPanelData.called).to.be(false);
        });

    });

    describe('JS Unit Test for _submitButtonClicked function', function() {
        it('should call getIntegrationDashBoardData function', function() {
            _integartionDashboardController._submitButtonClicked();
            expect(_integartionDashboardController.getIntegrationDashBoardData.called).to.be(true);
        });
    });

    describe('JS Unit Test for dashBoardProcessedSelected function', function() {
        it('should call load function of quickappManager', function() {
            sinon.stub(_integartionDashboardController, 'resetIntegrationDashBoard');
            var eOpts = {
                target: {

                    href: "http://localhost:8080/portal/~/cxf/frameworkservices/v1/messagestore/messag…ransferOrder%7D,%7Bcolumn%3ADisplayByHr,operator%3AEQ,queryvalue%3A6.7.16%7D%5D"
                },
                stopEvent: function() {
                    return ({
                        id: "abcd"
                    });
                }
            };
            sinon.stub(RP.mvc.QuickAppManager, 'load');
            var item = {
                data: {
                    id: "abcd"
                }
            };
            _integartionDashboardController.dashBoardProcessedSelected(null, item, null, null, eOpts);
            expect(RP.mvc.QuickAppManager.load.called).to.be(true);
        });

    });

});