describe('JS unit Cases for MessageStoreStoreSummaryPage', function () {
var Page,controller  ;
        before(function () {
  
        
        });

        it("Check for initComponent function", function () {
            Page  = Ext.create('JDA.dm.MessageStore.MessageStoreSummaryPage');
            sinon.stub(Page,'callParent');
            Page.initComponent();
            expect(Page.callParent.called).to.be(true);
        });
        after(function () {
            Ext.destroy(Page);
            Page = undefined;
        });
    });

