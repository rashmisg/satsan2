describe('Unit Tests - Message Store Summary Controller', function() {
    var controller, store, view;
    before(function() {
        controller = Ext.create('JDA.dm.MessageStore.controller.MessageStoreSummaryController');
        controller.pageOffset = 0;
        controller.pageLimit = 10;
        controller.count = 73;
        store = Ext.create('JDA.dm.MessageStore.store.MessageStoreSummaryStore', {
            storeId: 'MessageStoreSummaryStore',
            data: Ext.create('JDA.dm.MessageStore.model.MessageStoreSummaryModel', {
                DocumentId: 'bad5',
                CamelExchangeId: 'ID-IN2NPDVINTMT02-55233-1490194394181-0-12',
                FormatType: "GS1",
                FormatVer: "[GS1:3.2.0,GS1_JDA:2016.1.0,TransferOrder:1.0.0]",
                CreatedTimestamp: " 2017-03-31",
                ErrorMessage: 'Errors encountered again',
                CurrentStatus: 'Recieved',
                Status: 'View',
                ComponentName: "ABCd",
                ComponentId: "4789f93f-0f0f-11e7-a2f3-005056bf5497-00049624",
                ComponentVer: "hsuhiusdss",
                OperationName: "8ois",
                Hostname: "suhushs",
                Direction: "RECEIVED",
                Side: "FRONT",
                SenderId: "",
                ReceiverId: "",
                id: "bad5"
            })
        });
        controller.store = store;
        view = Ext.create('JDA.dm.MessageStore.view.MessageStoreSummary');

    });
    it('controller Should not error when created', function() {
        expect(controller).not.to.be(undefined);
    });


    it('Check for date format', function() {
        var date = "2017-03-22T20:27:44.085+05:30";
        var formatedDate = controller.formatDate(date);
        expect(formatedDate.toString()).to.be.equal("2017-03-22 20:27");
    });

    describe('JS Unit Test for messageStoreSort function', function() {

        it('should call loadMessageStore function', function() {
            sinon.stub(controller, 'loadMessageStore');
            sinon.stub(controller, 'setMessageStoreExtraParam');
            var column = {
                dataIndex: 3
            };
            controller.messageStoreSort(null, column, null, null);

            expect(controller.loadMessageStore.called).to.be(true);
        });

        it('should call setMessageStoreExtraParam function', function() {
            var column = {
                dataIndex: 3
            };
            controller.messageStoreSort(null, column, null, null);

            expect(controller.setMessageStoreExtraParam.called).to.be(true);
        });
        it('Should disble the Buttons and unselect the selected message', function() {
            var column = {
                dataIndex: 3
            };

            controller.setMessageStoreExtraParam.restore();
            controller.loadMessageStore.restore();
            sinon.stub(controller, 'loadMessageStore');
            sinon.stub(controller, 'setMessageStoreExtraParam');
            sinon.stub(controller, 'disableButtons');
            controller.isMessageSelected = true;

            controller.messageStoreSort(null, column, "DESC", null);

            expect(controller.setMessageStoreExtraParam.called).to.be(true);
            expect(controller.loadMessageStore.called).to.be(true);
            expect(controller.isMessageSelected).to.be(false);
            expect(controller.disableButtons.called).to.be(true);

        });


    });

    describe('JS UNit Tests for Pagination functions', function() {
        beforeEach(function() {
            controller = Ext.create('JDA.dm.MessageStore.controller.MessageStoreSummaryController');
            controller.pageOffset = 0;
            controller.pageLimit = 10;
            controller.count = 73;
            store = Ext.create('JDA.dm.MessageStore.store.MessageStoreSummaryStore', {
                storeId: 'MessageStoreSummaryStore',
                data: Ext.create('JDA.dm.MessageStore.model.MessageStoreSummaryModel', {
                    DocumentId: 'bad5',
                    CamelExchangeId: 'ID-IN2NPDVINTMT02-55233-1490194394181-0-12',
                    FormatType: "GS1",
                    FormatVer: "[GS1:3.2.0,GS1_JDA:2016.1.0,TransferOrder:1.0.0]",
                    CreatedTimestamp: " 2017-03-31",
                    ErrorMessage: 'Errors encountered again',
                    CurrentStatus: 'Recieved',
                    Status: 'View',
                    ComponentName: "ABCd",
                    ComponentId: "4789f93f-0f0f-11e7-a2f3-005056bf5497-00049624",
                    ComponentVer: "hsuhiusdss",
                    OperationName: "8ois",
                    Hostname: "suhushs",
                    Direction: "RECEIVED",
                    Side: "FRONT",
                    SenderId: "",
                    ReceiverId: "",
                    id: "bad5"
                })
            });
            controller.setMessageStore(store);
            sinon.stub(controller, 'setMessageStoreExtraParam');
            sinon.stub(controller, 'loadMessageStore');
            sinon.stub(controller, 'disableButtons');
        });

        afterEach(function() {
            Ext.destroy(controller);
            controller = undefined;
        });

        it('Test cases for moveNext function', function() {
            var pageOffset = controller.pageOffset;
            var pageLimit = controller.pageLimit;
            controller.moveNext();
            expect(controller.loadMessageStore.called).to.be(true);
            expect(controller.setMessageStoreExtraParam.called).to.be(true);
            expect(controller.disableButtons.called).to.be(true);
            expect(controller.pageOffset).to.be(pageOffset + pageLimit);
        });

        it('Test cases for movePrev function', function() {
            var pageOffset = controller.pageOffset;
            var pageLimit = controller.pageLimit;
            controller.movePrev();
            expect(controller.loadMessageStore.called).to.be(true);
            expect(controller.setMessageStoreExtraParam.called).to.be(true);
            expect(controller.disableButtons.called).to.be(true);
            expect(controller.pageOffset).to.be(pageOffset - pageLimit);
        });

        it('Test cases for moveLast function', function() {
            var pageOffset = controller.pageOffset;
            var pageLimit = controller.pageLimit;
            var count = controller.count;
            controller.moveLast();
            expect(controller.loadMessageStore.called).to.be(true);
            expect(controller.setMessageStoreExtraParam.called).to.be(true);
            expect(controller.disableButtons.called).to.be(true);
            var expectedOffset = (count % pageLimit === 0) ? (pageLimit * ((count / pageLimit) - 1)) : (pageLimit * Math.floor(count / pageLimit));
            expect(controller.pageOffset).to.be(expectedOffset);
        });

        it('Test cases for moveFirst Function', function() {
            var pageOffset = controller.pageOffset;
            var pageLimit = controller.pageLimit;
            controller.moveFirst();
            expect(controller.loadMessageStore.called).to.be(true);
            expect(controller.setMessageStoreExtraParam.called).to.be(true);
            expect(controller.disableButtons.called).to.be(true);
            expect(controller.pageOffset).to.be(0);
            expect(controller.pageLimit).to.be(pageLimit);
        });

        it('Test cases for moveToPage function', function() {
            var pageOffset = controller.pageOffset;
            var pageLimit = controller.pageLimit;
            controller.moveToPage(null, null);
            expect(controller.pageLimit).to.be(undefined);
            expect(controller.pageOffset).to.be(pageOffset);
        });

        it('Test cases for moveToPageSize function', function() {
            var changeEvent = {
                currentPage: 1,
                fromRecord: 1,
                pageCount: 19,
                toRecord: 10,
                total: 92
            };
            var pagingToolBar = {
                store: {
                    pageSize: 15
                }
            };
            var pageOffset = controller.pageOffset;
            var pageLimit = controller.pageLimit;
            controller.isMessageSelected = true;
            controller.moveToPageSize(pagingToolBar, changeEvent);
            expect(controller.loadMessageStore.called).to.be(true);
            expect(controller.setMessageStoreExtraParam.called).to.be(true);
            expect(controller.disableButtons.called).to.be(true);
            expect(controller.isMessageSelected).to.be(false);

            expect(controller.pageLimit).to.be(pagingToolBar.store.pageSize);
            expect(controller.pageOffset).to.be(changeEvent.fromRecord - 1);

        });

        it('Test cases for moveToPageSize with changeEvent undefined', function() {
            var changeEvent = undefined;
            var pagingToolBar = {
                store: {
                    pageSize: 10
                }
            };
            var pageOffset = controller.pageOffset;
            var pageLimit = controller.pageLimit;
            controller.isMessageSelected = true;
            controller.moveToPageSize(pagingToolBar, changeEvent);
            expect(controller.loadMessageStore.called).to.be(false);
            expect(controller.setMessageStoreExtraParam.called).to.be(false);
            expect(controller.disableButtons.called).to.be(false);
            expect(controller.isMessageSelected).to.be(true);
            expect(controller.pageLimit).to.be(pageLimit);
            expect(controller.pageOffset).to.be(pageOffset);

        });

    });

    describe('JS unit Cases for MessageStore Buttons', function() {
        before(function() {
            controller = Ext.create('JDA.dm.MessageStore.controller.MessageStoreSummaryController');

            controller.pageOffset = 0;
            controller.pageLimit = 10;
            controller.count = 73;
            store = Ext.create('JDA.dm.MessageStore.store.MessageStoreSummaryStore', {
                storeId: 'MessageStoreSummaryStore',
                data: Ext.create('JDA.dm.MessageStore.model.MessageStoreSummaryModel', {
                    DocumentId: 'bad5',
                    CamelExchangeId: 'ID-IN2NPDVINTMT02-55233-1490194394181-0-12',
                    FormatType: "GS1",
                    FormatVer: "[GS1:3.2.0,GS1_JDA:2016.1.0,TransferOrder:1.0.0]",
                    CreatedTimestamp: " 2017-03-31",
                    ErrorMessage: 'Errors encountered again',
                    CurrentStatus: 'Recieved',
                    Status: 'View',
                    ComponentName: "ABCd",
                    ComponentId: "4789f93f-0f0f-11e7-a2f3-005056bf5497-00049624",
                    ComponentVer: "hsuhiusdss",
                    OperationName: "8ois",
                    Hostname: "suhushs",
                    Direction: "RECEIVED",
                    Side: "FRONT",
                    SenderId: "",
                    ReceiverId: "",
                    id: "bad5"
                })
            });
        });
        it("Check for Disable function", function() {
            Ext.getCmp('downloadButton').enable();
            Ext.getCmp('viewButton').enable();
            Ext.getCmp('processButton').enable();
            controller.disableButtons();
            expect(Ext.getCmp('viewButton').disabled).to.be(true);
            expect(Ext.getCmp('downloadButton').disabled).to.be(true);
            expect(Ext.getCmp('processButton').disabled).to.be(true);
        });
        it("Check for Enable function", function() {
            Ext.getCmp('downloadButton').disable();
            Ext.getCmp('viewButton').disable();
            Ext.getCmp('processButton').disable();
            controller.enableButtons();
            expect(Ext.getCmp('viewButton').disabled).to.be(false);
            expect(Ext.getCmp('downloadButton').disabled).to.be(false);
            expect(Ext.getCmp('processButton').disabled).to.be(false);
        });
        after(function() {

            Ext.destroy(controller);
            controller = undefined;
            Ext.destroy(store);
            store = undefined;
            downloadButton = undefined;
            viewButton = undefined;
        });
    });

    describe('JS Unit tets for _getDownloadFrame function', function() {
        beforeEach(function() {
            controller = Ext.create('JDA.dm.MessageStore.controller.MessageStoreSummaryController');
            controller.pageOffset = 0;
            controller.pageLimit = 10;
            controller.count = 73;
            store = Ext.create('JDA.dm.MessageStore.store.MessageStoreSummaryStore', {
                storeId: 'MessageStoreSummaryStore',
                data: Ext.create('JDA.dm.MessageStore.model.MessageStoreSummaryModel', {
                    DocumentId: 'bad5',
                    CamelExchangeId: 'ID-IN2NPDVINTMT02-55233-1490194394181-0-12',
                    FormatType: "GS1",
                    FormatVer: "[GS1:3.2.0,GS1_JDA:2016.1.0,TransferOrder:1.0.0]",
                    CreatedTimestamp: " 2017-03-31",
                    ErrorMessage: 'Errors encountered again',
                    CurrentStatus: 'Recieved',
                    Status: 'View',
                    ComponentName: "ABCd",
                    ComponentId: "4789f93f-0f0f-11e7-a2f3-005056bf5497-00049624",
                    ComponentVer: "hsuhiusdss",
                    OperationName: "8ois",
                    Hostname: "suhushs",
                    Direction: "RECEIVED",
                    Side: "FRONT",
                    SenderId: "",
                    ReceiverId: "",
                    id: "bad5"
                })
            });
            sinon.stub(controller, '_createDownloadFrame');
            sinon.stub(controller, 'showView');
        });

        afterEach(function() {
            Ext.destroy(controller);
            controller = undefined;
            Ext.destroy(store);
            store = undefined;
        });

        it('Check if _createDownloadFrame is being called ', function() {
            controller._getDownloadFrame();
            expect(controller._createDownloadFrame.called).to.be(true);
        });
        it("Check of onLaunch function", function() {
            controller.onLaunch(null);
            expect(controller.showView.called).to.be(true);
            expect(controller.filterString).to.be(null);
        });
    });

    describe('Test cases for _createDownloadFrame function', function() {
        before(function() {
            controller = Ext.create('JDA.dm.MessageStore.controller.MessageStoreSummaryController');
            controller.pageOffset = 0;
            controller.pageLimit = 10;
            controller.count = 73;
            store = Ext.create('JDA.dm.MessageStore.store.MessageStoreSummaryStore', {
                storeId: 'MessageStoreSummaryStore',
                data: Ext.create('JDA.dm.MessageStore.model.MessageStoreSummaryModel', {
                    DocumentId: 'bad5',
                    CamelExchangeId: 'ID-IN2NPDVINTMT02-55233-1490194394181-0-12',
                    FormatType: "GS1",
                    FormatVer: "[GS1:3.2.0,GS1_JDA:2016.1.0,TransferOrder:1.0.0]",
                    CreatedTimestamp: " 2017-03-31",
                    ErrorMessage: 'Errors encountered again',
                    CurrentStatus: 'Recieved',
                    Status: 'View',
                    ComponentName: "ABCd",
                    ComponentId: "4789f93f-0f0f-11e7-a2f3-005056bf5497-00049624",
                    ComponentVer: "hsuhiusdss",
                    OperationName: "8ois",
                    Hostname: "suhushs",
                    Direction: "RECEIVED",
                    Side: "FRONT",
                    SenderId: "",
                    ReceiverId: "",
                    id: "bad5"
                })
            });
            controller.setMessageStore(store);
            sinon.stub(RP.component, 'IFrame');
        });

        after(function() {
            Ext.destroy(controller);
            controller = undefined;
            Ext.destroy(store);
            store = undefined;
            RP.component.IFrame.restore();
        });

        it('check if Iframe is called ', function() {
            controller._createDownloadFrame();
            expect(RP.component.IFrame.called).to.be(true);
        });
    });


    describe('JS unit cases for messageSelected function', function() {
        beforeEach(function() {
            controller = Ext.create('JDA.dm.MessageStore.controller.MessageStoreSummaryController');
            controller.pageOffset = 0;
            controller.pageLimit = 10;
            controller.count = 73;
            // view = Ext.create('JDA.dm.MessageStore.view.MessageStoreSummary');
            store = Ext.create('JDA.dm.MessageStore.store.MessageStoreSummaryStore', {
                storeId: 'MessageStoreSummaryStore',
                data: Ext.create('JDA.dm.MessageStore.model.MessageStoreSummaryModel', {
                    DocumentId: 'bad5',
                    CamelExchangeId: 'ID-IN2NPDVINTMT02-55233-1490194394181-0-12',
                    FormatType: "GS1",
                    FormatVer: "[GS1:3.2.0,GS1_JDA:2016.1.0,TransferOrder:1.0.0]",
                    CreatedTimestamp: " 2017-03-31",
                    ErrorMessage: 'Errors encountered again',
                    CurrentStatus: 'Recieved',
                    Status: 'View',
                    ComponentName: "ABCd",
                    ComponentId: "4789f93f-0f0f-11e7-a2f3-005056bf5497-00049624",
                    ComponentVer: "hsuhiusdss",
                    OperationName: "8ois",
                    Hostname: "suhushs",
                    Direction: "RECEIVED",
                    Side: "FRONT",
                    SenderId: "",
                    ReceiverId: "",
                    id: "bad5"
                })
            });
            controller.setMessageStore(store);
        });

        afterEach(function() {
            Ext.destroy(controller);
            controller = undefined;
            Ext.destroy(store);
            store = undefined;
        });

        it('check when message is already selected  ', function() {
            var item = {
                data: {
                    id: "abcd"
                }
            };
            var eOpts = {
                getTarget: function() {
                    return ({
                        id: "abcd"
                    });
                },
                ctrlKey: true
            };
            controller.isMessageSelected = true;
            // controller.selectedMessageId = "abcd";
            controller.getSelectedMessageIds().push("abcd");
            controller.enableButtons();
            sinon.stub(controller, 'disableButtons');
            sinon.stub(controller, 'viewStatusEvents');
            controller.messageSelected(null, item, null, null, eOpts);
            expect(controller.isMessageSelected).to.be(true);
            expect(controller.disableButtons.called).to.be(true);
            expect(controller.viewStatusEvents.called).to.be(false);
        });
        it('check when unselected message is selected', function() {
            var item = {
                data: {
                    id: "abcd"
                }
            };
            var eOpts = {
                getTarget: function() {
                    return ({
                        id: "abcd"
                    });
                },
                ctrlKey: true
            };
            controller.isMessageSelected = false;
            controller.disableButtons();
            sinon.stub(controller, 'enableButtons');
            sinon.stub(controller, 'viewStatusEvents');
            controller.messageSelected(null, item, null, null, eOpts);
            expect(controller.isMessageSelected).to.be(false);
            expect(controller.enableButtons.called).to.be(true);
            expect(controller.viewStatusEvents.called).to.be(false);
            expect(controller.getSelectedMessageIds()[0]).to.be("abcd");
        });
        it("check when message is selected with target as statusEvent's column ", function() {
            var item = {
                data: {
                    id: "abcd"
                }
            };
            var eOpts = {
                getTarget: function() {
                    return ({
                        id: "viewPanel"
                    });
                },
                ctrlKey: true
            };
            controller.isMessageSelected = false;
            controller.disableButtons();
            sinon.stub(controller, 'enableButtons');
            sinon.stub(controller, 'viewStatusEvents');
            controller.messageSelected(null, item, null, null, eOpts);
            // expect(controller.isMessageSelected).to.be(false);
            // expect(controller.enableButtons.called).to.be(false);
            expect(controller.viewStatusEvents.called).to.be(true);
            // expect(controller.getSelectedMessageId()[0]).to.be("abcd");
        });
    });

    describe('JS unit cases for Configure function', function() {
        before(function() {
            controller = Ext.create('JDA.dm.MessageStore.controller.MessageStoreSummaryController');
            sinon.stub(controller, 'showView');
        });

        after(function() {
            Ext.destroy(controller);
            controller = undefined;
            config = undefined;
        });

        it('Should set showView function', function() {
            var config = {
                config: [{
                    filterQuery: null
                }]
            };
            controller.filterString = undefined;
            controller.configure(config);
            // expect(controller.showView.called).to.be(true);
            expect(controller.filterString).not.to.be(undefined);
        });
    });

    describe('JS unit cases for viewMessage function', function() {
        before(function() {
            controller = Ext.create('JDA.dm.MessageStore.controller.MessageStoreSummaryController');
            controller.pageOffset = 0;
            controller.pageLimit = 10;
            controller.count = 0;
            // sinon.stub(RP.Ajax,"request");
            CSUnit.fakeServer.autoRespond = false;
            sinon.stub(controller, "_displayMessage");
            controller.getSelectedMessageIds().push("AVK");
        });

        after(function() {
            Ext.destroy(controller);
            controller = undefined;
        });

        it('Should call _displayMessage function', function() {
            CSUnit.fakeServer.respondWith(/\/messages/, function(xhr) {
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
                        "data": {
                            "type": "messages",
                            "id": "AVK",
                            "attributes": {
                                "DocumentId": "demo_test1.1",
                                "FormatType": "GS1",
                                "Parent": "AVsfKzsn2i2QU7A8woU_",
                                "Message": "<labor_capacity:laborCapacityMessage xmlns:labor_capacity=\"urn:jda:ecom:labor_capacity:xsd:3\" xmlns:sh=\"http://www.unece.org/cefact/namespaces/StandardBusinessDocumentHeader\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"urn:jda:ecom:labor_capacity:xsd:3 ../Schemas/jda/ecom/LaborCapacity.xsd\"><StandardBusinessDocumentHeader xmlns=\"http://www.unece.org/cefact/namespaces/StandardBusinessDocumentHeader\"><HeaderVersion>1.0</HeaderVersion><Sender><Identifier Authority=\"ENTERPRISE\">OMS.GLOBAL</Identifier></Sender><Receiver><Identifier Authority=\"ENTERPRISE\">DMD.GLOBAL</Identifier></Receiver><DocumentIdentification><Standard>GS1</Standard><TypeVersion>3.2</TypeVersion><InstanceIdentifier>demo_test1</InstanceIdentifier><Type>order</Type><CreationDateAndTime>2017-03-12T14:29:07.520Z</CreationDateAndTime></DocumentIdentification><BusinessScope><Scope><Type>SCHEMA_GUIDE</Type><InstanceIdentifier>GS1 3.2,GS1_JDA 2017.1.0</InstanceIdentifier><Identifier>laborCapacityMessage 1.0.0</Identifier></Scope></BusinessScope></StandardBusinessDocumentHeader><laborCapacity xmlns:labor_capacity=\"urn:jda:ecom:labor_capacity:xsd:3\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:sh=\"http://www.unece.org/cefact/namespaces/StandardBusinessDocumentHeader\">\n        <creationDateTime>2017-3-17T09:30:40Z</creationDateTime>\n        <documentStatusCode>ORIGINAL</documentStatusCode>\n        <laborCapacityIdentification>\n            <entityIdentification>labor1</entityIdentification>\n        </laborCapacityIdentification>\n        <enterprise>WalMart</enterprise>\n        <location>DC101</location>\n        <measures>\n            <measure>coShipRel</measure>\n            <measure>coPickRel</measure>\n        </measures>\n        <laborForecast>\n            <metric startTime=\"2017-3-19T01:00:00Z\" coShipRel=\"5\" coPickRel=\"3\" laborCost=\"10.7\"/>\n        </laborForecast>\n    </laborCapacity></labor_capacity:laborCapacityMessage>",
                                "Endpoint": "jms:queue:gs1_bulk_labor_capacity",
                                "ComponentName": "WMS",
                                "ComponentId": "698670fd-1543-11e7-85b9-005056bf5497-00057508",
                                "StatusEvents": [{
                                    "Status": "Received",
                                    "Timestamp": "2017-03-30T17:52:58.708+05:30"
                                }, {
                                    "Status": "Processed",
                                    "Timestamp": "2017-03-30T17:52:59.239+05:30"
                                }],
                                "FormatVer": "[GS1:3.2.0,GS1_JDA:2017.1.0,laborCapacityMessage:1.0.0]",
                                "Side": "FRONT",
                                "OperationName": "laborCapacityMessage",
                                "Direction": "RECEIVED",
                                "CamelExchangeId": "ID-IN2NPDVINTMT02-54630-1490876492143-0-7",
                                "ComponentVer": "[WMS:9.0.0]",
                                "CreatedTimestamp": "2017-03-30T17:52:58.708+05:30",
                                "CurrentStatus": "Processed",
                                "Hostname": "IN2NPDVINTMT02",
                                "NaturalKey": "WMS.demo_test1.1",
                                "PartSequence": 0,
                                "Bulk": false
                            }
                        },
                        "type": "J"
                    }));
            });

            controller._viewMessage();
            CSUnit.fakeServer.respond();

            expect(controller._displayMessage.called).to.be(true);
            // expect(RP.Ajax.request.called).to.be(true);
        });
    });

    describe('JS unit cases for processMessage function', function() {
        before(function() {
            controller = Ext.create('JDA.dm.MessageStore.controller.MessageStoreSummaryController');
            controller.pageOffset = 0;
            controller.pageLimit = 10;
            controller.count = 0;
            // sinon.stub(RP.Ajax,"request");
            CSUnit.fakeServer.autoRespond = false;
            sinon.stub(controller, "_processMessage");
            controller.getSelectedMessageIds().push("AVK");
        });

        after(function() {
            Ext.destroy(controller);
            controller = undefined;
        });

        it('Should call _processMessage function', function() {
            CSUnit.fakeServer.respondWith(/\/messages/, function(xhr) {
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
                        "data": {
                            "type": "messages",
                            "id": "AVK",
                            "attributes": {
                                "DocumentId": "demo_test1.1",
                                "FormatType": "GS1",
                                "Parent": "AVsfKzsn2i2QU7A8woU_",
                                "Message": "<labor_capacity:laborCapacityMessage xmlns:labor_capacity=\"urn:jda:ecom:labor_capacity:xsd:3\" xmlns:sh=\"http://www.unece.org/cefact/namespaces/StandardBusinessDocumentHeader\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"urn:jda:ecom:labor_capacity:xsd:3 ../Schemas/jda/ecom/LaborCapacity.xsd\"><StandardBusinessDocumentHeader xmlns=\"http://www.unece.org/cefact/namespaces/StandardBusinessDocumentHeader\"><HeaderVersion>1.0</HeaderVersion><Sender><Identifier Authority=\"ENTERPRISE\">OMS.GLOBAL</Identifier></Sender><Receiver><Identifier Authority=\"ENTERPRISE\">DMD.GLOBAL</Identifier></Receiver><DocumentIdentification><Standard>GS1</Standard><TypeVersion>3.2</TypeVersion><InstanceIdentifier>demo_test1</InstanceIdentifier><Type>order</Type><CreationDateAndTime>2017-03-12T14:29:07.520Z</CreationDateAndTime></DocumentIdentification><BusinessScope><Scope><Type>SCHEMA_GUIDE</Type><InstanceIdentifier>GS1 3.2,GS1_JDA 2017.1.0</InstanceIdentifier><Identifier>laborCapacityMessage 1.0.0</Identifier></Scope></BusinessScope></StandardBusinessDocumentHeader><laborCapacity xmlns:labor_capacity=\"urn:jda:ecom:labor_capacity:xsd:3\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:sh=\"http://www.unece.org/cefact/namespaces/StandardBusinessDocumentHeader\">\n        <creationDateTime>2017-3-17T09:30:40Z</creationDateTime>\n        <documentStatusCode>ORIGINAL</documentStatusCode>\n        <laborCapacityIdentification>\n            <entityIdentification>labor1</entityIdentification>\n        </laborCapacityIdentification>\n        <enterprise>WalMart</enterprise>\n        <location>DC101</location>\n        <measures>\n            <measure>coShipRel</measure>\n            <measure>coPickRel</measure>\n        </measures>\n        <laborForecast>\n            <metric startTime=\"2017-3-19T01:00:00Z\" coShipRel=\"5\" coPickRel=\"3\" laborCost=\"10.7\"/>\n        </laborForecast>\n    </laborCapacity></labor_capacity:laborCapacityMessage>",
                                "Endpoint": "jms:queue:gs1_bulk_labor_capacity",
                                "ComponentName": "WMS",
                                "ComponentId": "698670fd-1543-11e7-85b9-005056bf5497-00057508",
                                "StatusEvents": [{
                                    "Status": "Received",
                                    "Timestamp": "2017-03-30T17:52:58.708+05:30"
                                }, {
                                    "Status": "Processed",
                                    "Timestamp": "2017-03-30T17:52:59.239+05:30"
                                }],
                                "FormatVer": "[GS1:3.2.0,GS1_JDA:2017.1.0,laborCapacityMessage:1.0.0]",
                                "Side": "FRONT",
                                "OperationName": "laborCapacityMessage",
                                "Direction": "RECEIVED",
                                "CamelExchangeId": "ID-IN2NPDVINTMT02-54630-1490876492143-0-7",
                                "ComponentVer": "[WMS:9.0.0]",
                                "CreatedTimestamp": "2017-03-30T17:52:58.708+05:30",
                                "CurrentStatus": "Processed",
                                "Hostname": "IN2NPDVINTMT02",
                                "NaturalKey": "WMS.demo_test1.1",
                                "PartSequence": 0,
                                "Bulk": false
                            }
                        },
                        "type": "J"
                    }));
            });

            controller._processMessage();
            CSUnit.fakeServer.respond();

            expect(controller._processMessage.called).to.be(true);
            // expect(RP.Ajax.request.called).to.be(true);
        });
    });

    describe('JS Unit case for refreshGridView function', function() {
        before(function() {
            controller = Ext.create('JDA.dm.MessageStore.controller.MessageStoreSummaryController');
            controller.pageOffset = 0;
            controller.pageLimit = 10;
            controller.count = 0;

            store = Ext.create('JDA.dm.MessageStore.store.MessageStoreSummaryStore', {
                storeId: 'MessageStoreSummaryStore',
                data: Ext.create('JDA.dm.MessageStore.model.MessageStoreSummaryModel', {
                    DocumentId: 'bad5',
                    CamelExchangeId: 'ID-IN2NPDVINTMT02-55233-1490194394181-0-12',
                    FormatType: "GS1",
                    FormatVer: "[GS1:3.2.0,GS1_JDA:2016.1.0,TransferOrder:1.0.0]",
                    CreatedTimestamp: " 2017-03-31",
                    ErrorMessage: 'Errors encountered again',
                    CurrentStatus: 'Recieved',
                    Status: 'View',
                    ComponentName: "ABCd",
                    ComponentId: "4789f93f-0f0f-11e7-a2f3-005056bf5497-00049624",
                    ComponentVer: "hsuhiusdss",
                    OperationName: "8ois",
                    Hostname: "suhushs",
                    Direction: "RECEIVED",
                    Side: "FRONT",
                    SenderId: "",
                    ReceiverId: "",
                    id: "bad5"
                })
            });
            controller.store = store;
        });
        after(function() {
            Ext.destroy(controller);
            controller = undefined;

            Ext.destroy(store);
            store = undefined;
        });

        it('should call setMessageStoreExtraParam and disableButtons function', function() {
            sinon.stub(controller, 'getMessageStore').returns(store);
            sinon.stub(controller, 'setMessageStoreExtraParam');
            sinon.stub(controller, 'disableButtons');
            sinon.stub(controller.getMessageStoreGrid(), 'reconfigure');
            var records = {
                _lastParams: {
                    query: null
                },
                totalCount: 115,
                _lastOperation: {
                    params: {
                        offset: null
                    }
                }
            };
            var operations = [{
                raw: {
                    attributes: {
                        Bulk: false,
                        CamelExchangeId: "ID-1010168WIN7LT-55343-1467039647435-22-21",
                        ComponentId: "OMS-ADAPTER-INSTANCE",
                        ComponentName: "OMSAdapter",
                        ComponentVer: "[OMSAdapter:9.0.0]",
                        CreatedTimestamp: "2016-12-01T17:29:58.993+05:30",
                        Direction: "SENT",
                        DocumentId: "BOM2",
                        Endpoint: "{{to.oms.jmsadapter.outUri}}",
                        FormatType: "GS1",
                        FormatVer: "[GS1:3.2.0]",
                        Hostname: "IN2NPDVINTMT02",
                        Message: "Test Message",
                        OperationName: "BOMMessage",
                        Parent: "125",
                        PartSequence: 0,
                        Side: "FRONT"
                    }
                }
            }];
            controller.refreshGridView(records, operations, true);
            expect(controller.setMessageStoreExtraParam.called).to.be(true);
            expect(controller.disableButtons.called).to.be(true);
            expect(controller.count).to.be(records.totalCount);
            expect(controller.getMessageStoreGrid().down('pagingtoolbar').store.totalCount).to.be(records.totalCount);
            expect(Ext.getCmp('MessageStoreGrid').down('pagingtoolbar').displayMsg).not.to.be("No data to display");
            expect(controller.getMessageStoreGrid().store).to.be.equal(controller.getMessageStore());
            expect(controller.getMessageStoreGrid().reconfigure.called).to.be.equal(true);
        });
        it('Should not call setMessageStoreExtraParam and disableButtons', function() {
            var records = {
                _lastParams: null,
                _lastOperation: {
                    params: {
                        offset: null
                    }
                },
                totalCount: 15
            };
            var operations = [{
                raw: {
                    attributes: {
                        Bulk: false,
                        CamelExchangeId: "ID-1010168WIN7LT-55343-1467039647435-22-21",
                        ComponentId: "OMS-ADAPTER-INSTANCE",
                        ComponentName: "OMSAdapter",
                        ComponentVer: "[OMSAdapter:9.0.0]",
                        CreatedTimestamp: "2016-12-01T17:29:58.993+05:30",
                        Direction: "SENT",
                        DocumentId: "BOM2",
                        Endpoint: "{{to.oms.jmsadapter.outUri}}",
                        FormatType: "GS1",
                        FormatVer: "[GS1:3.2.0]",
                        Hostname: "IN2NPDVINTMT02",
                        Message: "Test Message",
                        OperationName: "BOMMessage",
                        Parent: "125",
                        PartSequence: 0,
                        Side: "FRONT"
                    }
                }
            }];

            controller.disableButtons.restore();
            controller.setMessageStoreExtraParam.restore();
            sinon.stub(controller, 'disableButtons');
            sinon.stub(controller, 'setMessageStoreExtraParam');
            controller.getMessageStoreGrid().reconfigure.restore();
            sinon.stub(controller.getMessageStoreGrid(), 'reconfigure');

            controller.refreshGridView(records, operations, true);

            expect(controller.setMessageStoreExtraParam.called).to.be(false);
            expect(controller.disableButtons.called).to.be(false);
            expect(controller.count).to.be(records.totalCount);
            expect(controller.getMessageStoreGrid().down('pagingtoolbar').store.totalCount).to.be(records.totalCount);
            expect(Ext.getCmp('MessageStoreGrid').down('pagingtoolbar').displayMsg).not.to.be("No data to display");
            expect(controller.getMessageStoreGrid().store).to.be.equal(controller.getMessageStore());
            expect(controller.getMessageStoreGrid().reconfigure.called).to.be.equal(true);
        });
        it("should show 'no data to display' message", function() {
            var records = {
                _lastParams: null,
                _lastOperation: {
                    params: {
                        offset: null
                    }
                },
                totalCount: 0
            };
            var operations = [{
                raw: {
                    attributes: {
                        Bulk: false,
                        CamelExchangeId: "ID-1010168WIN7LT-55343-1467039647435-22-21",
                        ComponentId: "OMS-ADAPTER-INSTANCE",
                        ComponentName: "OMSAdapter",
                        ComponentVer: "[OMSAdapter:9.0.0]",
                        CreatedTimestamp: "2016-12-01T17:29:58.993+05:30",
                        Direction: "SENT",
                        DocumentId: "BOM2",
                        Endpoint: "{{to.oms.jmsadapter.outUri}}",
                        FormatType: "GS1",
                        FormatVer: "[GS1:3.2.0]",
                        Hostname: "IN2NPDVINTMT02",
                        Message: "Test Message",
                        OperationName: "BOMMessage",
                        Parent: "125",
                        PartSequence: 0,
                        Side: "FRONT"
                    }
                }
            }];

            controller.disableButtons.restore();
            controller.setMessageStoreExtraParam.restore();
            sinon.stub(controller, 'disableButtons');
            sinon.stub(controller, 'setMessageStoreExtraParam');
            controller.getMessageStoreGrid().reconfigure.restore();
            sinon.stub(controller.getMessageStoreGrid(), 'reconfigure');
            controller.refreshGridView(records, operations, true);
            expect(controller.setMessageStoreExtraParam.called).to.be(false);
            expect(controller.disableButtons.called).to.be(false);
            expect(controller.count).to.be(records.totalCount);
            expect(controller.getMessageStoreGrid().down('pagingtoolbar').store.totalCount).to.be(records.totalCount);
            expect(Ext.getCmp('MessageStoreGrid').down('pagingtoolbar').displayMsg).to.be("No data to display");
            expect(controller.getMessageStoreGrid().store).to.be.equal(controller.getMessageStore());
            expect(controller.getMessageStoreGrid().reconfigure.called).to.be.equal(true);
        });

        it('Should not call ronfigure function', function() {
            var records = {
                _lastParams: null,
                totalCount: 0,
                _lastOperation: {
                    params: {
                        offset: null
                    }
                }
            };
            var operations = [{
                raw: {
                    attributes: {
                        Bulk: false,
                        CamelExchangeId: "ID-1010168WIN7LT-55343-1467039647435-22-21",
                        ComponentId: "OMS-ADAPTER-INSTANCE",
                        ComponentName: "OMSAdapter",
                        ComponentVer: "[OMSAdapter:9.0.0]",
                        CreatedTimestamp: "2016-12-01T17:29:58.993+05:30",
                        Direction: "SENT",
                        DocumentId: "BOM2",
                        Endpoint: "{{to.oms.jmsadapter.outUri}}",
                        FormatType: "GS1",
                        FormatVer: "[GS1:3.2.0]",
                        Hostname: "IN2NPDVINTMT02",
                        Message: "Test Message",
                        OperationName: "BOMMessage",
                        Parent: "125",
                        PartSequence: 0,
                        Side: "FRONT"
                    }
                }
            }];

            controller.disableButtons.restore();
            controller.setMessageStoreExtraParam.restore();
            sinon.stub(controller, 'disableButtons');
            sinon.stub(controller, 'setMessageStoreExtraParam');
            controller.getMessageStoreGrid().reconfigure.restore();
            sinon.stub(controller.getMessageStoreGrid(), 'reconfigure');

            controller.refreshGridView(records, operations, false);

            expect(controller.setMessageStoreExtraParam.called).to.be(false);
            expect(controller.disableButtons.called).to.be(false);
            expect(controller.getMessageStoreGrid().reconfigure.called).to.be.equal(false);
        });
    });

    describe('Test cases for showView function', function() {
        beforeEach(function() {
            store = Ext.create('JDA.dm.MessageStore.store.MessageStoreSummaryStore');
            controller = Ext.create('JDA.dm.MessageStore.controller.MessageStoreSummaryController');
            controller.store = store;
            sinon.stub(controller, 'setMessageStore');
            sinon.stub(controller, 'loadMessageStore');
            sinon.stub(controller, 'setMessageStoreExtraParam');
            sinon.stub(controller, 'getMessageStore').returns(store);

        });

        it('should  call setMessageStore', function() {

            var column = {
                dataIndex: 3
            };
            controller.showView();

            expect(controller.setMessageStore.called).to.be(false);

        });


        it('should call getMessageStore', function() {

            var column = {
                dataIndex: 3
            };


            controller.showView();
            expect(controller.getMessageStore.called).to.be(true);


        });

        it('should call  setMessageStoreExtraParam ', function() {
            var column = {
                dataIndex: 3
            };
            controller.showView();

            expect(controller.setMessageStoreExtraParam.called).to.be(true);
        });
        // TO DO : Check for refreshGridView being called by showView

        //  it('should call  refreshGridView ', function () {
        //     controller.showView();
        //     var callback = sinon.stub(controller,'refreshGridView');
        //     callback();
        //     expect(controller.refreshGridView.called).to.be(true);
        // });
        it('should update params from branch 2', function() {
            controller.setMessageStoreExtraParam.restore();
            var column = {
                dataIndex: 3
            };
            controller.filterString = "testdataforJsUnit";
            controller.getMessageStore().proxy.extraParams.query = null;
            sinon.stub(controller.store, 'load');
            controller.showView();
            expect(controller.getMessageStore().proxy.extraParams.query).to.be.equal("testdataforJsUnit");
            expect(controller.store.load.called).to.be(true);
        });

        //  it('should call  refreshGridView ', function () {
        //      sinon.stub(controller.getMesss)
        //     controller.showView();

        // });
        after(function() {
            Ext.destroy(controller);
            controller = undefined;
            Ext.destroy(store);
            store = undefined;
        });

    });
    describe('Js unit case for setMessageStoreExtraParam function', function() {
        before(function() {
            controller = Ext.create('JDA.dm.MessageStore.controller.MessageStoreSummaryController');
            controller.pageOffset = 0;
            controller.pageLimit = 10;
            controller.count = 73;
            store = Ext.create('JDA.dm.MessageStore.store.MessageStoreSummaryStore', {
                storeId: 'MessageStoreSummaryStore',
                data: Ext.create('JDA.dm.MessageStore.model.MessageStoreSummaryModel', {
                    DocumentId: 'bad5',
                    CamelExchangeId: 'ID-IN2NPDVINTMT02-55233-1490194394181-0-12',
                    FormatType: "GS1",
                    FormatVer: "[GS1:3.2.0,GS1_JDA:2016.1.0,TransferOrder:1.0.0]",
                    CreatedTimestamp: " 2017-03-31",
                    ErrorMessage: 'Errors encountered again',
                    CurrentStatus: 'Recieved',
                    Status: 'View',
                    ComponentName: "ABCd",
                    ComponentId: "4789f93f-0f0f-11e7-a2f3-005056bf5497-00049624",
                    ComponentVer: "hsuhiusdss",
                    OperationName: "8ois",
                    Hostname: "suhushs",
                    Direction: "RECEIVED",
                    Side: "FRONT",
                    SenderId: "",
                    ReceiverId: "",
                    id: "bad5"
                })
            });
            controller.setMessageStore(store);
        });

        after(function() {
            Ext.destroy(controller);
            controller = undefined;
            Ext.destroy(store);
            store = undefined;
        });

        it('should update offset value ', function() {
            controller.getMessageStore().proxy.extraParams.offset = 20;
            controller.setMessageStoreExtraParam('offset', 1);
            expect(controller.getMessageStore().proxy.extraParams.offset).to.be.equal(1);
        });
    });

    describe('JS Unit cases for loadMessageStore function', function() {
        before(function() {
            controller = Ext.create('JDA.dm.MessageStore.controller.MessageStoreSummaryController');
            controller.pageOffset = 0;
            controller.pageLimit = 10;
            controller.count = 73;
            store = Ext.create('JDA.dm.MessageStore.store.MessageStoreSummaryStore', {
                storeId: 'MessageStoreSummaryStore',
                data: Ext.create('JDA.dm.MessageStore.model.MessageStoreSummaryModel', {
                    DocumentId: 'bad5',
                    CamelExchangeId: 'ID-IN2NPDVINTMT02-55233-1490194394181-0-12',
                    FormatType: "GS1",
                    FormatVer: "[GS1:3.2.0,GS1_JDA:2016.1.0,TransferOrder:1.0.0]",
                    CreatedTimestamp: " 2017-03-31",
                    ErrorMessage: 'Errors encountered again',
                    CurrentStatus: 'Recieved',
                    Status: 'View',
                    ComponentName: "ABCd",
                    ComponentId: "4789f93f-0f0f-11e7-a2f3-005056bf5497-00049624",
                    ComponentVer: "hsuhiusdss",
                    OperationName: "8ois",
                    Hostname: "suhushs",
                    Direction: "RECEIVED",
                    Side: "FRONT",
                    SenderId: "",
                    ReceiverId: "",
                    id: "bad5"
                })
            });
            sinon.stub(controller.getMessageStoreGrid().store, 'load');
        });

        after(function() {
            Ext.destroy(controller);
            controller = undefined;
            Ext.destroy(store);
            store = undefined;
        });

        it('Should call loadMessageStore load ', function() {
            controller.loadMessageStore();
            expect(controller.getMessageStoreGrid().store.load.called).to.be(true);
        });

    });

    describe('JS unit cases for viewStatusEvents function', function() {
        before(function() {
            // view = Ext.create('JDA.dm.MessageStore.view.MessageStoreSummary');

            controller = Ext.create('JDA.dm.MessageStore.controller.MessageStoreSummaryController');
            controller.pageOffset = 0;
            controller.pageLimit = 10;
            controller.count = 73;
            store = Ext.create('JDA.dm.MessageStore.store.MessageStoreSummaryStore', {
                storeId: 'MessageStoreSummaryStore',
                data: Ext.create('JDA.dm.MessageStore.model.MessageStoreSummaryModel', {
                    DocumentId: 'bad5',
                    CamelExchangeId: 'ID-IN2NPDVINTMT02-55233-1490194394181-0-12',
                    FormatType: "GS1",
                    FormatVer: "[GS1:3.2.0,GS1_JDA:2016.1.0,TransferOrder:1.0.0]",
                    CreatedTimestamp: " 2017-03-31",
                    ErrorMessage: 'Errors encountered again',
                    CurrentStatus: 'Recieved',
                    Status: 'View',
                    ComponentName: "ABCd",
                    ComponentId: "4789f93f-0f0f-11e7-a2f3-005056bf5497-00049624",
                    ComponentVer: "hsuhiusdss",
                    OperationName: "8ois",
                    Hostname: "suhushs",
                    Direction: "RECEIVED",
                    Side: "FRONT",
                    SenderId: "",
                    ReceiverId: "",
                    id: "bad5"
                })
            });
            sinon.stub(controller, '_displayStatusEvents');
        });
        after(function() {
            Ext.destroy(controller);
            controller = undefined;
            Ext.destroy(store);
            store = undefined;
        });

        it('should call _displayStatusEvents function', function() {
            var eOpts = {
                stopEvent: function() {
                    return ({
                        id: "abcd"
                    });
                }
            };
            var item = {
                data: {
                    id: 2
                }
            };
            controller.viewStatusEvents(null, item, null, null, eOpts);
            expect(controller._displayStatusEvents.called).to.be(true);
        });
    });
    describe('Test cases for MessageStore -  Store', function() {
        before(function() {

            var store, rule;
            CSUnit.fakeServer.autoRespond = false;

        });

        after(function() {
            Ext.destroy(store);
            store = undefined;
        });

        it('Should successfully create the store ', function() {
            store = Ext.create('JDA.dm.MessageStore.store.MessageStoreSummaryStore');
            expect(store).to.be.ok();
        });
        it('Should populate the store on load', function() {

            // Respond to GET requests against the WM Allocation Rules endpoint
            CSUnit.fakeServer.respondWith(/\/messages/, function(xhr) {
                xhr.respond(
                    // 200 'OK' status
                    200,
                    // Type of response is JSON
                    {
                        'content-type': 'application/json'
                    },
                    // String encode of the response JSON
                    Ext.JSON.encode({
                        // Our services include a wrapper around their data
                        '@type': 'ResponseBodyWrapper',
                        // Data response
                        'data': [{
                            'DocumentId': 'bad5',
                            'CamelExchangeId': 'ID-IN2NPDVINTMT02-55233-1490194394181-0-12',
                            'FormatType': "GS1",
                            'FormatVer': "[GS1:3.2.0,GS1_JDA:2016.1.0,TransferOrder:1.0.0]",
                            'CreatedTimestamp': "2017-03-31",
                            'ErrorMessage': 'Errors encountered again',
                            'CurrentStatus': 'Recieved',
                            'Status': 'View',
                            'ComponentName': "ABCd",
                            'ComponentId': "4789f93f-0f0f-11e7-a2f3-005056bf5497-00049624",
                            'ComponentVer': "hsuhiusdss",
                            'OperationName': "8ois",
                            'Hostname': "suhushs",
                            'Direction': "RECEIVED",
                            'Side': "FRONT",
                            'SenderId': "",
                            'ReceiverId': "",
                            'id': "bad5"
                        }]
                    }));
            });
            store.load();
            CSUnit.fakeServer.respond();

            // Confirm store data count
            expect(store.getCount()).to.be(1);
            rule = store.getRange()[0];
            expect(rule.get('CamelExchangeId')).to.be('ID-IN2NPDVINTMT02-55233-1490194394181-0-12');
            expect(rule.get('DocumentId')).to.be('bad5');
            expect(rule.get('FormatType')).to.be('GS1');
            expect(rule.get('FormatVer')).to.be('[GS1:3.2.0,GS1_JDA:2016.1.0,TransferOrder:1.0.0]');
            expect(rule.get('CreatedTimestamp')).to.be('2017-03-31');
            expect(rule.get('ErrorMessage')).to.be('Errors encountered again');
            expect(rule.get('CurrentStatus')).to.be('Recieved');
            expect(rule.get('Status')).to.be('View');
            expect(rule.get('ComponentName')).to.be('ABCd');
            expect(rule.get('ComponentId')).to.be('4789f93f-0f0f-11e7-a2f3-005056bf5497-00049624');
            expect(rule.get('ComponentVer')).to.be('hsuhiusdss');
            expect(rule.get('OperationName')).to.be('8ois');
            expect(rule.get('Hostname')).to.be('suhushs');
            expect(rule.get('Direction')).to.be('RECEIVED');
            expect(rule.get('Side')).to.be('FRONT');
            expect(rule.get('SenderId')).to.be('');
            expect(rule.get('ReceiverId')).to.be('');
            expect(rule.get('id')).to.be('bad5');
        });
    });
    describe('Test cases for Init -  MessageStore', function() {
        before(function() {
            controller = Ext.create('JDA.dm.MessageStore.controller.MessageStoreSummaryController');
        });

        after(function() {
            Ext.destroy(controller);
            controller = undefined;
        });

        it('Should successfully call this function ', function() {
            sinon.stub(controller, 'control');
            controller.init();
            expect(controller.control.called).to.be(true);
        });
    });
    after(function() {
        Ext.destroy(controller);
        controller = undefined;
        Ext.destroy(store);
        store = undefined;
        view = undefined;
    });

    describe('Test cases for _downloadMessage -  MessageStore', function() {
        before(function() {
            controller = Ext.create('JDA.dm.MessageStore.controller.MessageStoreSummaryController');
            sinon.stub(controller, 'getSelectedMessageId').returns('TestId');
            // sinon.stub(controller,'_getDownloadFrame').returns(controller._createDownloadFrame());
            // sinon.stub(a,'load');
            sinon.stub(controller._getDownloadFrame(), 'load').returns(true);
        });

        after(function() {
            Ext.destroy(controller);
            controller = undefined;
        });

        it('Should successfully call********* function ', function() {
            controller._downloadMessage();
            expect(controller.getSelectedMessageId.called).to.be(true);
            expect(controller._getDownloadFrame().load.called).to.be(true);
        });
    });
    after(function() {
        Ext.destroy(controller);
        controller = undefined;
        Ext.destroy(store);
        store = undefined;
        view = undefined;
    });


    describe('Test cases for -  MessageStore', function() {
        before(function() {
            controller = Ext.create('JDA.dm.MessageStore.controller.MessageStoreSummaryController');
            CSUnit.fakeServer.respondWith(/\/messages/, function(xhr) {
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
                        "data": {
                            "type": "messages",
                            "id": "AVK",
                            "attributes": {
                                "DocumentId": "demo_test1.1",
                                "FormatType": "GS1",
                                "Parent": "AVsfKzsn2i2QU7A8woU_",
                                "Message": "<labor_capacity:laborCapacityMessage xmlns:labor_capacity=\"urn:jda:ecom:labor_capacity:xsd:3\" xmlns:sh=\"http://www.unece.org/cefact/namespaces/StandardBusinessDocumentHeader\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"urn:jda:ecom:labor_capacity:xsd:3 ../Schemas/jda/ecom/LaborCapacity.xsd\"><StandardBusinessDocumentHeader xmlns=\"http://www.unece.org/cefact/namespaces/StandardBusinessDocumentHeader\"><HeaderVersion>1.0</HeaderVersion><Sender><Identifier Authority=\"ENTERPRISE\">OMS.GLOBAL</Identifier></Sender><Receiver><Identifier Authority=\"ENTERPRISE\">DMD.GLOBAL</Identifier></Receiver><DocumentIdentification><Standard>GS1</Standard><TypeVersion>3.2</TypeVersion><InstanceIdentifier>demo_test1</InstanceIdentifier><Type>order</Type><CreationDateAndTime>2017-03-12T14:29:07.520Z</CreationDateAndTime></DocumentIdentification><BusinessScope><Scope><Type>SCHEMA_GUIDE</Type><InstanceIdentifier>GS1 3.2,GS1_JDA 2017.1.0</InstanceIdentifier><Identifier>laborCapacityMessage 1.0.0</Identifier></Scope></BusinessScope></StandardBusinessDocumentHeader><laborCapacity xmlns:labor_capacity=\"urn:jda:ecom:labor_capacity:xsd:3\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:sh=\"http://www.unece.org/cefact/namespaces/StandardBusinessDocumentHeader\">\n        <creationDateTime>2017-3-17T09:30:40Z</creationDateTime>\n        <documentStatusCode>ORIGINAL</documentStatusCode>\n        <laborCapacityIdentification>\n            <entityIdentification>labor1</entityIdentification>\n        </laborCapacityIdentification>\n        <enterprise>WalMart</enterprise>\n        <location>DC101</location>\n        <measures>\n            <measure>coShipRel</measure>\n            <measure>coPickRel</measure>\n        </measures>\n        <laborForecast>\n            <metric startTime=\"2017-3-19T01:00:00Z\" coShipRel=\"5\" coPickRel=\"3\" laborCost=\"10.7\"/>\n        </laborForecast>\n    </laborCapacity></labor_capacity:laborCapacityMessage>",
                                "Endpoint": "jms:queue:gs1_bulk_labor_capacity",
                                "ComponentName": "WMS",
                                "ComponentId": "698670fd-1543-11e7-85b9-005056bf5497-00057508",
                                "StatusEvents": [{
                                    "Status": "Received",
                                    "Timestamp": "2017-03-30T17:52:58.708+05:30"
                                }, {
                                    "Status": "Processed",
                                    "Timestamp": "2017-03-30T17:52:59.239+05:30"
                                }],
                                "FormatVer": "[GS1:3.2.0,GS1_JDA:2017.1.0,laborCapacityMessage:1.0.0]",
                                "Side": "FRONT",
                                "OperationName": "laborCapacityMessage",
                                "Direction": "RECEIVED",
                                "CamelExchangeId": "ID-IN2NPDVINTMT02-54630-1490876492143-0-7",
                                "ComponentVer": "[WMS:9.0.0]",
                                "CreatedTimestamp": "2017-03-30T17:52:58.708+05:30",
                                "CurrentStatus": "Processed",
                                "Hostname": "IN2NPDVINTMT02",
                                "NaturalKey": "WMS.demo_test1.1",
                                "PartSequence": 0,
                                "Bulk": false
                            }
                        },
                        "type": "J"
                    }));
            });
            CSUnit.fakeServer.autoRespond = false;
        });

        after(function() {
            Ext.destroy(controller);
            controller = undefined;
        });

        it('Should successfully call********* function ', function() {
            sinon.stub(Ext, 'create');
            sinon.stub(Ext, 'decode');
            controller._displayStatusEvents('AVK');
            CSUnit.fakeServer.respond();
            expect(Ext.create.called).to.be(true);
            expect(Ext.create.called).to.be(true);
        });
    });
    after(function() {
        Ext.destroy(controller);
        controller = undefined;
        Ext.destroy(store);
        store = undefined;
        view = undefined;
    });

});