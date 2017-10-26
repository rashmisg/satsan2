Ext.define('JDA.dm.MessageDetails.view.MessageDetailsSummary',{
  extend:'RP.chrome.task.TaskForm',
  title:'Message Store Details',
  id: 'messageDetailsSummary',
  xtype:'messageDetailsSummary',
  namespace: 'JDA.dm.BusinessRules.view',
  controller:'MessageDetailsSummaryController',
  init:function(){
    var me = this;
    if (!me.store) {
            me.store = Ext.getStore('JDA.dm.MessageDetails.store.MessageDetailsSummaryStore');
        }
    this.getParent();
  },

  initComponent:function(){
    // if(!Ext.getCmp('messageDetailsSummary')){
    var me = this;

    var fc = Ext.create('RP.filtering.controller.FilterController', Ext.apply({
            filterType: 'MessageDetails',
            backend: 'dm',
            entityStore:'JDA.dm.MessageDetails.store.MessageDetailsSummaryStore',
            disableAny:true
        }));
    fc.getHeader();
     
        Ext.apply(me, {
            layout: 'fit',
        items:
        [           
          {
            xtype:'rpFilterableGrid',
            id: 'MessageDetailsGrid',
            filterType: 'MessageDetails',
            store: 'JDA.dm.MessageDetails.store.MessageDetailsSummaryStore',
            autoScroll:true,
            selModel : Ext.create('Ext.selection.CheckboxModel', {mode : 'MULTI'}),
            selType: 'rowmodel', 
            // disableAny:true,
            filterController: fc,
             controllerConfig: {
                filterType: 'MessageDetails',
                allowFilterPersistence: false // Don't allow filter persistence and don't show persistence specific UI pieces.
            },
            
            listeners:{
              itemclick:function(record, item, index, e, eOpts ){
                console.log("item selected");
                this.fireEvent('messageDetailsItemSelected',record,item,index,e,eOpts);
              },
              selectionchange:function(sm,selected,eOpts){
                console.log("all item selected");
                this.fireEvent('messageDetailsAllItemsSelected',sm,selected,eOpts);
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
                  id:'detailsButtonPanel',
                  dock:'top',
                  height:'50px',
                  width:'100%',
                  cls:'tbar-align-below',
                  items:[
                  //  {
                  //   xtype: 'button',
                  //   text : '<div style="color: #FAFAFA">' + RP.getMessage('dm.MessageStore.messages.backToDashBoard')+ '</div>',
                  //   cls: 'button-highlight',
                  //   //margin:{'top': -2},
                  //   width:'160px',
                  //   margin:{'left': 5},
                  //   disabled:true,
                  //   name:'backButton',
                  //   id:'backButton',
                  //   handler: function() {
                  //     this.fireEvent('redirectToDataSummary');
                  //   }
                  // },
                  {
                    xtype: 'button',
                    text : RP.getMessage('dm.MessageStore.messages.process'),
                    disabled:true,
                    width:'80px',
                    margin:{'top': 5},
                    name:'detailsProcessButton',
                    id:'detailsProcessButton',
                    handler: function() {
                      this.fireEvent('detailsProcessButtonClick');
                    }
                  },
                    {
                    xtype: 'button',
                    text : RP.getMessage('dm.MessageStore.messages.download'),
                    disabled:true,
                    width:'80px',
                    margin:{'top': 5},
                    name:'detailsDownloadButton',
                    id:'detailsDownloadButton',
                    handler: function() {
                      this.fireEvent('detailsDownloadButtonClick');
                    }
                  },
                  {
                    xtype: 'button',
                    text : RP.getMessage('dm.MessageStore.messages.view'),
                    margin:{'top': 5},
                    width:'80px',
                    disabled:true,
                    name:'detailsViewButton',
                    id:'detailsViewButton',
                    handler: function() {
                      this.fireEvent('detailsViewButton');
                    }
                  }
                  // {
                  //   xtype:'container',
                  //   width:'1%'
                  // },
                  ]

                },
                  { xtype: 'pagingtoolbar',
                    id:'detailsMsgPagingToolBar',
                      dock: 'bottom',
                      displayMsg: '{0} - {1} of {2}',
                      emptyMsg: 'No data to display',
                      store: 'JDA.dm.MessageDetails.store.MessageDetailsSummaryStore',
                      listeners: {
                        'beforechange': function( pagingToolBar, changeEvent ) {
                          console.log("before change");
                          this.fireEvent('messageDetailsPageChange',pagingToolBar,changeEvent);
                        },
                        'change': function( pagingToolBar,changeEvent ) {
                          console.log("after change");
                          this.fireEvent('messageDetailsPageSizeChange',pagingToolBar,changeEvent);
                        }
                      },
                      moveNext : function(){
                        console.log("moveNext");
                        this.fireEvent('messageDetailsNextSelected');
                        this.store.currentPage=this.store.currentPage+1;
                      },
                      movePrevious : function(){
                        console.log("movePrevious");
                        this.fireEvent('messageDetailsPrevSelected');
                        this.store.currentPage=this.store.currentPage-1;
                      },
                      moveFirst : function(){
                        console.log("moveFirst");
                        this.fireEvent('messageDetailsFirstSelected');
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
