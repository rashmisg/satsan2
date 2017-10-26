describe('JS unit Cases for IntegrationDashboardView', function() {
    var view,store, _integartionDashboardController;
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


    it('view Should not error when created', function() {
        expect(view).not.to.be(undefined);
    });

    it('Test case for init function', function() {
       
        //sinon.stub(view, 'getParent');
        view.init();
        expect(view).not.to.be(undefined);
        expect(Ext.getStore.called).to.be(true);
        expect(view.getParent.called).to.be(true);
    });


    it("Check for itemClick function", function() {
        sinon.stub(_integartionDashboardController, 'dashBoardProcessedSelected');
        var fn = Ext.getCmp('DashBoardGridPanel').events.itemclick.listeners[0].fireFn;
        // _integartionDashboardController.dashBoardProcessedSelected();
        expect(_integartionDashboardController.dashBoardProcessedSelected.called).to.be(false);
    });


    after(function() {
        Ext.destroy(view);
        //view = undefined;
    });
});