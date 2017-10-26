
Ext.create('Ext.data.Store', {
    storeId: 'gridData2',
    fields: ['OperationName', 'Error', 'Count'],
    data: [
        {
        "OperationName": "Transfer Order",
        "Error": "This is error 1",
        "Count": '2'
        
    },
    {
        "OperationName": "",
        "Error": "This is error 2",
        "Count": '2'
        
    },
    {
        "OperationName": "Item", 
        "Error": "This is error 1",
        "Count": '2'
    }]
});

Ext.create('Ext.data.TreeStore', {
    storeId: 'gridData3',
    fields: ['messageType', 'error'],
    data: [
        {
        "messageType": "Steven",
        "error": "Steven@gmail.com"
    },
    {
        "messageType": "Allen", 
        "error": "allen@gmail.com"
    },{
        "messageType": "Allen", 
        "error": "allend@gmail.com"
    }]
});


Ext.create('Ext.data.Store', {
    storeId: 'targetSystemStore',
    fields: ['targetSystem' ],
        data: [
            { targetSystem: 'All target systems'},
            { targetSystem: 'Gs1RefAdapter'},
            { targetSystem: 'TMS'},
            { targetSystem: 'WMS'},
            { targetSystem: 'OMS'}
        ]
});

Ext.define('JDA.dm.DashBoard.view.DashBoardSummary', {
    extend: 'RP.chrome.task.TaskForm',
    title: 'Data Feed Summary',
    id: 'dashBoardSummary',
    xtype: 'dashBoardSummary',
    namespace: 'JDA.dm.DashBoard.view',
    controller: 'DashBoardSummaryController',
    init: function() {
        var me = this;
        if (!me.store) {
            me.store = Ext.getStore('JDA.dm.DashBoard.store.DashBoardSummaryStore');
        }
        this.getParent();
    },

    initComponent: function() {
      if(!Ext.getCmp('DashBoardStoreGrid')){
        var me = this;
        if(me.toolFirst){
                var items = me.items.items;
                var title = items.splice(0, items.length - me.tools.length);
                me.items.items = items.concat(title);
            }
        me.items = [{
            xtype: 'panel',
            id: 'chartPanel',
           // autoScroll: true,
            layout : 'fit',
            width: '100%',
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                // defaultType: 'combo',
                items: [
                    {
                  xtype:'combo',
                  id: 'periodStoreCombo',
                  fieldLabel: 'Period',
                  // labelStyle:{
                  //   'font-size':'32px',
                  //   'font-weight':'bold'
                  // },
                  // labelStyle: 'width:0px',
                  labelAlign: 'right',

                  // width:'20%',
                  // padding:{'left':'60px'},
                  // name: 'type',
                  forceSelection:true,
                  typeAheadDelay:50,
                  typeAhead:true,
                  autoSelect:true,
                  // allowBlank: false,
                  minChars:1,
                  anyMatch:true,
                  store:Ext.data.StoreManager.lookup('periodStore'),
                  displayField:'period',
                  valueField:'period',
                  value:Ext.data.StoreManager.lookup('periodStore').getAt(0).get('period')
                },
                {
                    xtype:'container',
                    width:'1%'
                },
                {
                    xtype:'label',
                    text: 'Filters'
                },
                {
                    xtype:'container',
                    width:'10px'
                },
                {
                  xtype:'combo',
                  id: 'targetSystemCombo',
                  multiSelect :true,
                  // fieldLabel: 'TargetSystem',
                  // labelStyle: 'width:60px',
                  labelAlign: 'right',
                  // width:'20%',
                  // padding:{'left':80},
                  name: 'type',
                  forceSelection:true,
                  typeAheadDelay:50,
                  // typeAhead:true,
                  autoSelect:true,
                  minChars:1,
                  anyMatch:true,
                  store:Ext.data.StoreManager.lookup('targetSystemStore'),
                  displayField:'targetSystem',
                  valueField:'targetSystem',
                  value:Ext.data.StoreManager.lookup('targetSystemStore').getAt(0).get('targetSystem')
                },
                {
                  xtype:'combo',
                  id: 'directionCombo',
                  //fieldLabel: 'Direction',
                  // labelStyle: 'width:60px',
                  labelAlign: 'right',
                  // width:'20%',
                  // padding:{'left':80},
                  name: 'type',
                  forceSelection:true,
                  typeAheadDelay:50,
                  typeAhead:true,
                  autoSelect:true,
                  minChars:1,
                  anyMatch:true,
                  store:Ext.data.StoreManager.lookup('directionStore'),
                  displayField:'direction',
                  valueField:'direction',
                  value:Ext.data.StoreManager.lookup('directionStore').getAt(0).get('direction')
                  
                },
                {
                  xtype:'combo',
                  id: 'messageTypeCombo',
                  multiSelect :true,
                  // fieldLabel: 'Message Type',
                  // labelStyle: 'width:80px',
                  labelAlign: 'right',
                  width:'30px',
                  // padding:{'left':80},
                  name: 'type',
                  forceSelection:true,
                  typeAheadDelay:50,
                  // typeAhead:true,
                  autoSelect:true,
                  minChars:1,
                  anyMatch:true,
                  store:Ext.data.StoreManager.lookup('messageTypeStore'),
                  displayField:'messageType',
                  valueField:'messageType',
                  value:Ext.data.StoreManager.lookup('messageTypeStore').getAt(0).get('messageType')
                },
                {
                xtype:'combo',
                // labelStyle: 'width:60px',
                  // fieldLabel: 'Status',
                  id: 'statusCombo',
                  labelAlign: 'right',
                  // width:'20%',
                  multiSelect :true,
                  // padding:{'left':80},
                  name: 'type',
                  forceSelection:true,
                  typeAheadDelay:50,
                  // typeAhead:true,
                  autoSelect:true,
                  minChars:1,
                  anyMatch:true,
                  store:Ext.data.StoreManager.lookup('statusStore'),
                  displayField:'status',
                  valueField:'status',
                  value:Ext.data.StoreManager.lookup('statusStore').getAt(0).get('status')
                },
                {
                    xtype:'container',
                    width:'2%'
                },
                {
                    xtype:'button',
                    text:RP.getMessage('dm.DashBoard.messages.apply'),
                    id:'submitButton',
                    handler: function() {
                    }
                }
                ]
            }],        
            items : [{
            xtype : 'gridpanel',
            id: 'DashBoardStoreGrid',
            width : '100%',
            height: '50%',
            // layout : 'auto',
            // store : Ext.data.StoreManager.lookup('gridData1'),
            // bind:'{DashBoardSummaryStore}',
            store:'JDA.dm.DashBoard.store.DashBoardSummaryStore',
            autoScroll : false,
            scrolable : false,
            enableLocking: false,
            // plugins: [{
            //   ptype: 'rowexpander',
            //   rowBodyTpl : [
            //       '<div class = "system-row" id="system-row-{TargetSystem}"></div>'
            //       ]
            // }],
            columns: [{
                    text     : RP.getMessage('dm.DashBoard.messages.targetSystem'),
                    flex     : 5,
                    sortable : false,
                    dataIndex: 'TargetSystem'
                }, {
                    text     : RP.getMessage('dm.DashBoard.messages.received'),
                    flex     : 1,
                    sortable : true,
                    dataIndex: 'Received'
                }, {
                    text     : RP.getMessage('dm.DashBoard.messages.processed'),
                    flex     : 1,
                    dataIndex: 'Processed'
                }, {
                    text     : RP.getMessage('dm.DashBoard.messages.error'),
                    flex     : 1,
                    sortable : false,
                    dataIndex : 'Error'
                  },{
                    text     : RP.getMessage('dm.DashBoard.messages.total'),
                    flex     : 1,
                    sortable : false,
                    dataIndex : 'Total'
                  }],listeners:{
              itemclick:function(record, item, index, e, eOpts ){
                console.log("item selected");
                this.fireEvent('bashBoardItemSelected',record,item,index,e,eOpts);
              }}
            }]
        },{
                xtype : 'box',
                padding : 20
    },{    
      margin : 20,  
      xtype: 'tabpanel',
      id : 'tabpanel',
     hidden : true,
      items: [{
        title: 'Received',
        id: 'InboundPanel',
        plain: true,
        layout: {
        align: 'stretch'
    },
        defaults: {
        autoScroll: true,
        active : true
    },
        items : [{
            xtype : 'treepanel',
             id: 'RowPanelInboundGrid',
             listeners: {
                    itemclick: function (view, record, item, index, e,eOpts) {

                           this.fireEvent('treePanelRowClicked',view, record, item, index, e,eOpts);
                        }
                },
             rootVisible: false,
            width : '100%',
        //    store : Ext.data.StoreManager.lookup('gridData2'),
             store:Ext.create('JDA.dm.DashBoard.store.RowExpanderStore'),
            // store: 'JDA.dm.MessageStore.store.MessageStoreSummaryStore',
            autoScroll : true,
            scrollable : true,
    //         plugins: [{
    //     ptype: 'rowexpander',
    //     rowBodyTpl : [
    //         '<div id="system-row-{TargetSystem}">Hello World !</div>'
    //     ]
    // }],
        columns: [{
                    text     : 'Message Type',
                    flex     : 1,
                    sortable : false,
                    dataIndex: 'OperationName',
                    xtype : 'treecolumn',
                    iconCls: ''
                }, {
                    text     : 'Error',
                    flex     : 1,
                    sortable : true,
                    dataIndex: 'Error'
                },  {
                    text     : 'Count',
                    flex     : 1,
                    sortable : true,
                    dataIndex: 'Count'
                }]
            }]
      }, {
        title: 'Sent',
         id: 'OutboundPanel',
        plain: true,
        layout: {
        align: 'stretch'
    },
        defaults: {
        autoScroll: true,
        active : true
    },
        items : [{
            xtype : "treepanel",
             id: 'RowPanelOutboundGrid',
            width : '100%',
          store : Ext.data.StoreManager.lookup('gridData3'),
            autoScroll : true,
            scrolable : true,
    //         plugins: [{
    //     ptype: 'rowexpander',
    //     rowBodyTpl : [
    //         '<div id="system-row-{messageType}">Hello World !</div>'
    //     ]
    // }],
        columns: [{
                    text     : 'Message Type',
                    flex     : 1,
                    sortable : false,
                    dataIndex: 'messageType',
                    xtype : 'treecolumn'
                },  {
                    text     : 'Error',
                    flex     : 1,
                    dataIndex: 'error'
                }]
            }]
      }]
}];
        me.callParent();
    }
  }
});