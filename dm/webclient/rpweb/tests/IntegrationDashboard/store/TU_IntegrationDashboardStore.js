describe('Test cases for IntegrationDashboardStore -  Store', function () {
        before(function () {
            var store, rule;
            CSUnit.fakeServer.autoRespond = false;

        });

        after(function () {
            Ext.destroy(store);
            store = undefined;
        });

        it('Should successfully create the store ', function () {
            store = Ext.create('JDA.dm.IntegrationDashboard.store.IntegrationDashboardStore');
            expect(store).to.be.ok();
        });

         });