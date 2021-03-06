Ext.define('JDA.dm.MessageStore.view.MessageStoreSummary',{
  extend:'RP.chrome.task.TaskForm',
  title:'Message Details',
  id: 'messageStoreSummary',
  xtype:'messageStoreSummary',
  namespace: 'JDA.dm.BusinessRules.view',
  controller:'MessageStoreSummaryController',
  init:function(){
    var me = this;
    if (!me.store) {
            me.store = Ext.getStore('JDA.dm.MessageStore.store.MessageStoreSummaryStore');
        }
    this.getParent();
  },

  initComponent:function(){
    // if(!Ext.getCmp('messageStoreSummary')){
    var me = this;

    var fc = Ext.create('RP.filtering.controller.FilterController', Ext.apply({
            filterType: 'IntegrationDashboard',
            backend: 'dm',
            entityStore:'JDA.dm.MessageStore.store.MessageStoreSummaryStore',
            disableAny:true
        }));
    fc.getHeader();
     
        Ext.apply(me, {
            layout: 'fit',
        items:
        [           
          {
            xtype:'rpFilterableGrid',
            id: 'MessageStoreGrid',
            filterType: 'IntegrationDashboard',
            store: 'JDA.dm.MessageStore.store.MessageStoreSummaryStore',
            autoScroll:true,
            selModel : Ext.create('Ext.selection.CheckboxModel', {mode : 'MULTI'}),
            selType: 'rowmodel', 
            // disableAny:true,
            filterController: fc,
            controllerConfig: {
                filterType: 'IntegrationDashboard',
                allowFilterPersistence: false // Don't allow filter persistence and don't show persistence specific UI pieces.
            },
            
            listeners:{
              itemclick:function(record, item, index, e, eOpts ){
                console.log("item selected");
                this.fireEvent('messageStoreItemSelected',record,item,index,e,eOpts);
              },
              selectionchange:function(sm,selected,eOpts){
                console.log("all item selected");
                this.fireEvent('messageStoreAllItemsSelected',sm,selected,eOpts);
              },
              sortchange:function( ct, column, direction, eOpts ){
                console.log("sort selected");
                this.fireEvent('messageStoreSortColumn', ct, column, direction, eOpts );
              }
             },
            columns: [// --Change
              {text:RP.getMessage('dm.MessageStore.messages.componentName'),dataIndex:'ComponentName',flex : 1},
              {text:RP.getMessage('dm.MessageStore.messages.operation'),dataIndex:'OperationName',flex : 1},
              {text:RP.getMessage('dm.MessageStore.messages.documentId'),dataIndex:'DocumentId',flex : 1},
              {text:RP.getMessage('dm.MessageStore.messages.currentStatus'),dataIndex:'CurrentStatus',flex : 1},
              {text:RP.getMessage('dm.MessageStore.messages.errorMessage'),dataIndex:'ErrorMessage',flex : 1,sortable : false },
              {text:RP.getMessage('dm.MessageStore.messages.createdDate'),dataIndex:'CreatedTimestamp',flex : 1},
              {text: RP.getMessage('dm.MessageStore.messages.statusEvents'), dataIndex: 'Status', flex : 0.5,sortable : false },
              {text:RP.getMessage('dm.MessageStore.messages.messageId'),dataIndex:'id',flex : 1,hidden : true},              
              {text:RP.getMessage('dm.MessageStore.messages.camelExchangeId'),dataIndex:'CamelExchangeId',flex : 1,hidden : true},   
              {text:RP.getMessage('dm.MessageStore.messages.formatType'),dataIndex:'FormatType',flex : 1,hidden : true},
              {text:RP.getMessage('dm.MessageStore.messages.formatVersion'),dataIndex:'FormatVer',flex : 1,hidden : true},
              {text:RP.getMessage('dm.MessageStore.messages.componentId'),dataIndex:'ComponentId',flex : 1,hidden : true},
              {text:RP.getMessage('dm.MessageStore.messages.componentVersion'),dataIndex:'ComponentVer',width:180,hidden : true},
              {text:RP.getMessage('dm.MessageStore.messages.hostName'),dataIndex:'Hostname',flex : 1,hidden : true},
              {text:RP.getMessage('dm.MessageStore.messages.endPoint'),dataIndex:'Endpoint',flex : 1,hidden : true},
              {text:RP.getMessage('dm.MessageStore.messages.direction'),dataIndex:'Direction',flex : 1,hidden : true},
              {text:RP.getMessage('dm.MessageStore.messages.side'),dataIndex:'Side',flex : 1,hidden : true},
              {text:RP.getMessage('dm.MessageStore.messages.senderId'),dataIndex:'SenderId',flex : 1,hidden : true},
              {text:RP.getMessage('dm.MessageStore.messages.receiverId'),dataIndex:'ReceiverId',flex : 1,hidden : true}
            ],
            tbar:[
                  
            ],
            
            dockedItems:
              [

                {
                  xtype:'panel',
                  id:'buttonPanel',
                  dock:'top',
                  height:'50px',
                  width:'100%',
                  cls:'tbar-align-below',
                  items:[
                   {
                    xtype: 'button',
                    text : '<div style="color: #FAFAFA">' + RP.getMessage('dm.MessageStore.messages.backToDashBoard')+ '</div>',
                    cls: 'button-highlight',
                    //margin:{'top': -2},
                    width:'160px',
                    margin:{'left': 5},
                    disabled:true,
                    name:'backButton',
                    id:'backButton',
                    handler: function() {
                      this.fireEvent('redirectToDataSummary');
                    }
                  },
                  {
                    xtype: 'button',
                    text : RP.getMessage('dm.MessageStore.messages.process'),
                    disabled:true,
                    width:'80px',
                    margin:{'top': 5},
                    name:'processButton',
                    id:'processButton',
                    handler: function() {
                      this.fireEvent('processButtonClick');
                    }
                  },
                    {
                    xtype: 'button',
                    text : RP.getMessage('dm.MessageStore.messages.download'),
                    disabled:true,
                    width:'80px',
                    margin:{'top': 5},
                    name:'downloadButton',
                    id:'downloadButton',
                    handler: function() {
                      this.fireEvent('downloadButtonClick');
                    }
                  },
                  {
                    xtype: 'button',
                    text : RP.getMessage('dm.MessageStore.messages.view'),
                    margin:{'top': 5},
                    width:'80px',
                    disabled:true,
                    name:'viewButton',
                    id:'viewButton',
                    handler: function() {
                      this.fireEvent('viewButtonClick');
                    }
                  }
                  // {
                  //   xtype:'container',
                  //   width:'1%'
                  // },
                  ]

                },
                  { xtype: 'pagingtoolbar',
                    id:'msgPagingToolBar',
                      dock: 'bottom',
                      displayMsg: '{0} - {1} of {2}',
                      emptyMsg: 'No data to display',
                      store: 'JDA.dm.MessageStore.store.MessageStoreSummaryStore',
                      listeners: {
                        'beforechange': function( pagingToolBar, changeEvent ) {
                          console.log("before change");
                          this.fireEvent('messageStorePageChange',pagingToolBar,changeEvent);
                        },
                        'change': function( pagingToolBar,changeEvent ) {
                          console.log("after change");
                          this.fireEvent('messageStorePageSizeChange',pagingToolBar,changeEvent);
                        }
                      },
                      moveNext : function(){
                        console.log("moveNext");
                        this.fireEvent('messageStoreNextSelected');
                        this.store.currentPage=this.store.currentPage+1;
                      },
                      movePrevious : function(){
                        console.log("movePrevious");
                        this.fireEvent('messageStorePrevSelected');
                        this.store.currentPage=this.store.currentPage-1;
                      },
                      moveFirst : function(){
                        console.log("moveFirst");
                        this.fireEvent('messageStoreFirstSelected');
                        this.store.currentPage=1;
                      },
                      moveLast : function(){
                        console.log("moveLast");
                        this.fireEvent('messageStoreLastSelected');
                        this.store.currentPage=Math.ceil(this.store.totalCount/this.store.pageSize);
                      }
                  }
                  
              ]
          }
        ]   
    });
    this.callParent();
  }
});
