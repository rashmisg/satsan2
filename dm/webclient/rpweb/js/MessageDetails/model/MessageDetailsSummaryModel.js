
Ext.define('JDA.dm.MessageDetails.model.MessageDetailsSummaryModel', {
    extend: 'Ext.data.Model',
    // idProperty: 'resourceId',
    fields: [{
      name:'DocumentId',
      type:'string'
    },{
        name: 'CamelExchangeId',
        type: 'string'
    }, {
        name: 'FormatType',
        type: 'string'
    }, {
        name: 'FormatVer',
        type: 'string'
    }, {
        name: 'CreatedTimestamp',
        type: 'string'
      },{
      name: 'ErrorMessage',
      type: 'string'
    },{
        name: 'CurrentStatus',
        type: 'string'
      },{
        name: 'Status',
        type: 'string'
      },{
        name: 'ComponentName',
        type: 'string'
      },{
        name:'ComponentId',
        type:'string'
      },{
        name:'ComponentVer',
        type:'string'
      },{
        name:'OperationName',
        type:'string'
      },{
        name:'Hostname',
        type:'string'
      },{
        name:'Direction',
        type:'string'
      },{
        name:'Side',
        type:'string'
      },{
        name:'SenderId',
        type:'string'
      },{
        name:'ReceiverId',
        type:'string'
      },{
        name:'Endpoint',
        type:'string'
      },{
        name:'id',//MessageId
        type:'string'
      }
      ]
}
);


Ext.define('JDA.dm.MessageDetails.store.MessageDetailsSummaryStore',{
  extend:'Ext.data.Store',
  storeId:'MessageDetailsSummaryStore',
  model: 'JDA.dm.MessageDetails.model.MessageDetailsSummaryModel', 
  autoLoad: false,
  //cxf/frameworkservices/messagestore/messages?page[offset]=0&page[limit]=5 
  proxy: {
            type: 'ajax',
            url: RP.buildDataServiceUrl("connect","cxf/frameworkservices/v1/messagestore/messages"),
            enablePaging: true,
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'count'
            },
            listeners: {
              exception: function(proxy, response, options){
                if(response.status === 400){
                  Ext.MessageBox.alert(RP.getMessage('dm.MessageStore.messages.error'), RP.getMessage('dm.MessageStore.messages.operationNotSupported'));
                }
                else if(response.status === 404){
                  console.log("No Records");
                  Ext.MessageBox.alert(RP.getMessage('dm.MessageStore.messages.alert'), RP.getMessage('dm.MessageStore.messages.noRecordsExists'));
                }
                else{
                  Ext.MessageBox.alert(RP.getMessage('dm.MessageStore.messages.error'), RP.getMessage('dm.MessageStore.messages.networkErrorTryLater'));
                }
              }
            }
        }
});