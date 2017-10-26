Ext.define('JDA.dm.MessageStore.store.StatusEventStore',{
  extend:'Ext.data.Store',
  storeId:'StatusEventStore',
  model: 'JDA.dm.MessageStore.model.StatusEventModel', 
  autoLoad: true,  
  //cxf/frameworkservices/messagestore/messages?page[offset]=0&page[limit]=5 
  proxy: {
            type: 'ajax',
            // url: RP.buildDataServiceUrl("connect","cxf/frameworkservices/v1/messagestore/messages"),
            enablePaging: true,
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'count'
            }
        }
});