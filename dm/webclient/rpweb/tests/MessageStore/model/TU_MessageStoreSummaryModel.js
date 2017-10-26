describe('Test cases for MessageStoreSummaryModel', function() {
    var model, store;
    before(function() {
        CSUnit.fakeServer.autoRespond = false;
        store = Ext.create('JDA.dm.MessageStore.store.MessageStoreSummaryStore');
    });

    after(function() {
        Ext.destroy(model);
        model = undefined;
    });

    it('Should successfully create the model ', function() {
        model = Ext.create('JDA.dm.MessageStore.model.MessageStoreSummaryModel');
        expect(model).to.be.ok();
    });

    it("Check for listener function", function() {
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
            xhr.addEventListener('load', function() {
                var body;
                try {
                    body = JSON.parse(this.responseText);
                } catch (e) {
                    return callback('Invalid JSON:', this.responseText);
                }

                if (this.status < 200 || this.status > 299) {
                    return callback(apiError(this.status, body.message));
                }

                return callback(null, body);
            });
        });
        store.load();
        CSUnit.fakeServer.respond();
    });
});