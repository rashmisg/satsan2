Ext.define('JDA.dm.MessageDetails.controller.MessageDetailsSummaryController',
{
    extend:'Ext.app.Controller',
    config: {
      messageStore: null,
      selectedMessageIds: [],
      isMessageSelected: false,
      pageOffset: 0,
      pageLimit: 25,
      count: 0,
      filterString: null,
      controllerReference: null,
      retainQueryParam: false,
      isPageLoadedOnce: false
    },
    refs:
    [
      {
        ref:'messageDetailsGrid',
        selector:'#MessageDetailsGrid'
      },
      {
        ref:'detailsDownloadButton',
        selector:'#detailsDownloadButton'
      },
      {
          ref:'detailsMsgPagingToolBar',
          selector:'#detailsMsgPagingToolBar'
      },{
        ref:'filterValue',
          selector:'#filterValue'
      }
    ],

    views: [
      'MessageDetailsSummary'
    ],
    stores: [
        'MessageDetailsSummaryStore'
    ],
  init:function(){
    console.log("init of MessageDetailsSummaryController");
    this.control({
      'grid[id=MessageDetailsGrid]': {
       messageDetailsItemSelected: this.messageSelected
      }
     });
    this.control({
      'grid[id=MessageDetailsGrid]': {
        messageDetailsAllItemsSelected: this.allMessagesSelected
      }
    });
    this.control({
      'grid[id=MessageDetailsGrid]': {
       messageDetailsSortColumn: this.messageDetailsSort
      }
     });
    this.control(
      {
        'button[id=detailsDownloadButton]':{click:this._downloadMessage}
      }
    );
    this.control(
      {
        'button[id=detailsViewButton]':{click:this._viewMessage}
      }
    );
    this.control(
      {
        'button[id=detailsProcessButton]':{click:this._processMessage}
      }
    );
    // this.control(
    //   {
    //     'button[id=backButton]':{click:this._redirectToDataSummary}
    //   }
    // );
    this.control({
      'pagingtoolbar[id=detailsMsgPagingToolBar]': {
       messageDetailsNextSelected: this.moveNext
      }
     });
    this.control({
      'pagingtoolbar[id=detailsMsgPagingToolBar]': {
       messageDetailsPrevSelected: this.movePrev
      }
     });
    this.control({
      'pagingtoolbar[id=detailsMsgPagingToolBar]': {
       messageDetailsFirstSelected: this.moveFirst
      }
     });
    this.control({
      'pagingtoolbar[id=detailsMsgPagingToolBar]': {
       messageDetailsLastSelected: this.moveLast
      }
     });
    this.control({
      'pagingtoolbar[id=detailsMsgPagingToolBar]': {
       messageDetailsPageChange: this.moveToPage
      }
     });
    this.control({
      'pagingtoolbar[id=detailsMsgPagingToolBar]': {
       messageDetailsPageSizeChange: this.moveToPageSize
      }
     });             

  },
    
  formatDate:function(date){
    var createDate= new Date(date);
    return Ext.Date.format(createDate ,'Y-m-d')+" "+Ext.Date.format(createDate ,'G:i');
  },

  onLaunch: function(config) {
    console.log("Launch of MessageDetailsSummaryController", config);
    var me = this;
    me._loadDefaultFilterData();
},
  configure: function(config) {
          console.log("configure of MessageDetailsSummaryController");
          // Filter obtained here
          console.log("Config filter query ", config.config[0].filterQuery);
          this.filterString = config.config[0].filterQuery;
          this.controllerReference = config.config[0].controllerReference;
          //this.showView();
      },
  _loadDefaultFilterData: function() {
          var me = this;
          var columnName = [];
          var operator = [];
          var value = [];
          Ext.Ajax.request({
              url: '/refs/filtering/api/v1/filters?filterDef=MessageDetails&favorite',
              method: 'GET',
              success: function(options, success, response) {
                  for (var i = 0; i < options.responseObject.data.length; i++) {
                      if (options.responseObject.data[i].defaultFilter) {
                          if(options.responseObject.data[i].criteria.AND){
                            me.filterString=JSON.stringify(options.responseObject.data[i].criteria.AND);
                          }else if(options.responseObject.data[i].criteria.OR){
                             me.filterString=JSON.stringify(options.responseObject.data[i].criteria.OR);
                          }
                         me.filterString=me.filterString.replace(/columnName/g, 'column');
                      }
                  }
                   me.showView();

              },
              failure: function(options, success, response) {
                  console.log("failed");
                  // if failed just load all data with out any filter
                   me.showView();
              }
          });
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

  allMessagesSelected:function(sm,selected,eOpts){
    if(sm.getSelection().length === 0){
      this.disableButtons();
      this.setSelectedMessageIds([]);
    }else if(sm.getSelection().length === this.messageStore.totalCount || sm.getSelection().length === this.pageLimit){
      this.disableButtons();
      this.setSelectedMessageIds([]);
      for(var i=0; i<selected.length;i++) {
        this.getSelectedMessageIds().push(selected[i].data.id);
      }
      if(this.controllerReference === null||(this.controllerReference && !this.controllerReference.isProcessedTabSelected)){
        Ext.getCmp('detailsProcessButton').enable();
      }
    }

  },

  messageSelected:function(record,item,index,e,eOpts) {
    console.log("Message Selected");

    if(eOpts.ctrlKey === true || eOpts.target.className === "x-grid-row-checker"){
      //Check for multi select
      if(this.getSelectedMessageIds().indexOf(item.data.id) !== -1){
        //if item is already selected, remove it from selected items list
        // Find and remove item from an array
        var i = this.getSelectedMessageIds().indexOf(item.data.id);
        if(i != -1) {
          this.getSelectedMessageIds().splice(i, 1);
        }
        //after removing the item from selected messages, if array is empty disable buttons
        if(this.getSelectedMessageIds().length === 1){
          this.enableButtons();
        }else if(this.getSelectedMessageIds().length === 0){
          this.disableButtons();
        } else {
          this.disableButtons();
          if(this.controllerReference === null||(this.controllerReference && !this.controllerReference.isProcessedTabSelected)){
            Ext.getCmp('detailsProcessButton').enable();
          }
        }
      } else {
        //selected item is not in already selected items
        this.getSelectedMessageIds().push(item.data.id);
        //if length is 1, enable download and view buttons
        if(this.getSelectedMessageIds().length === 1){
          this.enableButtons();
        }else{
          //for more than one selection, enable only process button
          this.disableButtons();
          if(this.controllerReference === null||(this.controllerReference && !this.controllerReference.isProcessedTabSelected)){
            Ext.getCmp('detailsProcessButton').enable();
          }
        }
      }
    }else{
      //single select
      this.setSelectedMessageIds([]);
      this.getSelectedMessageIds().push(item.data.id);
      if(this.getSelectedMessageIds().length === 1){
          this.enableButtons();
      }else{
          this.disableButtons();  
      }
    }

    if(eOpts.getTarget().id==='viewPanel'){
      this.viewStatusEvents(record,item,index,e,eOpts);
    }
  },
  
  messageDetailsSort:function(ct, column, direction, eOpts ){
    console.log("messageDetailsSort in MessageDetailsSummaryController");
    var me = this;
    var sortColumnName = "";
    me.retainQueryParam = true;

    if(direction === "DESC"){
      sortColumnName = "-";
    } 
    sortColumnName += column.dataIndex;

    var sortType = direction;

    // me.getMessageStore().getProxy().setExtraParam('sort', sortColumnName);
    me.setMessageStoreExtraParam('sort',sortColumnName);
    if(this.isMessageSelected)
    {
      this.isMessageSelected = false;
      this.disableButtons();  
    }
    me.loadMessageStore();

  },

  setMessageStoreExtraParam:function(type,columnName){
    this.getMessageStore().getProxy().setExtraParam(type, columnName);
  },

  loadMessageStore:function(){
    this.getMessageDetailsGrid().store.load();
    //this.getMessageStore().on('load', this.refreshGridView, this);
  },


  disableButtons:function(){
    Ext.getCmp('detailsDownloadButton').disable();
    Ext.getCmp('detailsViewButton').disable();
    Ext.getCmp('detailsProcessButton').disable();
  },

  enableButtons:function(){
    Ext.getCmp('detailsDownloadButton').enable();
    Ext.getCmp('detailsViewButton').enable();
    if(this.controllerReference && !this.controllerReference.isProcessedTabSelected){
      Ext.getCmp('detailsProcessButton').enable();  
    }else if(this.controllerReference === null){
      Ext.getCmp('detailsProcessButton').enable();
    }
  },

  showView: function() {
    console.log("showView  MessageDetailsSummaryController");
    var me = this;
    if (!this.getMessageStore()) {
        this.setMessageStore(Ext.create('JDA.dm.MessageDetails.store.MessageDetailsSummaryStore'));
        this.getMessageStore().on('load', me.refreshGridView, me);
    }
    me.setMessageStoreExtraParam('offset', me.pageOffset);
    me.setMessageStoreExtraParam('limit', me.pageLimit);
    if (me.filterString) {
        me.setMessageStoreExtraParam('query', me.filterString);
    }
    me.setMessageStoreExtraParam('sort', '-CreatedTimestamp');
   this.getMessageStore().load();
},
  /**
   * 
   * Pagination funcion: Called when move next page is selected
   */
  moveNext:function() {
    console.log("moveNext selected");
    var me = this;
    me.retainQueryParam = true;
    me.pageOffset += me.pageLimit;
    me.setMessageStoreExtraParam('offset', me.pageOffset);
    me.setMessageStoreExtraParam('limit', me.pageLimit);
    me.loadMessageStore();
    
    me.disableButtons();
  },

  moveToPage:function(pagingToolBar,changeEvent) {
    console.log("Move to page");
    var me = this;
    me.pageLimit = undefined;
  },

  moveToPageSize:function(pagingToolBar,changeEvent) {
    console.log("Move to pageSize");
    var me = this;
    me.retainQueryParam = true;
    //Fix for pagination , when navigated from Integrated Dashboard
    if(this.controllerReference && this.isPageLoadedOnce){
      me.loadMessageStore();
    }
    if(!this.isPageLoadedOnce) {
      this.isPageLoadedOnce = true;  
    }else{
      this.isPageLoadedOnce = false;
    }
    
    if(changeEvent === undefined || pagingToolBar.store.pageSize === me.pageLimit){
      return;
    }
    me.pageOffset = changeEvent.fromRecord -1;
    me.pageLimit = pagingToolBar.store.pageSize;
    if(me.isMessageSelected){
      me.isMessageSelected = false;
      me.disableButtons();
    }
    me.setMessageStoreExtraParam('offset', me.pageOffset);
    me.setMessageStoreExtraParam('limit', me.pageLimit);
    me.loadMessageStore();
  },

  movePrev:function() {
    console.log("movePrev selected");
    var me = this;
    me.retainQueryParam = true;
    me.pageOffset -= me.pageLimit;
    me.setMessageStoreExtraParam('offset', me.pageOffset);
    me.setMessageStoreExtraParam('limit', me.pageLimit);
    me.loadMessageStore();
    me.disableButtons();
  },

  moveFirst:function() {
    console.log("moveFirst selected");
    var me = this;
    me.pageOffset = 0;
    me.retainQueryParam = true;
    me.setMessageStoreExtraParam('offset', me.pageOffset);
    me.setMessageStoreExtraParam('limit', me.pageLimit);
    me.loadMessageStore();
    me.disableButtons();
  },

  moveLast:function() {
    console.log("moveLast selected");
    var me = this;
    me.retainQueryParam = true;
    me.pageOffset = (me.count%me.pageLimit===0)?(me.pageLimit*((me.count/me.pageLimit)-1)):(me.pageLimit*Math.floor(me.count/me.pageLimit));
    me.setMessageStoreExtraParam('offset', me.pageOffset);
    me.setMessageStoreExtraParam('limit', me.pageLimit);
    me.loadMessageStore();
    me.disableButtons();
  },

  /**
   * This method is executed after the Loads Store is loaded.
   */
  refreshGridView: function(records, operation, success) {
    var me = this;
    if(!success){
      return ;
    }else {
      //save filter query for sort
      if(records._lastParams){
        this.setMessageStoreExtraParam('query', records._lastParams.query);
        this.retainQueryParam = false;
        this.disableButtons();
      }else if(!this.retainQueryParam){
        delete this.getMessageStore().getProxy().extraParams.query;
      }
      console.log("refreshGridView");
      var messageRecords = [];
            Ext.each(operation, function(obj){
      messageRecords.push({
        DocumentId: obj.raw.attributes.DocumentId,
        CamelExchangeId: obj.raw.attributes.CamelExchangeId,
        FormatType: obj.raw.attributes.FormatType,
        FormatVer: obj.raw.attributes.FormatVer,
        CreatedTimestamp: obj.raw.attributes.CreatedTimestamp?me.formatDate(obj.raw.attributes.CreatedTimestamp):"Not Available",
        ComponentName: obj.raw.attributes.ComponentName,
        ComponentId: obj.raw.attributes.ComponentId,
        ComponentVer: obj.raw.attributes.ComponentVer,
        CurrentStatus: obj.raw.attributes.CurrentStatus,
        ErrorMessage: obj.raw.attributes.ErrorMessage,
        OperationName: obj.raw.attributes.OperationName,
        Hostname: obj.raw.attributes.Hostname,
        Endpoint: obj.raw.attributes.Endpoint,
        Direction: obj.raw.attributes.Direction,
        Side: obj.raw.attributes.Side,
        SenderId: obj.raw.attributes.SenderId,
        ReceiverId: obj.raw.attributes.ReceiverId,
        id: obj.internalId,
        Status: '<a href="#" id="viewPanel">View</a>'
      });
    });
      this.count = records.totalCount;
      if(this.getMessageDetailsGrid()!==undefined){
       this.getMessageDetailsGrid().store.removeAll();
     }
      this.getMessageStore().loadData(messageRecords);
      this.getMessageDetailsGrid().down('pagingtoolbar').store.totalCount = records.totalCount;
      // this.getMessageDetailsGrid().down('pagingtoolbar').store.pageCount=records.lastOptions.page;
      var bbar = Ext.getCmp('MessageDetailsGrid').down('pagingtoolbar');
      //Fix : onLoad for empty records is resulting in ! in current page
      var currRecord=records._lastOperation.params.offset+1;
      var total=this.pageOffset+messageRecords.length;
      if(records.totalCount!==0){
        // bbar.displayMsg = currRecord+" - "+total+" of "+records.totalCount;
        bbar.displayMsg = "{0} - {1} of {2}";
        this.getMessageDetailsGrid().down('pagingtoolbar').onLoad();
      }else{
        this.getMessageDetailsGrid().store.removeAll();
        bbar.displayMsg = "No data to display";
        bbar.updateInfo();
      }
      this.getMessageDetailsGrid().reconfigure(this.getMessageStore());
      this.getMessageDetailsGrid().store = this.getMessageStore();
     
    }
     
     JDA.dm.Utils.DataService.hideLoadingMask();

},

  /**
   * @private
   * View selected message content
   */
  _viewMessage:function(){
    console.log("view message clicked");
    var me = this;
    //http://in2npdvintmt02:8181/cxf/frameworkservices/messagestore/messages/AVf7ZPQvVgzlG4lRtgf7
    RP.Ajax.request({
          url: RP.buildDataServiceUrl("connect","cxf/frameworkservices/v1/messagestore/messages/"+this.getSelectedMessageIds()[0]),
          method: 'GET',
          callback: function(options, success, response) {
            console.log("Success"+success);
            var records = [];
            if(success) {
              console.log("response"+response.responseText);
              var res = Ext.decode(response.responseText, true);
              me._displayMessage(res.data.attributes.Message);
            }
          }
      });
  },

  _processMessage:function(){
    console.log("process message clicked");
    var me = this;


    var submitForm = new Ext.form.Panel({
            method: 'POST',
            url: RP.buildDataServiceUrl("connect", "cxf/frameworkservices/v1/messagestore/replay"),
            baseParams: {
                ids: me.getSelectedMessageIds().toString()
            }
        });

    submitForm.submit({
            success: function(form, action) {
                console.log("Success");

            },
            failure: function(form, action) {
              console.log("failure");
              if(action.result.message === "Accepted"){
                Ext.MessageBox.alert('Success', 'Message/s sent for reprocess');
                me.showView();
                me.setSelectedMessageIds([]);
                me.disableButtons();
              }
            }
          });

  },

  _redirectToDataSummary:function(){
    this.application.taskForm.close();
    this.controllerReference.getIntegrationDashBoardData();// To refresh the integration dashboard 
  },


  /**
   * @privatehttp://localhost:8080/portal/page?libraryContext=d8aa597c214ccdc8d33e346b5d417fe0772b633abcc156dce70027c334b0cb36&siteId=my-mock&menu=dm#
   * Display message contents for selected message
   */
  _displayMessage:function(messageText){
    console.log("Message text"+messageText);
    var me = this;

    Ext.define('Fiddle.view.Panel',{
            extend: 'Ext.panel.Panel',
            width: 1330,
            height: 630,
            floating: true,
            autoScroll:true,
            //padding: '10 5 10 10',
            title: 'Message',
            closable:true,
            listeners: {
          beforedestroy: function (ct, cmp) {
            // ct - the TabPanel (or this), cmp - panel to be removed
            console.log("beforedestroy");
            Ext.getCmp('messageDetailsSummary').enable();
            return true;
          },
          beforeshow:function(ct,cmp){
            console.log("beforeshow");
            Ext.getCmp('messageDetailsSummary').disable();
            return true;
          }
        }
        });

    var panel=Ext.create('Fiddle.view.Panel');
    panel.update('<pre>' + Ext.util.Format.htmlEncode((messageText)) + '</pre>');

    panel.show();
  },

  /**
   * @private
   * View status events for the selected message
   */
  viewStatusEvents: function(record,item,index,e,eOpts) {  //Capturing Selected record
      console.log("viewStatusEvents clicked");
      eOpts.stopEvent(); //Stoping MouseEvents
      var me = this;
      me._displayStatusEvents(item.data.id); //passing Message Id
  },

  /**
   * @private
   * Display status events for the selected message
   */
  _displayStatusEvents: function(messageId) {
      var me = this;
      RP.Ajax.request({
          url: RP.buildDataServiceUrl("connect", "cxf/frameworkservices/v1/messagestore/messages/" + messageId),
          method: 'GET',
          callback: function(options, success, response) {
            if (success) {
                var res = Ext.decode(response.responseText, true);
                var window = Ext.create('Ext.window.Window');
                window.add({
                    xtype: 'grid',
                    title: RP.getMessage('dm.MessageStore.messages.statusEvents'),
                    store: Ext.create('Ext.data.Store', {
                        fields: ["CreatedTimestamp", "Status","versionId","Errors"],
                        autoLoad: 'true',
                        proxy: {
                            type: 'ajax',
                            url: RP.buildDataServiceUrl("connect", "cxf/frameworkservices/v1/messagestore/messages/" + messageId),
                            reader: {
                                type: 'json',
                                root: 'data.attributes.StatusEvents'  // setting root to Status events
                            }
                        }
                    }),
                    columnLines: true,
                    align: 'center',
                    pack: 'center',
                    forcefit: true,
                    width: 1200,
                    height: 600,
                    autoScroll: true,
                    columns: [{
                        dataIndex: 'Status',
                        renderer: function(value){
                          if(value === "SentForReplay"){
                            return "Sent For Replay";
                          }
                          return value;
                        },
                        text: 'Message Status',
                        sortable: false,
                        flex: 0.8
                    },{
                        dataIndex: 'CreatedTimestamp',
                        text: 'Created Timestamp',
                        flex: 1.7
                    },{
                        dataIndex: 'Errors',
                        text: 'Errors',
                        sortable: false,
                        flex: 5.2
                    }],
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            margin: '2 2 2 2',
                            frame: true,
                            defaults : {
                                  padding : '15px'
                            },
                            items: [{
                                xtype: 'displayfield',
                                fieldLabel: '<strong>Message Id</strong>',
                                value: messageId,
                                flex: 1.5
                            }, {
                                xtype: 'displayfield',
                                fieldLabel: 'Format Type',
                                value: res.data.attributes.FormatType,
                                flex: 1

                            }, {
                                xtype: 'displayfield',
                                fieldLabel: 'Created Date',
                                value: me.formatDate(res.data.attributes.CreatedTimestamp),
                                flex: 2
                            }]
                        }
                    ]
                });
                window.show();

            }
          }
      });
  },

  /**
   * @private
   * Downloads the xml file.
   */
  _downloadMessage: function() {
    var url= RP.buildDataServiceUrl("connect", 'cxf/frameworkservices/v1/messagestore/messages/download/'+this.getSelectedMessageIds()[0]+'/'+this.getSelectedMessageIds()[0])+"&_force_download";
    this._getDownloadFrame().load(url);
},

  /**
   * @private
   * Returns a reference to the download iframe - creates the frame it doesn't already exist.
   */
  _getDownloadFrame: function() {
    return this._createDownloadFrame();
  },

  /**
   * @private
   * Creates the download Iframe.
   */
  _createDownloadFrame: function() {
      this.downloadFrame =
          new RP.component.IFrame({
              hidden: true,
              renderTo: Ext.getBody()
          });
      return this.downloadFrame;
  }

});
