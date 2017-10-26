describe('JS unit Cases for IntegrationDashboardSummaryPage', function() {
    var Page;
    before(function() {
       
    });

    it("Check for initComponent function", function() {
            Page = Ext.create('JDA.dm.IntegrationDashboard.IntegrationDashboardSummaryPage');
            sinon.stub(Page,'callParent');
            Page.initComponent();
            expect(Page.callParent.called).to.be(true);
    });
    after(function() {
        Ext.destroy(Page);
        Page = undefined;
    });
});