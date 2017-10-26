Ext.define('JDA.dm.DashBoard.controller.DashBoardSummaryController', {
  extend: 'Ext.app.Controller',
  config: {
    rowExpanderStore: null,
    includeAndInQuery: false,
    filterQuery: null,
    dashboardSummaryStore: null,
    statusFields: [],
    targetSystems: [],
    messageTypes: [],
    rowExpandFilterQuery: null,
    selectedDirection: 'All directions',
    columnConfig: [{
      text: 'Target System',
      flex: 5,
      sortable: false,
      dataIndex: 'TargetSystem'
    }, {
      text: 'Received',
      flex: 1,
      sortable: true,
      dataIndex: 'Received'
    }, {
      text: 'Processed',
      flex: 1,
      dataIndex: 'Processed'
    }, {
      text: 'Error',
      flex: 1,
      sortable: false,
      dataIndex: 'Error'
    }, {
      text: 'Total',
      flex: 1,
      sortable: false,
      dataIndex: 'Total'
    }]
  },
  refs: [{
      ref: 'rowPanelInboundGrid',
      selector: '#RowPanelInboundGrid'
    },
    {
      ref: 'rowPanelOutboundGrid',
      selector: '#RowPanelOutboundGrid'
    },
    {
      ref: 'settingsButton',
      selector: '#settingsButton'
    },
    {
      ref: 'submitButton',
      selector: '#submitButton'
    },
    {
      ref: 'dashBoardStoreGrid',
      selector: '#DashBoardStoreGrid'
    }

  ],

  views: [
    'DashBoardSummary'
  ],
  stores: [
    'DashBoardSummaryStore'
  ],

  init: function () {
    console.log("init of DashBoardSummaryController");
    this.control({
      'button[id=submitButton]': {
        click: this._submitButtonClicked
      }
    });
    this.control({
      'dashBoardSummary gridview': {
        expandbody: this.onExpandBody
      }
    });
    this.control({
      'tabpanel': {
        click: function () {
          console.log("Hell0");
        }
      }
    });
    this.control({
      'grid[id=DashBoardStoreGrid]': {
        bashBoardItemSelected: this.rowSelected
      }
    });
    this.control({
      'treepanel[id=RowPanelInboundGrid]': {
        'treePanelRowClicked': this.treePanelClicked
      }
    });
  },

  treePanelClicked: function (record, item, index, e, eOpts) {
    //Code for url generation for row expander drill down
    this.application.taskForm.close();
    eOpts.stopEvent();
    if(eOpts.getTarget().id === "subPanelClicked"){
    var filterObj = Ext.decode(this.rowExpandFilterQuery)[0].AND;
    
    filterObj.push({
      column: "OperationName",
      operator: "EQ",
      value: item.data.OperationName
    });
    filterObj.push({
      column: "ErrorMessage",
      operator: "EQ",
      value: item.data.Error
    });
    var filterQueryWithAnd = [];
    filterQueryWithAnd.push({
      AND: filterObj
    });
    var rowExpandDrillDownQuery = JSON.stringify(filterQueryWithAnd);
    var config = [];
    config.push({
      filterQuery: rowExpandDrillDownQuery,
      messageStore: null,
      selectedMessageId: null,
      isMessageSelected: false,
      pageOffset: 0,
      pageLimit: 25,
      count: 0,
      filterString: null,
      retainQueryParam: false
    });
     if(Ext.getCmp('messageStoreSummary')){
         Ext.getCmp('messageStoreSummary').destroy();
     }
     
    RP.mvc.QuickAppManager.load('JDA.dm.MessageStore.MessageStoreSummaryPage', {
      config: config,
      onClose: Ext.Function.bind(this.resetDashBoardSummary, this),
      destroyOnClose: true
    });
    }
    
  },

  rowSelected: function (record, item, index, e, eOpts) {
    me = this;
    Ext.getCmp('tabpanel').show();
    var errorCount = item.data.Error.substring(item.data.Error.indexOf(">")+1,item.data.Error.lastIndexOf("<"));
    if(item.data.Error <= 1){
      Ext.getCmp('tabpanel').setTitle(item.data.TargetSystem + "( " +errorCount +" Error Message)" );
    }else{
      Ext.getCmp('tabpanel').setTitle(item.data.TargetSystem + "( " +errorCount +" Error Messages)" );
    }
    
    if ((eOpts.getTarget().id === "Received") || (eOpts.getTarget().id === "Processed") || (eOpts.getTarget().id === "Error")) {
      this.application.taskForm.close();
      eOpts.stopEvent();
      var url = item.data.SelfUrl[(eOpts.getTarget().id)];
      me.filterQuery = Ext.urlDecode(url);
      var config = [];
      config.push({
        filterQuery: me.filterQuery,
        messageStore: null,
        selectedMessageId: null,
        isMessageSelected: false,
        pageOffset: 0,
        pageLimit: 25,
        count: 0,
        filterString: null,
        retainQueryParam: false
      });  
   
    if(Ext.getCmp('messageStoreSummary')){
         Ext.getCmp('messageStoreSummary').destroy();
     }
     
      RP.mvc.QuickAppManager.load('JDA.dm.MessageStore.MessageStoreSummaryPage', {
        config: config,
        onClose: Ext.Function.bind(this.resetDashBoardSummary, this),
        destroyOnClose: true
      });

    }

    var selectedDirection = me.selectedDirection;
    if (selectedDirection === 'RECEIVED') {
      Ext.getCmp('OutboundPanel').tab.hide();
    }
    if (selectedDirection === 'SENT') {
      Ext.getCmp('InboundPanel').tab.hide();
    }
    //Generate query for row expander
    //Add Time Period
    var columnName = ['CreatedTimestamp', 'CreatedTimestamp'];
    var operator = ['LT', 'GT'];
    var value = ['2017-08-21T16:52:28', '2017-02-10T16:52:28'];
    //TODO: Uncomment when data is available for past 24/48/72 hrs
    // var value = this.getTimeRange(Ext.getCmp('periodStoreCombo').getValue());

    //Add Component
    me._updateQueryArray(columnName, 'ComponentName');
    me._updateQueryArray(operator, 'EQ');
    me._updateQueryArray(value, item.data.TargetSystem);

    //Add Direction
    me._updateQueryArray(columnName, 'Direction');
    me._updateQueryArray(operator, 'EQ');
    //TODO: Update when inbound/outbound data is available
    me._updateQueryArray(value, 'RECEIVED');

    //Add Status
    me._updateQueryArray(columnName, 'CurrentStatus');
    me._updateQueryArray(operator, 'EQ');
    me._updateQueryArray(value, 'Error');

    //Add OperationName/MessageType
    var filterObjects = [],
        filterQueryWithOr = [],
        filterQueryWithOrObjects;
    if(me.messageTypes.length > 0){
      if(me.messageTypes.length === 1){
        me._updateQueryArray(columnName, 'OperationName');
        me._updateQueryArray(operator, 'EQ');
        me._updateQueryArray(value, me.messageTypes[0]);
      }else{
        for(var cnt = 0; cnt<me.messageTypes.length ; cnt++){
          // filterObjects.push(columnName, 'OperationName');
          // filterObjects.push(operator, 'EQ');
          // filterObjects.push(value, me.messageTypes[cnt]);
          filterObjects.push({
            column: 'OperationName',
            operator: 'EQ',
            value: me.messageTypes[cnt]
          });
        }
        filterQueryWithOr.push({
          OR: filterObjects
        });
        // me._updateQueryArray.push(filterQueryWithOr);
        // filterQueryWithOrObjects = JSON.stringify(filterQueryWithOr);
      }
      
    }
    

    var includeAndInQuery = this.includeAndInQuery;
    this.includeAndInQuery = true;

    var rowExpandFilterQuery = this._buildFilterQuery(columnName, operator, value,filterQueryWithOr);

    //restore this.includeAndInQuery to original state
    this.includeAndInQuery = includeAndInQuery;

    console.log("rowExpandFilterQuery:", rowExpandFilterQuery);
    this.rowExpandFilterQuery = rowExpandFilterQuery;
    this.updateRowExpander(rowExpandFilterQuery);
    if(Ext.getCmp('backButton')){
    Ext.getCmp('backButton').enable();
  }
  },
  hyperlink: function (data, status) {
    if (data) {
      return ('<a href= "#" id = "' + status + '">' + data + '</a>');
    } else {
      return data;
    }
  },
  subHyperlink: function (data) {
    if (data) {
      return ('<a href= "#" id = "subPanelClicked">' + data + '</a>');
    } else {
      return data;
    }
  },
  onExpandBody: function (rowNode, record, expandRow, e) {
    me = this;
    var row = 'system-row-' + record.get('TargetSystem');
    var elem = document.getElementById(row);
    elem.innerHTML = '';
    //TODO: Fire request for row
    var innerPanel = Ext.create(Ext.panel.Panel, {
      //   title: 'title',
      height: '500px',
      width: '100%',
      items: [{
        xtype: 'collapsepanel'
      }]
    });

  },

  updateRowExpander: function (rowExpandFilterQuery) {
    if (!this.getRowExpanderStore()) {
      this.setRowExpanderStore(Ext.create('JDA.dm.DashBoard.store.RowExpanderStore'));
      // this.getRowExpanderStore().on('load', me.refreshGridView, me);
    }
    var childrenNodes = [];
    var operationName = [];
    var targetSystemWithError = [];
    var mainChildNodes = [];


    var me = this;
    RP.Ajax.request({
      url: RP.buildDataServiceUrl("connect", "cxf/frameworkservices/v1/messagestore/messages/"),
      // me.getMessageStore().getProxy().setExtraParam('query', me.filterString);
      params: {
        query: rowExpandFilterQuery
      },
      method: 'GET',
      callback: function (options, success, response) {
        console.log("Success" + success);
        var records = [];
        if (success) {
          console.log("response updateRowExpander" + response.responseText);
          var res = Ext.decode(response.responseText, true);

          var messageRecords = [];
          var currentTargetSystem,
              targetSystem;
          // var decodeResponse = Ext.decode(res);
          var decodeResponseData = [];
          decodeResponseData = res.data;
          // decodeResponseData = decodeResponseData[0].attributes.messageGroups;
          Ext.Array.each(decodeResponseData, function (obj) {
            targetSystem = obj.attributes.OperationName;
            if(currentTargetSystem === undefined){ // For first time set currentTargetSystem to targetSystem
              currentTargetSystem = targetSystem;
            }
            if(currentTargetSystem !== targetSystem){
              mainChildNodes.push({
                OperationName: currentTargetSystem,
                Error: "",
                Value: "",
                Count: "",
                children: childrenNodes
              });
              childrenNodes = [];
            }
            var errorMessage = obj.attributes.ErrorMessage;

            var targetSystemWithErrorString = targetSystem + errorMessage;

            if (targetSystemWithError.indexOf(targetSystemWithErrorString)<0) {
              targetSystemWithError.push(targetSystemWithErrorString);
              // if(operationName.indexOf(targetSystem)<0){
              //   targetSystem = "";
              // }
              childrenNodes.push({
                OperationName: targetSystem,
                Error: errorMessage,
                Value: 1,
                Count: me.subHyperlink(1),
                leaf : true
              });
            } else {
              for (var i = 0; i < childrenNodes.length; i++) {
                if (childrenNodes[i].OperationName === targetSystem && childrenNodes[i].Error === errorMessage) {
                  childrenNodes[i].Value++;
                  childrenNodes[i].Count = me.subHyperlink(childrenNodes[i].Value);
                  childrenNodes[i].leaf = true;
                }
              }
            }
            if (operationName.indexOf(targetSystem) < 0) {
              operationName.push(targetSystem);
            }

          });
          //if(currentTargetSystem !== targetSystem){
              mainChildNodes.push({
                OperationName: targetSystem,
                Error: "",
                Value: "",
                Count: "",
                children: childrenNodes
              });
            //}

          var roots1 = {
            expanded: true,
            children: mainChildNodes
            //   ,children : [{
            //     "OperationName":"TransferOrders",
            //     "Error":"",
            //     "Count":"4"
            //     // leaf: true
            //   },{
            //     "OperationName":"CreateOrder",
            //   "Error":"",
            //   "Count":"6",
            //   children : [{
            //     "OperationName":"TransferOrders",
            //     "Error":"error1",
            //     "Count":"4"
            //   },{
            //     "OperationName":"CreateOrder",
            //   "Error":"error2",
            //   "Count":"6"
            //   }
            // ]
            //   }
            // ]
          };
          //   me.getRowExpanderStore().setRootNode(roots);
          me.getRowPanelInboundGrid().setRootNode(roots1);
          //   me.getRowPanelInboundGrid().appendChild(roots1);
          //    me.getRowPanelInboundGrid().store = me.getRowExpanderStore();
        }
      }
    });

  },

  onLaunch: function (config) {
    console.log("Launch of DashBoardSummaryController",config);
    this.filterQuery=null;
    this.showView();
  },
  configure: function (config) {
    console.log("configure of DashBoardSummaryController",config);
    this.filterQuery = config.config[0].filterQuery;
    this.showView();
  },
  showView: function () {
    console.log("showView  DashBoardSummaryController");
    var me = this;
    var columnName = ['CreatedTimestamp', 'CreatedTimestamp'];
    var operator = ['LT', 'GT'];
    var value = ['2017-08-21T16:52:28', '2017-02-10T16:52:28'];
    //TODO: Uncomment when data is available for past 24 hrs
    // var value = this.getTimeRange("24");
    this.filterQuery = this._buildFilterQuery(columnName, operator, value);

    if (!this.getDashboardSummaryStore()) {
      this.setDashboardSummaryStore(Ext.create('JDA.dm.DashBoard.store.DashBoardSummaryStore'));
      // this.getDashboardSummaryStore().on('load', me.getDashBoardData, me);
    }
    this.getDashBoardData();
    // this.getDashboardSummaryStore().load({baseParams: {groupBy: 'ComponentName,CurrentStatus', query: this.filterQuery}});
  },

  refreshGridView: function (records, operation, success) {
    var me = this;
    var messageRecords = [];
    if (!success) {
      return;
    } else {
      console.log("refreshGridView in DashBoardSummaryController");

      Ext.each(operation, function (obj) {
        messageRecords.push({
          TargetSystem: obj.raw.attributes.DocumentI,
          Success: obj.raw.attributes.CamelExchangeId,
          Pending: obj.raw.attributes.FormatType,
          Failed: obj.raw.attributes.FormatVer,
          Total: obj.raw.attributes.FormatVer
        });
      });
    }

    this.getDashBoardStoreGrid().store.removeAll();
    this.getDashboardSummaryStore().loadData(messageRecords);
    // this.getDashBoardStoreGrid().reconfigure(this.getDashboardSummaryStore());
    this.getDashBoardStoreGrid().store = this.getDashboardSummaryStore();
  },

  //query=[AND{"column":"CreatedTimestamp","operator":"GT","value":"2017-02-27T16:52:28"},{"column":"CreatedTimestamp","operator":"LT","value":"2017-02-27T10:52:28"}]
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

  _updateQueryArray: function (array, value) {
    array.push(value);
  },

  _submitButtonClicked: function () {
    console.log("_submitButtonClicked  DashBoardSummaryController");
    var me = this,
      count = 0;
    me.includeAndInQuery = false;
    me.statusFields = [];
    me.messageTypes = [];
    me.targetSystems = [];
    me.selectedDirection = null;

    var filterObjects = [],
      filterQueryWithOr = [],
      filterQueryWithOrObjects;

    var columnName = ['CreatedTimestamp', 'CreatedTimestamp'];
    var operator = ['LT', 'GT'];
    var value = ['2017-08-21T16:52:28', '2017-02-10T16:52:28'];
    //TODO: Uncomment when data is available for past 24/48/72 hrs
    // var value = this.getTimeRange(Ext.getCmp('periodStoreCombo').getValue());

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

    var directionsFilter = Ext.getCmp('directionCombo').getValue();
    if (directionsFilter.indexOf("All directions") === -1) {
      me._updateQueryArray(columnName, 'Direction');
      me._updateQueryArray(operator, 'EQ');
      me._updateQueryArray(value, directionsFilter);
      me.includeAndInQuery = true;
    }
    me.selectedDirection = directionsFilter;

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

    var statusFilter = Ext.getCmp('statusCombo').getValue();
    if (statusFilter.indexOf("All status") === -1) {
      count = statusFilter.length;
      i = 0;
      filterObjects = [];
      if (count > 1) { // More than one selection - include OR - {"OR":[{"column":"CurrentStatus","operator":"EQ","value":"Received"},{"column":"CurrentStatus","operator":"EQ","value":"Error"}]}
        for (; i < count; i++) {
          filterObjects.push({
            column: 'CurrentStatus',
            operator: 'EQ',
            value: statusFilter[i]
          });
          this.statusFields.push(statusFilter[i]);
        }
        filterQueryWithOr.push({
          OR: filterObjects
        });
        filterQueryWithOrObjects = JSON.stringify(filterQueryWithOr);
      } else {
        me._updateQueryArray(columnName, 'CurrentStatus');
        me._updateQueryArray(operator, 'EQ');
        me._updateQueryArray(value, statusFilter[i]);
        me.statusFields.push(statusFilter[i]);
      }
      me.includeAndInQuery = true;
    }

    me.filterQuery = me._buildFilterQuery(columnName, operator, value, filterQueryWithOr);
    me.getDashBoardData();
    Ext.getCmp('tabpanel').hide();


    // var config = [];
    // config.push({
    //   filterQuery:this.filterQuery
    // });
    // RP.mvc.QuickAppManager.load('JDA.dm.MessageStore.MessageStoreSummaryPage', {
    //       config:config,
    //       onClose: Ext.Function.bind(this.resetDashBoardSummary, this),
    //       destroyOnClose: true
    //     });
  },

  updateMessageType: function (messageType) {
    var supportedMessageTypes = {
      "Transfer Order": "TransferOrder",
      "Transport Load": "transportLoadMessage",
      "Transport Instruction": "transportInstructionMessage",
      "Despatch Advice": "despatchAdviceMessage"
    };
    return supportedMessageTypes[messageType];
  },

  resetDashBoardSummary: function () {
    console.log("Close Dashboard view");
  },

  getTimeRange: function (selectedTimePeriod) {
    var timeRange = [];
    var toDate = new Date();
    toDate = this.updateFormat(toDate);
    var fromDate = new Date();

    if (selectedTimePeriod.indexOf("72") != -1) { //Last 72 hrs
      fromDate.setTime(fromDate.getTime() - 1000 * 60 * 60 * 72 * 1);
    } else if (selectedTimePeriod.indexOf("48") != -1) { //Last 48 hrs
      fromDate.setTime(fromDate.getTime() - 1000 * 60 * 60 * 24 * 1);
    } else { //Last 24 hrs
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

  getDashBoardData: function () {
    console.log("view message clicked");
    var me = this;

    var submitForm = new Ext.form.Panel({
      method: 'POST',
      url: RP.buildDataServiceUrl("connect", "cxf/frameworkservices/v1/messagestore/report"),
      baseParams: {
        groupBy: 'ComponentName,CurrentStatus',
        query: this.filterQuery
      }
    });

    submitForm.submit({
      success: function (form, action) {
        console.log("Success");
      },
      failure: function (form, action) {
        console.log("failure");
        if (action.response.status === 400 || action.response.responseObject.data[0].attributes.messageGroups === undefined) {
          Ext.MessageBox.alert(RP.getMessage('dm.MessageStore.messages.error'), 'No Records Found');
          me.getDashBoardStoreGrid().store.removeAll();
          var messageRecords = [];
          me.getDashboardSummaryStore().loadData(messageRecords);
          me.getDashBoardStoreGrid().reconfigure(me.getDashboardSummaryStore(), me.columnConfig);
          me.getDashBoardStoreGrid().store = me.getDashboardSummaryStore();
          Ext.getCmp('tabpanel').hide();
        } else {
          me.updateDashBoardData(action.response.responseText);
        }

      }
    });
  },

  updateDashBoardData: function (dashBoardResponse) {
    var me = this;
    console.log("updateDashBoardData in DashBoardSummaryController");
    var messageRecords = [];
    var decodeResponse = Ext.decode(dashBoardResponse);
    var decodeResponseData = [];
    decodeResponseData = decodeResponse.data;
    decodeResponseData = decodeResponseData[0].attributes.messageGroups;
    Ext.Array.each(decodeResponseData, function (obj) {
      var targetSystem = obj.groupName;
      var total = obj.count;
      var statusCount = obj.messageGroups;
      var receivedCount = 0;
      var processedCount = 0;
      var failedCount = 0;
      var selfUrl = {
        Received: null,
        Processed: null,
        Error: null
      };
      Ext.each(statusCount, function (obj) {
        if (obj.groupName === "Received") {
          receivedCount = obj.count;
          // selfUrl = {"Received" : obj.messageURL};
          selfUrl.Received = obj.messageURL;
        }
        if (obj.groupName === "Processed") {
          processedCount = obj.count;
          // selfUrl = {"Processed" : obj.messageURL};
          selfUrl.Processed = obj.messageURL;
        }
        if (obj.groupName === "Error") {
          failedCount = obj.count;
          // selfUrl ={"Error" : obj.messageURL};
          selfUrl.Error = obj.messageURL;
        }
      });
      messageRecords.push({
        TargetSystem: targetSystem,
        Received: me.hyperlink(receivedCount, "Received", selfUrl),
        Processed: me.hyperlink(processedCount, "Processed", selfUrl),
        Error: me.hyperlink(failedCount, "Error", selfUrl),
        SelfUrl: selfUrl,
        Total: total
      });
    });

    this.getDashBoardStoreGrid().store.removeAll();
    this.getDashboardSummaryStore().loadData(messageRecords);
    this.getDashBoardStoreGrid().reconfigure(this.getDashboardSummaryStore(), this.columnConfig);
    this.getDashBoardStoreGrid().store = this.getDashboardSummaryStore();
    if (this.statusFields.length !== 0) {
      this.hideStatusColumns();
    }
  },

  hideStatusColumns: function () {
    var statusColumns = {
      Received: 1,
      Processed: 2,
      Error: 3
    };
    for (var i = 1; i <= 3; i++) {
      this.getDashBoardStoreGrid().columnManager.getColumns()[i].setVisible(false);
    }

    for (i = 0; i < this.statusFields.length; i++) {
      this.getDashBoardStoreGrid().columnManager.getColumns()[statusColumns[this.statusFields[i]]].setVisible(true);
    }
  }
});