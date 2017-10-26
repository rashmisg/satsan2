Ext.define('JDA.dm.IntegrationDashboard.controller.IntegrationDashboardController', {
    extend: 'Ext.app.Controller',
    config: {
        rowExpanderStore: null,
        includeAndInQuery: false,
        filterQuery: null,
        baseQuery: null,
        integrationDashboardStore: null,
        integrationDashboardPanelStore: null,
        statusFields: [],
        targetSystems: [],
        messageTypes: [],
        rowExpandFilterQuery: null,
        selectedDirection: 'All directions',
        columnConfigError: [],
        columnConfigProcessed: [],
        messageErrorRecords: [],
        messageProcessedRecords: [],
        messageProcessedPanelRecords: [],
        messageErrorPanelRecords: [],
        selectedErrorColumn: null,
        selectedProcessedColumn: null,
        maxErrorCount: null,
        maxProcessedCount: null,
        selectedPeriod: null,
        isProcessedTabSelected: false
    },
    refs: [{
            ref: 'timeBucketChart',
            selector: '#TimeBucketChart'
        },
        {
            ref: 'dashBoardGridPanel',
            selector: '#DashBoardGridPanel'
        },
        {
            ref: 'timeBucketProcessedChart',
            selector: '#TimeBucketProcessedChart'
        },
        {
            ref: 'dashBoardProcessedGridPanel',
            selector: '#DashBoardProcessedGridPanel'
        },
        {
            ref: 'processedPanel',
            selector: '#ProcessedPanel'
        },
        {
            ref: 'submitButton',
            selector: '#submitButton'
        },
        {
            ref: 'processedColumnChart',
            selector: '#ProcessedColumnChart'
        },
         {
            ref: 'errorColumnChart',
            selector: '#errorColumnChart'
        }

    ],


    views: [
        'IntegrationDashboardView'
    ],
    stores: [
        'IntegrationDashboardStore',
        'IntegrationDashboardPanelStore'
    ],

    init: function() {
        console.log("init of IntegrationDashBoardController");
        this.control({
            'tabpanel[id=TabPanel]': {
                tabchange: this.handleTabChange
            }
        });
        this.control({
            'button[id=submitButton]': {
                click: this._submitButtonClicked
            }
        });
        this.control({
            'grid[id=DashBoardProcessedGridPanel]': {
                dashBoardProcessedGridItemSelected: this.dashBoardProcessedSelected
            }
        });
        this.control({
            'combo[id=periodStoreCombo]':{
                periodValueChanged: this.periodValueChanged
            }
        });
        this.control({
            'grid[id=DashBoardGridPanel]': {
                dashBoardProcessedGridItemSelected: this.dashBoardProcessedSelected
            }
        });
        this.control({
            'chart': {
                boxready: function(chart) {
                    var series = chart.series.items;
                    Ext.Array.each(series, function(theSeries) {
                        this.relayEvents(theSeries, ['itemclick']);
                    }, chart);
                },
                itemclick: function(seriesItem) {
                    this.processedChartItemClicked(seriesItem);
                }
            }
        });
    },

    onLaunch: function() {
        console.log("Launch of IntegrationDashBoardController");
        this.showView();
    },

    showView: function() {
        var columnName = ['CreatedTimestamp', 'CreatedTimestamp'];
        var operator = ['LT', 'GT'];
        this.isProcessedTabSelected = false;
        // var value = ['2017-08-08T13:00:000Z', '2017-08-7T14:00:000Z'];
        //filter query expects time ending in Z
        var value = this.getTimeRange("24");
        //Convert to UTC before generating query as messages are stored in UTC in db
        value[0] = new Date(value[0]).toISOString();
        value[1] = new Date(value[1]).toISOString();
        //set default selected period to 24/Last Day
        this.selectedPeriod = "24";
        var dateFilterQuery = this._buildFilterQuery(columnName, operator, value);
        var statusFilterQuery = '[{"column":"CurrentStatus","operator":"EQ","value":"Processed"},{"column":"CurrentStatus","operator":"EQ","value":"Error"}]';

        var finalQuery = [];
        finalQuery.push({
            "OR": Ext.decode(statusFilterQuery)
        }, {
            "AND": Ext.decode(dateFilterQuery)
        });
        //TODO: Uncomment when data is available for past 24 hrs
        this.baseQuery = this.filterQuery = JSON.stringify(finalQuery);
        //this.baseQuery = this.filterQuery = '[{"OR":[{"column":"CurrentStatus","operator":"EQ","value":"Processed"},{"column":"CurrentStatus","operator":"EQ","value":"Error"}]}]';
        if (!this.getIntegrationDashboardStore()) {
            this.setIntegrationDashboardStore(Ext.create('JDA.dm.IntegrationDashboard.store.IntegrationDashboardStore'));
        }
        if (!this.getIntegrationDashboardPanelStore()) {
            this.setIntegrationDashboardPanelStore(Ext.create('JDA.dm.IntegrationDashboard.store.IntegrationDashboardPanelStore'));
        }
        this.getIntegrationDashBoardData();
    },

    getTimeZoneOffset:function() {
        //Returns offset in the form +05:30 or -04:00
        var offset = new Date().getTimezoneOffset();
        var absOffset = Math.abs(offset);
        return (offset < 0 ? "+" : "-") + ("00" + Math.floor(absOffset / 60)).slice(-2) + ":" + ("00" + (absOffset % 60)).slice(-2);
    },

    getIntegrationDashBoardData: function() {
        console.log("view message clicked");
        var me = this;
        var DisplayBy = Ext.getCmp('displayByCombo').getValue();
        if (DisplayBy == "1 Hour") {
            DisplayBy = "DisplayByHr";
        } else {
            DisplayBy = "DisplayByDay";
        }
        var offset = me.getTimeZoneOffset();

        var submitForm = new Ext.form.Panel({
            method: 'POST',
            url: RP.buildDataServiceUrl("connect", "cxf/frameworkservices/v1/messagestore/report"),
            baseParams: {
                // groupBy: 'CurrentStatus',OperationName,', + DisplayBy + ',ComponentName',
                groupBy: ["CurrentStatus", "OperationName", DisplayBy,'ComponentName'],
                offset: offset,
                // query: '[{"OR":[{"column":"CurrentStatus","operator":"EQ","value":"Processed"},{"column":"CurrentStatus","operator":"EQ","value":"Error"}]}]'
                query: this.filterQuery
            }
        });
        submitForm.submit({
            success: function(form, action) {
                console.log("Success");

            },
            failure: function(form, action) {
                console.log("failure");

                if (action.response.status === 500|| action.response.status === 404 || action.response.status === 400 || action.response.responseObject.data[0].attributes.messageGroups === undefined) {
                    Ext.MessageBox.alert(RP.getMessage('dm.MessageStore.messages.error'), RP.getMessage('dm.MessageStore.messages.noRecordsFound'));
                    me.setMaxErrorChartAxisValue();
                    me.getTimeBucketChart().store.removeAll();
                    me.getDashBoardGridPanel().store.removeAll();
                    me.getTimeBucketProcessedChart().store.removeAll();
                    me.getDashBoardProcessedGridPanel().store.removeAll();
                    var records = [];
                    me.getIntegrationDashboardStore().loadData(records);
                    me.getIntegrationDashboardPanelStore().loadData(records);
                    me.getDashBoardGridPanel().reconfigure(me.getIntegrationDashboardPanelStore(), this.columnConfigError);
                    me.getDashBoardProcessedGridPanel().reconfigure(me.getIntegrationDashboardPanelStore(), this.columnConfigError);
                    me.getTimeBucketChart().store = me.getIntegrationDashboardStore();
                    me.getDashBoardGridPanel().store = me.getIntegrationDashboardPanelStore();
                    me.getTimeBucketProcessedChart().store = me.getIntegrationDashboardStore();
                    me.getDashBoardProcessedGridPanel().store = me.getIntegrationDashboardPanelStore();
                    me.updateTabCount(0, 0);
                    me.messageProcessedRecords = [];
                    me.messageErrorRecords = [];
                    me.messageErrorPanelRecords = [];
                    me.messageProcessedPanelRecords = [];
                    if (me.getDashBoardGridPanel().isVisible()) {
                        Ext.getCmp('TimeBucketChart').redraw();
                    }
                    if (me.getDashBoardProcessedGridPanel().isVisible()) {
                        Ext.getCmp('TimeBucketProcessedChart').redraw();
                    }

                }else {
                    me.updateIntegrationDashBoardData(action.response.responseText);
                    me.updateIntegrationDashBoardPanelData(action.response.responseText);


                }
            }
        });
    },
    updateIntegrationDashBoardData: function(dashBoardResponse) {
        var me = this;
        console.log("updateIntegrationDashBoardData in IntegrationDashBoardController");
        var gridRecords = [];
        var fields = [];
        this.maxErrorCount = this.maxProcessedCount = 0;
        me.columnConfigError = [{
            text: 'Message Type',
            width: 170,
            sortable: false,
            dataIndex: 'MessageType'
        }];
        me.columnConfigProcessed = [{
            text: 'Message Type',
            width: 170,
            sortable: false,
            dataIndex: 'MessageType'
        }];
        var decodeResponse = Ext.decode(dashBoardResponse);
        var decodeResponseData = [];
        decodeResponseData = decodeResponse.data;
        decodeResponseData = decodeResponseData[0].attributes.messageGroups;
        var errorData = [];
        var processedData = [];
        if (decodeResponseData.length === 1) {
            if (decodeResponseData[0].groupName === "Error") {
                errorData = decodeResponseData[0];
            } else if (decodeResponseData[0].groupName === "Processed") {
                processedData = decodeResponseData[0];
            }
        } else {
            //Assuming we support only error and processed
            errorData = decodeResponseData[0];
            processedData = decodeResponseData[1];
        }

        var groupBy = "";
        var count = 0;
        var hour = "";
        var totalErrorCount = 0;
        var totalProcessedCount = 0;
        var html = "";
        var statusCount = errorData.messageGroups;
        ///if (errorData.groupName === "Error") {
        me.messageErrorRecords = [];
        groupBy = "";
        count = 0;
        hour = "";
        totalErrorCount = errorData.count;
        statusCount = errorData.messageGroups;
        fields.push({
            name: 'MessageType'
        });

        this.setErrorGridValues();

        Ext.each(statusCount, function(obj) {
            var hrData = obj.messageGroups;
            Ext.each(hrData, function(obj) {

                if (obj.groupBy === "DisplayByHr") {
                count = obj.count;
                hour = obj.groupName;
                var found = false;
                //Change to fix PHX-5938 , wrong bucketing issue
                var localDateTimeHour = hour;
                // var localDateTimeHour = me.convertUTCtoLocal(hour);
                Ext.each(me.messageErrorRecords, function(obj) {

                    if (obj.DisplayBy === me.getDateMonthHour(localDateTimeHour) /*hour.split('.')[2]*/ ) {
                        found = true;
                        obj.count = obj.count + count;
                        //obj.DisplayBy=obj.DisplayByHr;
                        if (me.maxErrorCount < obj.count) {
                            me.maxErrorCount = obj.count;
                        }
                    }
                });
                if (!found) {
                    Ext.each(me.messageErrorRecords, function(obj) {
                        if (obj.DisplayBy === me.getDateMonthHour(localDateTimeHour)) {
                            obj.count = obj.count + count;
                           // obj.DisplayBy=obj.DisplayByHr;
                            if (me.maxErrorCount < obj.count) {
                                me.maxErrorCount = obj.count;
                            }
                        }
                    });
                }
                var hrs = localDateTimeHour.split('.')[2];
                var timeUpdate = parseInt(hrs, 10);
                if (timeUpdate < 10) {
                    hrs = timeUpdate.toString();
                }
                localDateTimeHour = localDateTimeHour.substring(localDateTimeHour.indexOf('.')+1,localDateTimeHour.length);
                fields.push({
                    name: localDateTimeHour //hrs//hour.split('.')[2]
                });
                }else 
                if(obj.groupBy === "DisplayByDay"){   
                    count = obj.count;
                    hour = obj.groupName;
                     var dayFound = false;
                Ext.each(me.messageErrorRecords, function(obj) {
                    if (obj.DisplayBy === me.getDateMonth(hour)) {
                        dayFound = true;
                        obj.count = obj.count + count;
                       // obj.DisplayBy=obj.DisplayByDay;
                        if (me.maxErrorCount < obj.count) {
                            me.maxErrorCount = obj.count;
                        }
                    }
                     if (!dayFound) {
                     //Ext.each(me.messageErrorRecords, function(obj) {
                        if (obj.DisplayBy === me.getDateMonth(hour)) {
                            obj.count = obj.count + count;
                           // obj.DisplayBy=obj.DisplayByDay;
                            if (me.maxErrorCount < obj.count) {
                                me.maxErrorCount = obj.count;
                            }
                        }
                    //});
                }
                });
                hour = hour.substring(hour.indexOf('.')+1,hour.length);
                      fields.push({
                    name: hour //hrs//hour.split('.')[2]
                });

                }
            });
        });
        me.messageProcessedRecords = [];
        groupBy = "";
        count = 0;
        hour = "";
        totalProcessedCount = processedData.count;
        this.setProcessedGridValues();
        statusCount = processedData.messageGroups;
        fields.push({
            name: 'MessageType'
        });
        Ext.each(statusCount, function(obj) {
            var hrData = obj.messageGroups;
            Ext.each(hrData, function(obj) {

                if (obj.groupBy === "DisplayByHr") {
                    count = obj.count;
                    hour = obj.groupName;

                var found = false;
                //Change to fix PHX-5938 , wrong bucketing issue
                var localDateTimeHour = hour;
                // var localDateTimeHour = me.convertUTCtoLocal(hour);
                Ext.each(me.messageProcessedRecords, function(obj) {
                    if (obj.DisplayBy === me.getDateMonthHour(localDateTimeHour) /*hour.split('.')[2]*/ ) {
                        found = true;
                        obj.count = obj.count + count;
                        //obj.DisplayBy=obj.DisplayByHr;
                    }
                    if (me.maxProcessedCount < obj.count) {
                        me.maxProcessedCount = obj.count;
                    }
                });
                if (!found) {
                    Ext.each(me.messageProcessedRecords, function(obj) {
                        if (obj.DisplayBy === me.getDateMonthHour(localDateTimeHour)) {
                            obj.count = obj.count + count;
                            //obj.DisplayBy=obj.DisplayByHr;
                        }
                        if (me.maxProcessedCount < obj.count) {
                            me.maxProcessedCount = obj.count;
                        }
                    });
                }

                var hrs = hour.split('.')[2];
                var timeUpdate = parseInt(hrs, 10);
                if (timeUpdate < 10) {
                    hrs = timeUpdate.toString();
                }

                fields.push({
                    name: localDateTimeHour //hour.split('.')[2]//me.getDateMonthHour(hour)
                });
              }else if(obj.groupBy === "DisplayByDay"){
                count = obj.count;
                hour = obj.groupName;

                 var dayFound = false;
                //var localDateTimeHour = hour.split('.')[1];
                Ext.each(me.messageProcessedRecords, function(obj) {
                    if (obj.DisplayBy === me.getDateMonth(hour) /*hour.split('.')[2]*/ ) {
                        dayFound = true;
                        obj.count = obj.count + count;
                       // obj.DisplayBy=obj.DisplayByDay;
                    }
                    if (me.maxProcessedCount < obj.count) {
                        me.maxProcessedCount = obj.count;
                    }
                });
                if (!dayFound) {
                    //Ext.each(me.messageProcessedRecords, function(obj) {
                        if (obj.DisplayBy === me.getDateMonth(hour)) {
                            obj.count = obj.count + count;
                            //obj.DisplayBy=obj.DisplayByDay;
                        }
                        if (me.maxProcessedCount < obj.count) {
                            me.maxProcessedCount = obj.count;
                        }
                   // });
                }
                fields.push({
                    name: hour 
                });
              }
            });
        });

        // }
        me.updateTabCount(totalErrorCount, totalProcessedCount);
        me.getIntegrationDashboardPanelStore().model.setFields(fields);
       
         if (this.getDashBoardGridPanel().isVisible()) {
            this.getTimeBucketChart().store.removeAll();
            this.getIntegrationDashboardStore().loadData(me.messageErrorRecords);
            this.getTimeBucketChart().store = this.getIntegrationDashboardStore();
        }else{
            this.getTimeBucketChart().store.removeAll();
        }
        // this.getIntegrationDashboardStore().loadData(me.messageErrorRecords);
        // this.getTimeBucketChart().store = this.getIntegrationDashboardStore();
        // this.getTimeBucketChart().axes.items[0].maximum = 10;//this.maxErrorCount + 1;
        this.setMaxErrorChartAxisValue();
        Ext.getCmp('TimeBucketChart').redraw();
        if (this.getDashBoardProcessedGridPanel().isVisible()) {
            this.getTimeBucketProcessedChart().store.removeAll();
            // this.getTimeBucketProcessedChart().axes.items[0].maximum = 10;//this.maxProcessedCount + 1;
            this.setMaxProcessedChartAxisValue();
            Ext.getCmp('TimeBucketProcessedChart').redraw();
        }

    },

    updateTabCount: function(totalErrorCount, totalProcessedCount) {
        var errorPer = 0,
            processedPer = 0,
            html;
        //Handle explorer explicitly as only IE UI is distorted
        if (Ext.isIE) {
            if (totalErrorCount === 0 && totalProcessedCount === 0) {
                html = '<svg><text x="60%" y="15%" text-anchor="middle" font-family="Robato" font-size="14" >ERRORS ('+totalErrorCount+')</text></svg>';
                Ext.getCmp('TabPanel').items.items[0].setTitle(html);
                html = '<svg><text x="50%" y="15%" text-anchor="middle" font-family="Robato" font-size="14" >PROCESSED ('+totalProcessedCount+')</text></svg>';
                Ext.getCmp('TabPanel').items.items[1].setTitle(html);
            } else if (totalErrorCount === 0 || totalErrorCount === undefined) {
                errorPer = 0;
                totalErrorCount = 0;
                html = '<svg><text x="60%" y="15%" text-anchor="middle" font-family="Robato" font-size="14" >ERRORS ('+totalErrorCount+')</text></svg>';
                Ext.getCmp('TabPanel').items.items[0].setTitle(html);
                processedPer = 100;
                html = '<svg><text x="50%" y="15%" text-anchor="middle" font-family="Robato" font-size="14" >PROCESSED ('+totalProcessedCount+')</text></svg>';
                Ext.getCmp('TabPanel').items.items[1].setTitle(html);
            } else if (totalProcessedCount === 0 || totalProcessedCount === undefined) {
                processedPer = 0;
                totalProcessedCount = 0;
                errorPer = 100;
                html = '<svg> <text x="60%" y="15%" text-anchor="middle" font-family="Robato" font-size="14" >ERRORS ('+totalErrorCount+')</text></svg>';
                Ext.getCmp('TabPanel').items.items[0].setTitle(html);
                html = '<svg> <text x="50%" y="15%" text-anchor="middle" font-family="Robato" font-size="14" >PROCESSED ('+totalProcessedCount+')</text></svg>';
                Ext.getCmp('TabPanel').items.items[1].setTitle(html);
            } else {
                errorPer = Math.floor((totalErrorCount / (totalErrorCount + totalProcessedCount)) * 100);
                html = '<svg><text x="60%" y="15%" text-anchor="middle" font-family="Robato" font-size="14" >ERRORS ('+totalErrorCount+')</text></svg>';
                Ext.getCmp('TabPanel').items.items[0].setTitle(html);
                processedPer = Math.floor((totalProcessedCount / (totalErrorCount + totalProcessedCount)) * 100);
                html = '<svg><text x="50%" y="15%" text-anchor="middle" font-family="Robato" font-size="14" >PROCESSED ('+totalProcessedCount+')</text></svg>';
                Ext.getCmp('TabPanel').items.items[1].setTitle(html);
            }
        } else {
            if (totalErrorCount === 0 && totalProcessedCount === 0) {
                html = '<svg><text x="30%" y="18%" text-anchor="middle" font-family="Robato" font-size="14" >ERRORS ('+totalErrorCount+')</text></svg>';
                Ext.getCmp('TabPanel').items.items[0].setTitle(html);
                html = '<svg><text x="30%" y="18%" text-anchor="middle" font-family="Robato" font-size="14" >PROCESSED ('+totalProcessedCount+')</text></svg>';
                Ext.getCmp('TabPanel').items.items[1].setTitle(html);
            } else if (totalErrorCount === 0 || totalErrorCount === undefined) {
                errorPer = 0;
                totalErrorCount = 0;
                processedPer = 100;
                html = '<svg><text x="30%" y="18%" text-anchor="middle" font-family="Robato" font-size="14" >ERRORS ('+totalErrorCount+')</text></svg>';
                Ext.getCmp('TabPanel').items.items[0].setTitle(html);
                html = '<svg><text x="30%" y="18%" text-anchor="middle" font-family="Robato" font-size="14" >PROCESSED ('+totalProcessedCount+')</text></svg>';
                Ext.getCmp('TabPanel').items.items[1].setTitle(html);
            } else if (totalProcessedCount === 0 || totalProcessedCount === undefined) {
                processedPer = 0;
                totalProcessedCount = 0;
                errorPer = 100;
                html = '<svg><text x="30%" y="18%" text-anchor="middle" font-family="Robato" font-size="14" >ERRORS ('+totalErrorCount+')</text></svg>';
                Ext.getCmp('TabPanel').items.items[0].setTitle(html);
                html = '<svg><text x="30%" y="18%" text-anchor="middle" font-family="Roboto Medium, Roboto Regular, Roboto" font-size="30" >PROCESSED ('+totalProcessedCount+')</text></svg>';
                Ext.getCmp('TabPanel').items.items[1].setTitle(html);
            } else {
                errorPer = Math.floor((totalErrorCount / (totalErrorCount + totalProcessedCount)) * 100);
                html = '<svg><text x="30%" y="18%" text-anchor="middle" font-family="Robato" font-size="14" >ERRORS ('+totalErrorCount+')</text></svg>';
                Ext.getCmp('TabPanel').items.items[0].setTitle(html);
                processedPer = Math.floor((totalProcessedCount / (totalErrorCount + totalProcessedCount)) * 100);
                html = '<svg><text x="30%" y="18%" text-anchor="middle" font-family="Robato" font-size="14" >PROCESSED ('+totalProcessedCount+')</text></svg>';
                Ext.getCmp('TabPanel').items.items[1].setTitle(html);
            }
        }
    },

    updateIntegrationDashBoardPanelData: function(dashBoardResponse) {
        var me = this;
        console.log("updateIntegrationDashBoardPanelData in IntegrationDashBoardController");
        var gridRecords = [];
        var decodeResponse = Ext.decode(dashBoardResponse);
        var decodeResponseData = [];
        decodeResponseData = decodeResponse.data;
        decodeResponseData = decodeResponseData[0].attributes.messageGroups;
        var errorData = [];
        var processedData = [];

        if (decodeResponseData.length === 1) {
            if (decodeResponseData[0].groupName === "Error") {
                errorData = decodeResponseData[0];
            } else if (decodeResponseData[0].groupName === "Processed") {
                processedData = decodeResponseData[0];
            }
        } else {
            //Assuming we support only error and processed
            errorData = decodeResponseData[0];
            processedData = decodeResponseData[1];
        }

        var groupBy = "";
        var count = 0;
        var hour = "";
        var statusCount = errorData.messageGroups;

        me.messageErrorPanelRecords= [];
        groupBy = "";
        count = 0;
        hour = "";
        statusCount = errorData.messageGroups;
        Ext.each(statusCount, function(obj1) {
            if (obj1.groupBy === "OperationName") {
                var gridData = {};
                gridData.MessageType = obj1.groupName;
                Ext.each(obj1.messageGroups, function(obj2) {
                    if (obj2.groupBy === "DisplayByHr") {
                        //Change to fix PHX-5938 , wrong bucketing issue
                        // var hrs = obj2.groupName;
                        //TODO: Change after groupname returns YYYY.MM.DD
                        var hrs = obj2.groupName.substring(obj2.groupName.indexOf('.')+1,obj2.groupName.length);
                        // var hrs = me.convertUTCtoLocal(obj2.groupName);
                        gridData[hrs] = me.hyperlink(obj2.count,obj2.messageURL);
                    } else if(obj2.groupBy === "DisplayByDay"){
                        //TODO: Change after groupname returns YYYY.MM.DD
                        var day = obj2.groupName.substring(obj2.groupName.indexOf('.')+1,obj2.groupName.length);
                          // var day = obj2.groupName;
                          //hrs=hrs.split('.')[2];
                          gridData[day] = me.hyperlink(obj2.count,obj2.messageURL);  
                    }
                });
            me.messageErrorPanelRecords.push(gridData);
            }
        });
        me.messageProcessedPanelRecords=[];

        groupBy = "";
        count = 0;
        hour = "";
        statusCount = processedData.messageGroups;
        Ext.each(statusCount, function(obj1) {
            if (obj1.groupBy === "OperationName") {
                var gridData = {};
                gridData.MessageType = obj1.groupName;
                Ext.each(obj1.messageGroups, function(obj2) {
                    if (obj2.groupBy === "DisplayByHr") {
                        //Change to fix PHX-5938 , wrong bucketing issue
                        // var hrs = obj2.groupName;
                        var hrs = obj2.groupName.substring(obj2.groupName.indexOf('.')+1,obj2.groupName.length);
                        // var hrs = me.convertUTCtoLocal(obj2.groupName);
                        gridData[hrs] = me.hyperlink(obj2.count,obj2.messageURL);
                        } else if(obj2.groupBy === "DisplayByDay"){
                          // var day = obj2.groupName;
                          var day = obj2.groupName.substring(obj2.groupName.indexOf('.')+1,obj2.groupName.length);
                          gridData[day] = me.hyperlink(obj2.count,obj2.messageURL);  
                        }
                    });
                me.messageProcessedPanelRecords.push(gridData);
            }
        });

        this.getDashBoardGridPanel().store.removeAll();
        this.updateErrorGridPanelView(); 
        this.getIntegrationDashboardPanelStore().loadData(me.messageErrorPanelRecords);
        this.getDashBoardGridPanel().reconfigure(this.getIntegrationDashboardPanelStore(), this.columnConfigError);
        this.getDashBoardGridPanel().store = this.getIntegrationDashboardPanelStore();  
       
        if (this.getDashBoardProcessedGridPanel().isVisible()) {
            this.getTimeBucketProcessedChart().store.removeAll();
            // this.getTimeBucketProcessedChart().axes.items[0].maximum = 10;//this.maxProcessedCount + 1;
            this.setMaxProcessedChartAxisValue();
            this.isProcessedTabSelected = true;
            this.updateProcessedData();
        }

    },

    //Called to update error grid panel based on timeperiod
    updateErrorGridPanelView: function() {
        if (this.selectedPeriod == "72") {
                Ext.select('#DashBoardGridPanel').addCls('PanelCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').addCls('PanelCls');
                Ext.select('#DashBoardGridPanel-body').addCls('PanelCls');
                Ext.select('#DashBoardGridPanel').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardGridPanel').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardGridPanel').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardGridPanel').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('Panel720HrsCls');
        } else if (this.selectedPeriod == "12") {
                Ext.select('#DashBoardGridPanel').addCls('Panel12HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').addCls('Panel12HrsCls');
                Ext.select('#DashBoardGridPanel-body').addCls('Panel12HrsCls');
                Ext.select('#DashBoardGridPanel').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardGridPanel').removeCls('PanelCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('PanelCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('PanelCls');
                Ext.select('#DashBoardGridPanel').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardGridPanel').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('Panel2HrsCls');
            } else if (this.selectedPeriod == "4") {
                Ext.select('#DashBoardGridPanel').addCls('Panel4HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').addCls('Panel4HrsCls');
                Ext.select('#DashBoardGridPanel-body').addCls('Panel4HrsCls');
                Ext.select('#DashBoardGridPanel').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardGridPanel').removeCls('PanelCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('PanelCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('PanelCls');
                Ext.select('#DashBoardGridPanel').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardGridPanel').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('Panel2HrsCls');
            } else if (this.selectedPeriod == "48") {
                Ext.select('#DashBoardGridPanel').addCls('Panel2HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').addCls('Panel2HrsCls');
                Ext.select('#DashBoardGridPanel-body').addCls('Panel2HrsCls');
                Ext.select('#DashBoardGridPanel').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardGridPanel').removeCls('PanelCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('PanelCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('PanelCls');
                Ext.select('#DashBoardGridPanel').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardGridPanel').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('Panel720HrsCls');
            } else if (this.selectedPeriod == "720") {
                Ext.select('#DashBoardGridPanel').addCls('Panel720HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').addCls('Panel720HrsCls');
                Ext.select('#DashBoardGridPanel-body').addCls('Panel720HrsCls');
                Ext.select('#DashBoardGridPanel').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardGridPanel').removeCls('PanelCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('PanelCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('PanelCls');
                Ext.select('#DashBoardGridPanel').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardGridPanel').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('Panel2HrsCls');
            } else {
                Ext.select('#DashBoardGridPanel').removeCls('PanelCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('PanelCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('PanelCls');
                Ext.select('#DashBoardGridPanel').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardGridPanel').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardGridPanel').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardGridPanel').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardGridPanel .x-grid-header-ct').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardGridPanel-body').removeCls('Panel12HrsCls');
            }
        
    },

    //Called to update processed grid panel based on timeperiod
    updateProcessedGridPanelView: function() {
         if (this.selectedPeriod == "72") {
                Ext.select('#DashBoardProcessedGridPanel').addCls('PanelCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').addCls('PanelCls');
                Ext.select('#DashBoardProcessedGridPanel-body').addCls('PanelCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('Panel720HrsCls');
        }else if (this.selectedPeriod == "12") {
                Ext.select('#DashBoardProcessedGridPanel').addCls('Panel12HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').addCls('Panel12HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').addCls('Panel12HrsCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('PanelCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('PanelCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('PanelCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('Panel2HrsCls');
            } else if (this.selectedPeriod == "4") {
                Ext.select('#DashBoardProcessedGridPanel').addCls('Panel4HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').addCls('Panel4HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').addCls('Panel4HrsCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('PanelCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('PanelCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('PanelCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('Panel2HrsCls');
            } else if (this.selectedPeriod == "48") {
                Ext.select('#DashBoardProcessedGridPanel').addCls('Panel2HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').addCls('Panel2HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').addCls('Panel2HrsCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('PanelCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('PanelCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('PanelCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('Panel720HrsCls');
            } else if (this.selectedPeriod == "720") {
                Ext.select('#DashBoardProcessedGridPanel').addCls('Panel720HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').addCls('Panel720HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').addCls('Panel720HrsCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('PanelCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('PanelCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('PanelCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('Panel2HrsCls');
            } else {
                Ext.select('#DashBoardProcessedGridPanel').removeCls('PanelCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('PanelCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('PanelCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('Panel2HrsCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('Panel4HrsCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('Panel720HrsCls');
                Ext.select('#DashBoardProcessedGridPanel').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardProcessedGridPanel .x-grid-header-ct').removeCls('Panel12HrsCls');
                Ext.select('#DashBoardProcessedGridPanel-body').removeCls('Panel12HrsCls');
            }
    },

    //Called to update processed tab data
    updateProcessedData: function() {
        this.updateProcessedGridPanelView(); 
        this.getTimeBucketProcessedChart().store.removeAll();
        this.getIntegrationDashboardStore().loadData(this.messageProcessedRecords);
        this.getTimeBucketProcessedChart().store = this.getIntegrationDashboardStore();
        // this.getTimeBucketProcessedChart().axes.items[0].maximum = 10;//this.maxProcessedCount + 1;
        this.setMaxProcessedChartAxisValue();
        Ext.getCmp('TimeBucketProcessedChart').redraw();
        this.getDashBoardProcessedGridPanel().store.removeAll();
        this.getIntegrationDashboardPanelStore().loadData(this.messageProcessedPanelRecords);
        this.getDashBoardProcessedGridPanel().reconfigure(this.getIntegrationDashboardPanelStore(), this.columnConfigProcessed);
        this.getDashBoardProcessedGridPanel().store = this.getIntegrationDashboardPanelStore();
        this.getDashBoardGridPanel().hide();        
        this.getDashBoardProcessedGridPanel().show();
        if (this.selectedProcessedColumn) {
            this.processedChartItemClicked(this.selectedProcessedColumn);
        }
    },

    //Called to updated error tab data
    updateErrorData: function() {
        this.updateErrorGridPanelView(); 
        this.getTimeBucketChart().store.removeAll();
        this.getIntegrationDashboardStore().loadData(this.messageErrorRecords);
        this.getTimeBucketChart().store = this.getIntegrationDashboardStore();
        // this.getTimeBucketChart().axes.items[0].maximum = 10;//this.maxErrorCount + 1;
        //this.getTimeBucketChart().axes.items[1].fields.push("DisplayByDay");
        //this.getTimeBucketChart().series.items[0].xField="DisplayByDay";
        this.setMaxErrorChartAxisValue();
        Ext.getCmp('TimeBucketChart').redraw();
        this.getDashBoardGridPanel().store.removeAll();
        this.getIntegrationDashboardPanelStore().loadData(this.messageErrorPanelRecords);
        this.getDashBoardGridPanel().reconfigure(this.getIntegrationDashboardPanelStore(), this.columnConfigError);
        this.getDashBoardGridPanel().store = this.getIntegrationDashboardPanelStore();
        this.getDashBoardGridPanel().show();
        this.getDashBoardProcessedGridPanel().hide();
        if (this.selectedErrorColumn) {
            this.processedChartItemClicked(this.selectedErrorColumn);
        }        

    },

    setMaxProcessedChartAxisValue:function(){
        if(this.maxProcessedCount < 10){
            this.getTimeBucketProcessedChart().axes.items[0].maximum = 10;    
        }else{
            this.getTimeBucketProcessedChart().axes.items[0].maximum = this.maxProcessedCount + 1;
        }
    },

    setMaxErrorChartAxisValue:function(){
        if(this.maxErrorCount < 10){
            this.getTimeBucketChart().axes.items[0].maximum = 10;
        }else{
            this.getTimeBucketChart().axes.items[0].maximum = this.maxErrorCount + 1;
        }
    },

    handleTabChange: function(tabPanel, newCard, oldCard, eOpts) {
        if (newCard.id === "ProcessedPanel") {
            this.updateProcessedData();
            this.isProcessedTabSelected = true;
        } else {
            this.updateErrorData();
            this.isProcessedTabSelected = false;
        }
    },

    //To handle displayby change when period is changed
    periodValueChanged: function(field, newValue, oldValue) {
        console.log("Period Value changed",newValue);
        var store;
        var displayByComboBox = Ext.getCmp('displayByCombo');
        if(newValue === "Last Week" || newValue === "Last Month"){
            store =  Ext.data.StoreManager.lookup('displayByDayStore');
            displayByComboBox.store = store;
            displayByComboBox.bindStore(store);
            // displayByComboBox.clearValue();
            displayByComboBox.reset();
            displayByComboBox.setValue("1 Day");
        }else{
            store =  Ext.data.StoreManager.lookup('displayByStore');
            displayByComboBox.store = store;
            displayByComboBox.bindStore(store);
            displayByComboBox.clearValue();
            displayByComboBox.reset();
            displayByComboBox.setValue("1 Hour");
        }
    },

    //@Params : timeEntry in UTC MM.DD.HH format (6.7.14)
    //@Returns : Time Entry in Local setting (6.7.19)
    convertUTCtoLocal: function(utcTime) {
        var utcDateString = utcTime.split('.')[0] + "/";
        utcDateString += utcTime.split('.')[1] + "/";
        var temp = new Date();
        utcDateString += temp.getFullYear() + " ";
        var hour;
        if (utcTime.split('.')[2] > 12) {
            utcDateString += (utcTime.split('.')[2] - 12) + ":00:00 PM UTC";
        } else if (utcTime.split('.')[2] === "12") {
            utcDateString += utcTime.split('.')[2] + ":00:00 PM UTC";
        } else {
            var timeUpdate = utcTime.split('.')[2];
            timeUpdate = parseInt(timeUpdate, 10);
            timeUpdate = (timeUpdate < 10) ? timeUpdate.toString() : utcTime.split('.')[2];
            utcDateString += timeUpdate + ":00:00 AM UTC";
        }

        var localDate = new Date(utcDateString);
        var localDateTime = localDate.getMonth() + 1;
        localDateTime += "." + localDate.getDate() + "." + (localDate.getHours());
        return localDateTime;
    },

    //@Params : timeEntry in MM.DD.HH format (6.7.14)
    //@Returns : Mon Date HH format (7 Jun 2PM)
    getDateMonthHour: function(timeEntry) {
        if(timeEntry.split(".").length === 4){
            timeEntry = timeEntry.substring(timeEntry.indexOf('.')+1,timeEntry.length);
        }
        
        var monthDateHr;
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        monthDateHr = timeEntry.split('.')[1];
        //convert date 05 to 5
        monthDateHr = parseInt(monthDateHr, 10);
        monthDateHr = monthDateHr.toString();
        monthDateHr += " ";
        monthDateHr += months[timeEntry.split('.')[0] - 1];
        monthDateHr += "\n";
        if (timeEntry.split('.')[2] > 12) {
            monthDateHr += (timeEntry.split('.')[2] - 12) + " " + "PM";
        } else if (timeEntry.split('.')[2] === "12") {
            monthDateHr += timeEntry.split('.')[2] + " " + "PM";
        } else {
            //convert 01, 02..09 to 1,2,..9
            var timeUpdate = timeEntry.split('.')[2];
            timeUpdate = parseInt(timeUpdate, 10);
            timeUpdate = (timeUpdate < 10) ? timeUpdate.toString() : timeEntry.split('.')[2];
            monthDateHr += timeUpdate + " " + "AM";
        }
        return monthDateHr;
    },

    getDateMonth: function(timeEntry) {
        if(timeEntry.split(".").length === 3){
            timeEntry = timeEntry.substring(timeEntry.indexOf('.')+1,timeEntry.length);    
        }
        var monthDateHr;
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        monthDateHr = timeEntry.split('.')[1];
        //convert date 05 to 5
        monthDateHr = parseInt(monthDateHr, 10);
        monthDateHr = monthDateHr.toString();
        monthDateHr += " ";
        monthDateHr += months[timeEntry.split('.')[0] - 1];
        monthDateHr += "\n";
        return monthDateHr;
    },

    //Sets error grid values to 0 
    setErrorGridValues: function() {
        var me = this;
        var displayText;
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var timeRange = this.getTimeRange(this.selectedPeriod);
        //TODO: Uncomment when data for 24 hrs is available
        var endTime = timeRange[0];
        var startTime = timeRange[1];
        // var endTime = "2017-06-22T14:33:27";
        // var startTime = "2017-06-21T14:33:27";
        var startDateTime = new Date(startTime);
        var endDateTime = new Date(endTime);
        while (endDateTime >= startDateTime) {
            
            console.log("displayText:" + displayText);
            if(this.selectedPeriod === "168"||this.selectedPeriod === "720"){
             displayText = ((endDateTime.getMonth() + 1)<10?("0"+(endDateTime.getMonth() + 1)):(endDateTime.getMonth() + 1)) + "." + (endDateTime.getDate()<10?("0"+endDateTime.getDate()):endDateTime.getDate());
             displayTextValue = this.getDateMonth(displayText);
            }else{
              // displayText = (endDateTime.getMonth() + 1) + "." + endDateTime.getDate()+ "." + endDateTime.getHours();
              displayText = ((endDateTime.getMonth() + 1)<10?("0"+(endDateTime.getMonth() + 1)):(endDateTime.getMonth() + 1)) + "." + (endDateTime.getDate()<10?("0"+endDateTime.getDate()):endDateTime.getDate()) + "." + (endDateTime.getHours()<10?("0"+endDateTime.getHours()):endDateTime.getHours());
              displayTextValue = this.getDateMonthHour(displayText);
            }
            // var hrs = displayText.split('.')[2];
            // var timeUpdate = parseInt(hrs, 10);
            // if (timeUpdate < 10) {
            //     hrs = timeUpdate.toString();
            // }

            me.columnConfigError.push({
                text: displayTextValue,
                width: 80,
                sortable: false,
                dataIndex: displayText //hrs
                // dataIndex: displayTextValue
            });
            if(this.selectedPeriod === "168"||this.selectedPeriod === "720"){       
               me.messageErrorRecords.push({
                DisplayBy: displayTextValue,
                count: 0
               });
                endDateTime.setDate(endDateTime.getDate() - 1);
            }else{
                me.messageErrorRecords.push({
                DisplayBy: displayTextValue,
                count: 0
               });
                endDateTime.setHours(endDateTime.getHours() - 1);
          }
        }
    },

    ////Sets processed grid values to 0 
    setProcessedGridValues: function() {
        var me = this;
        var displayText;
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var timeRange = this.getTimeRange(this.selectedPeriod);
        //TODO: Uncomment when data for 24 hrs is available
        var endTime = timeRange[0];
        var startTime = timeRange[1];
        // var endTime = "2017-06-22T14:33:27";
        // var startTime = "2017-06-21T14:33:27";
        var startDateTime = new Date(startTime);
        var endDateTime = new Date(endTime);
        while (endDateTime >= startDateTime) {
            
            console.log("displayText:" + displayText);
            if(this.selectedPeriod === "168"||this.selectedPeriod === "720"){
                displayText = ((endDateTime.getMonth() + 1)<10?("0"+(endDateTime.getMonth() + 1)):(endDateTime.getMonth() + 1)) + "." + (endDateTime.getDate()<10?("0"+endDateTime.getDate()):endDateTime.getDate());
                 displayTextValue = this.getDateMonth(displayText);
            }else{
                // displayText = (endDateTime.getMonth() + 1) + "." + endDateTime.getDate() + "." + endDateTime.getHours();
                displayText = ((endDateTime.getMonth() + 1)<10?("0"+(endDateTime.getMonth() + 1)):(endDateTime.getMonth() + 1)) + "." + (endDateTime.getDate()<10?("0"+endDateTime.getDate()):endDateTime.getDate()) + "." + (endDateTime.getHours()<10?("0"+endDateTime.getHours()):endDateTime.getHours());
                displayTextValue = this.getDateMonthHour(displayText);
            }
            me.columnConfigProcessed.push({
                text: displayTextValue,
                width: 80,
                sortable: false,
                dataIndex: displayText //.split('.')[2]
            });
            if(this.selectedPeriod === "168"||this.selectedPeriod === "720"){
               me.messageProcessedRecords.push({
                DisplayBy: displayTextValue,
                count: 0
               });               
                endDateTime.setDate(endDateTime.getDate() - 1);
            }else{
             me.messageProcessedRecords.push({
                DisplayBy: displayTextValue, //me.getDateMonthHour(hour),//hour.split('.')[2],
                count: 0
            });

              endDateTime.setHours(endDateTime.getHours() - 1);
        }
           
        }
    },

    //Create hyperlink for grid values
    hyperlink: function(data, url) {
        if (data) {
            return ('<a href= "' + url + '" >' + data + '</a>');
        } else {
            return "-";
        }
    },

    _submitButtonClicked: function() {
        console.log("_submitButtonClicked  IntegrationDashboardController");
        var me = this;
        me.messageTypes = [];
        me.targetSystems = [];
        var filterObjects = [],
            filterQueryWithOr = [],
            filterQueryWithOrObjects;
        var columnName = [];
        var operator = [];
        var value = [];
        me.includeAndInQuery = false;

        var targetSystemFilter = Ext.getCmp('targetSystemCombo').getValue();
        if (targetSystemFilter.indexOf("All target systems") === -1) {
            count = targetSystemFilter.length;
            filterObjects = [];
            i = 0;
            if (count > 1) {
                for (; i < count; i++) {
                    filterObjects.push({
                        column: 'ComponentName',
                        operator: 'EQ',
                        value: targetSystemFilter[i]
                    });
                    this.targetSystems.push(targetSystemFilter[i]);
                }
                filterQueryWithOr.push({
                    OR: filterObjects
                });
                filterQueryWithOrObjects = JSON.stringify(filterQueryWithOr);
            } else {
                me._updateQueryArray(columnName, 'ComponentName');
                me._updateQueryArray(operator, 'EQ');
                me._updateQueryArray(value, targetSystemFilter[i]);
                me.targetSystems.push(targetSystemFilter[i]);
            }
            me.includeAndInQuery = true;
        }

        var messageTypeFilter = Ext.getCmp('messageTypeCombo').getValue();
        if (messageTypeFilter.indexOf("All message types") === -1) {
            count = messageTypeFilter.length;
            filterObjects = [];
            i = 0;
            var updatedMessageType;
            if (count > 1) {
                for (; i < count; i++) {
                    updatedMessageType = this.updateMessageType(messageTypeFilter[i]);
                    filterObjects.push({
                        column: 'OperationName',
                        operator: 'EQ',
                        value: updatedMessageType
                    });
                    this.messageTypes.push(updatedMessageType);
                }
                filterQueryWithOr.push({
                    OR: filterObjects
                });
                filterQueryWithOrObjects = JSON.stringify(filterQueryWithOr);
            } else {
                updatedMessageType = this.updateMessageType(messageTypeFilter[i]);
                me._updateQueryArray(columnName, 'OperationName');
                me._updateQueryArray(operator, 'EQ');
                me._updateQueryArray(value, updatedMessageType);
                me.messageTypes.push(updatedMessageType);
            }
            me.includeAndInQuery = true;
        }

        //For Time filter
        var periodStoreFilter = Ext.getCmp('periodStoreCombo').getValue();
        var timeRange = this.getTimeRange(periodStoreFilter);
        this.selectedPeriod = this._updateSelectedPeriod(periodStoreFilter);
        //TODO: Uncomment when data for 24 hrs is available
        // var endTime = timeRange[0];
        // var startTime = timeRange[1];
        //Convert to UTC before generating query as messages are stored in UTC in db
        var endTime = new Date(timeRange[0]).toISOString();
        var startTime = new Date(timeRange[1]).toISOString();
        var timeFilterColumnName = ['CreatedTimestamp', 'CreatedTimestamp'];
        var timeFilterOperator = ['LT', 'GT'];
        // // var value = ['2017-08-08T13:00:000Z', '2017-08-7T14:00:000Z'];
        // // endTime      "2017-07-14T11:14:50"
        // endTime += ".101Z";
        // startTime += ".101Z";
        var timeFilterValue = [endTime, startTime];
        for (var loopCnt = 0; loopCnt < 2; loopCnt++) {
            me._updateQueryArray(columnName, timeFilterColumnName[loopCnt]);
            me._updateQueryArray(operator, timeFilterOperator[loopCnt]);
            me._updateQueryArray(value, timeFilterValue[loopCnt]);
        }
        me.includeAndInQuery = true;



        filterObjects = [];
        filterObjects.push({
            column: 'CurrentStatus',
            operator: 'EQ',
            value: 'Processed'
        });
        filterObjects.push({
            column: 'CurrentStatus',
            operator: 'EQ',
            value: 'Error'
        });
        filterQueryWithOr.push({
            OR: filterObjects
        });
        //Check for only default filter
        if (me.includeAndInQuery) {
            me.filterQuery = me._buildFilterQuery(columnName, operator, value, filterQueryWithOr);
        } else {
            me.filterQuery = me.baseQuery;
        }
        me.messageProcessedRecords = [];
        me.messageErrorRecords = [];
        me.getIntegrationDashBoardData();
    },

    _updateSelectedPeriod: function(selectedPeriod) {
        var supportedPeriods = {
            "Last 4 Hours": "4",
            "Last 12 Hours": "12",
            "Last Day": "24",
            "Last 2 Days": "48",
            "Last 3 Days": "72",
            "Last Week": "168",
            "Last Month": "720"
        };
        return supportedPeriods[selectedPeriod];
    },
    _buildFilterQuery: function (columnName, operator, value, filterQueryWithOrObjects) {
    var filterQuery,
      filterObjects = [],
      i = 0;
    for (; i < columnName.length; i++) {
      filterObjects.push({
        column: columnName[i],
        operator: operator[i],
        value: value[i]
      });
    }
    if (filterQueryWithOrObjects) {
      i = 0;
      for (; i < filterQueryWithOrObjects.length; i++) {
        filterObjects.push(filterQueryWithOrObjects[i]);
      }
    }
    console.log(filterObjects);
    var filterQueryWithAnd = [];
    if (this.includeAndInQuery) {
      filterQueryWithAnd.push({
        AND: filterObjects
      });
      filterQuery = JSON.stringify(filterQueryWithAnd);
    } else {
      filterQuery = JSON.stringify(filterObjects);
    }
    return filterQuery;
  },

  updateMessageType: function (messageType) {
    var supportedMessageTypes = {
      "Transfer Order": "TransferOrder",
      "Transport Load": "transportLoadMessage",
      "Transport Instruction": "transportInstructionMessage",
      "Despatch Advice": "despatchAdviceMessage",
      "Labor Capacity Message":"laborCapacityMessage"
    };
    return supportedMessageTypes[messageType];
  },

  getTimeRange: function (selectedTimePeriod) {
    var timeRange = [];
    var toDate = new Date();
    toDate = this.updateFormat(toDate);
    var fromDate = new Date();

    if (selectedTimePeriod ==="12"|| selectedTimePeriod.indexOf("Last 12 Hours") != -1) { //Last 72 hrs
      fromDate.setTime(fromDate.getTime() - 1000 * 60 * 60 * 12 * 1);
    }else if (selectedTimePeriod ==="48" || selectedTimePeriod.indexOf("Last 2 Days") != -1) { //Last 48 hrs
      fromDate.setTime(fromDate.getTime() - 1000 * 60 * 60 * 48 * 1);
    } else if (selectedTimePeriod==="4"|| selectedTimePeriod.indexOf("Last 4 Hours") != -1) { //Last 4 hrs
      fromDate.setTime(fromDate.getTime() - 1000 * 60 * 60 * 4 * 1);
    }else if (selectedTimePeriod ==="72"|| selectedTimePeriod.indexOf("Last 3 Days") != -1) { //Last 72 hrs
      fromDate.setTime(fromDate.getTime() - 1000 * 60 * 60 * 72 * 1);
    } else if (selectedTimePeriod ==="168" || selectedTimePeriod.indexOf("Last Week") != -1) { //Last 168 hrs
      fromDate.setTime(fromDate.getTime() - 1000 * 60 * 60 * 168 * 1);
    }else if (selectedTimePeriod ==="720" || selectedTimePeriod.indexOf("Last Month") != -1) { //Last 720 hrs
      fromDate.setTime(fromDate.getTime() - 1000 * 60 * 60 * 720 * 1);
    }else { //Last 24 hrs
      fromDate.setTime(fromDate.getTime() - 1000 * 60 * 60 * 24 * 1);
    }
    fromDate = this.updateFormat(fromDate);
    timeRange.push(toDate);
    timeRange.push(fromDate);
    return timeRange;
  },

  updateFormat: function (dateTime) {
    var updatedDateTime;
    updatedDateTime = dateTime.getFullYear() + '-' + this.addZ(dateTime.getMonth() + 1) + '-' + this.addZ(dateTime.getDate());
    updatedDateTime += 'T' + this.addZ(dateTime.getHours()) + ':' + this.addZ(dateTime.getMinutes()) + ':' + this.addZ(dateTime.getSeconds());
    return updatedDateTime;
  },

  addZ: function (n) {
    return n < 10 ? '0' + n : '' + n;
  },

  dashBoardProcessedSelected:function(record, item, index, e, eOpts){
    var me = this;
    eOpts.stopEvent();
    var pageMap = {
        MESSAGESTORE: { page: 'JDA.dm.MessageStore.MessageStoreSummaryPage' }
    };
    if(eOpts.target.href !== undefined) {
        var url = eOpts.target.href;
        url = url.substring(url.indexOf('query'),url.length);
        var updatedFilterQuery = Ext.urlDecode(url);
        var config = [];
        config.push({
            filterQuery: updatedFilterQuery,
            controllerReference: me
        });
        JDA.dm.Utils.DataService.setMessageStoreFilterQuery(updatedFilterQuery);
        JDA.dm.Utils.DataService.setMessageStoreControllerReference(me);
              // jda.navigation.Navigator.navigate({
              //   page: pageMap["MESSAGESTORE"].page,
              //   pageCtx: config
              //   });
        RP.mvc.QuickAppManager.load('JDA.dm.MessageStore.MessageStoreSummaryPage', {
            config: config,
            onClose: Ext.Function.bind(this.resetIntegrationDashBoard, this),
            destroyOnClose: true
        });
    }
  },

    close: function() {
        this.resetIntegrationDashBoard();
        // this.application.taskForm.close();
    },

    //Function to highligh grid column on click of chart column
    processedChartItemClicked: function(item) {
        console.log("processedChartItemClicked" + item);
        var grid = this.getDashBoardGridPanel().isVisible() ? this.getDashBoardGridPanel() : this.getDashBoardProcessedGridPanel();
        if (this.getDashBoardGridPanel().isVisible()) {
            this.selectedErrorColumn = item;
        } else {
            this.selectedProcessedColumn = item;
        }
        var gridColumnlength = grid.columnConfig.length;
        for (var i = 0; i < gridColumnlength; i++) {
            if (grid.columnManager.headerCt.gridDataColumns[i].tdCls === "custom-column") {
                grid.columnManager.headerCt.gridDataColumns[i].tdCls = "";
            }
            if (grid.columnManager.headerCt.gridDataColumns[i].text === item.value[0]) {
                grid.columnManager.headerCt.gridDataColumns[i].tdCls = "custom-column";
            }
        }
        grid.getView().refresh();
    },

    resetIntegrationDashBoard: function(config) {
        // this.showView();
        console.log("Close Dashboard view");
        this.showView();
    },

    _updateQueryArray: function(array, value) {
        array.push(value);
    }
});