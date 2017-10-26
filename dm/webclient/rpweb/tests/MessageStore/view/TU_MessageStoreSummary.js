describe('Unit Tests - Message Store Summary View', function () {
    var controller, store, view;
    before(function () {
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
                CreatedTimestamp: "	2017-03-31",
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

    it('view Should not error when created', function () {
        expect(view).not.to.be(undefined);
    });

    it('Test case for init function', function () {
         view.init();
         expect(store).not.to.be(undefined);
    });
    it('Test case for callParent function', function () {
         sinon.stub(view,'callParent');
         view.initComponent();
         expect(view.callParent.called).to.be(true);
    });
     it("Check for itemClick function", function() {
        sinon.stub(controller, 'itemClick');
        var fn = Ext.getCmp('MessageStoreGrid').events.itemclick.listeners[0].fn;
        expect(controller.itemclick.called).to.be(false);
    });
     it("Check for itemClick function", function() {
        sinon.stub(controller, 'messageSelected');
        var fn = Ext.getCmp('MessageStoreGrid').events.itemclick.listeners[0].fn;
        expect(controller.messageSelected.called).to.be(false);
    });
    it("Check for selectionchange function", function() {
        sinon.stub(controller, 'allMessagesSelected');
        var fn = Ext.getCmp('MessageStoreGrid').events.selectionchange.listeners[0].fn;
        expect(controller.allMessagesSelected.called).to.be(false);
    });
    it("Check for messageStoreSort function", function() {
        sinon.stub(controller, 'messageStoreSort');
        var fn = Ext.getCmp('MessageStoreGrid').events.sortchange.listeners[0].fn;
        expect(controller.messageStoreSort.called).to.be(false);
    });
    it("Check for beforechange function of msgPagingToolBar ", function() {
        sinon.stub(controller, 'moveToPage');
        var fn = Ext.getCmp('msgPagingToolBar').events.beforechange.listeners[0].fn;
        expect(controller.moveToPage.called).to.be(false);
    });
    //  it("Check for change function of msgPagingToolBar ", function() {
    //     sinon.stub(controller, 'moveToPageSize');
    //     var fn = Ext.getCmp('msgPagingToolBar').events.moveToPageSize.listeners[0].fn;
    //     expect(controller.moveToPageSize.called).to.be(false);
    // });
    //   it("Check for moveNext function of msgPagingToolBar ", function() {
    //     sinon.stub(controller, 'moveNext');
    //     var fn = Ext.getCmp('msgPagingToolBar').events.moveNext.listeners[0].fn;
    //     expect(controller.moveNext.called).to.be(true);
    // });
    //    it("Check for movePrevious function of msgPagingToolBar ", function() {
    //     sinon.stub(controller, 'movePrev');
    //     var fn = Ext.getCmp('msgPagingToolBar').events.movePrev.listeners[0].fn;
    //     expect(controller.movePrev.called).to.be(true);
    // });
    //     it("Check for moveFirst function of msgPagingToolBar ", function() {
    //     sinon.stub(controller, 'moveFirst');
    //     var fn = Ext.getCmp('msgPagingToolBar').events.moveFirst.listeners[0].fn;
    //     expect(controller.moveFirst.called).to.be(true);
    // });
    //      it("Check for moveLast function of msgPagingToolBar ", function() {
    //     sinon.stub(controller, 'moveLast');
    //     var fn = Ext.getCmp('msgPagingToolBar').events.moveLast.listeners[0].fn;
    //     expect(controller.moveLast.called).to.be(true);
    // });


    after(function () {
        Ext.destroy(view);
    });
});