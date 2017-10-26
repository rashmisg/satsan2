
Ext.define('JDA.dm.DashBoard.model.DashBoardSummaryModel', {
    extend: 'Ext.data.Model',
    // idProperty: 'resourceId',
    fields: [{
      name:'TargetSystem',
      type:'string'
    },
    {
      name:'Received',
      type:'string'
    },
    {
      name:'Processed',
      type:'string'
    },
    {
      name:'Error',
      type:'string'
    },{
      name: 'Total',
      type: 'string'
    },{
      name: 'SelfUrl'
    }
  ]
}
);

Ext.define('JDA.dm.DashBoard.model.RowExpanderModel', {
    extend: 'Ext.data.Model',
    // idProperty: 'resourceId',
    fields: [{
      name:'OperationName',
      type:'string'
    },
    {
      name:'Error',
      type:'string'
    },
    {
      name:'Count',
      type:'string'
    }
  ]
}
);


Ext.define('JDA.dm.DashBoard.store.DashBoardSummaryStore',{
  extend:'Ext.data.Store',
  storeId:'DashBoardSummaryStore',
  model: 'JDA.dm.DashBoard.model.DashBoardSummaryModel',
  autoLoad: true,
  //cxf/frameworkservices/messagestore/messages?page[offset]=0&page[limit]=5 
  proxy: {
            type: 'memory',
            // method: 'POST',
            // url: RP.buildDataServiceUrl("connect","cxf/frameworkservices/v1/messagestore/report")
            // enablePaging: true,
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'count'
            }
        }
});

Ext.define('JDA.dm.DashBoard.store.RowExpanderStore',{
  extend:'Ext.data.TreeStore',
  storeId:'RowExpanderStore',
  model: 'JDA.dm.DashBoard.model.RowExpanderModel',
  autoLoad: true,
  rootVisible : false
});