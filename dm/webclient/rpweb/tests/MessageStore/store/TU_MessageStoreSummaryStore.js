    describe('Test cases for MessageStore -  Store', function () {
        before(function () {

            var store, rule;
            CSUnit.fakeServer.autoRespond = false;

        });

        after(function () {
            Ext.destroy(store);
            store = undefined;
        });

        it('Should successfully create the store ', function () {
            store = Ext.create('JDA.dm.MessageStore.store.MessageStoreSummaryStore');
            expect(store).to.be.ok();
        });
        it('Should populate the store on load', function () {

            // Respond to GET requests against the WM Allocation Rules endpoint
            CSUnit.fakeServer.respondWith(/\/messages/, function (xhr) {
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
        // it('Should not the store on load', function () {
        //     store.removeAll();
        //     // Respond to GET requests against the WM Allocation Rules endpoint
        //     CSUnit.fakeServer.respondWith(/\/messages/, function (xhr) {
        //         xhr.respond(
        //             // 200 'OK' status
        //             400,
        //             // Type of response is JSON
        //             {
        //                 'content-type': 'application/json'
        //             },
        //             // String encode of the response JSON
        //             Ext.JSON.encode({
        //                 // Our services include a wrapper around their data
        //                 '@type': 'ResponseBodyWrapper'
        //             }));
        //     });
        //     store.load();
        //     CSUnit.fakeServer.respond();

        //     // Confirm store data count
        //     expect(store.getCount()).to.be(0);
        // });
    });