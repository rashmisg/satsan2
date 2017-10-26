
Ext.define('JDA.dm.IntegrationDashboard.model.IntegrationDashboarGridModel', {
    extend: 'Ext.data.Model',
     fields: []
}
);

Ext.define('JDA.dm.IntegrationDashboard.model.IntegrationDashboardModel', {
    extend: 'Ext.data.Model',
    // idProperty: 'resourceId',
    fields: [{
      name:'count'
    },
    {
      name:'DisplayBy'
    }
  ]
}
);

Ext.define('JDA.dm.IntegrationDashboard.store.IntegrationDashboardStore',{
  extend:'Ext.data.Store',
  storeId:'IntegrationDashboardStore',
  model: 'JDA.dm.IntegrationDashboard.model.IntegrationDashboardModel',
  autoLoad: true,
  proxy: {
            type: 'memory',
           
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'count'
            }
        }
});

Ext.define('JDA.dm.IntegrationDashboard.store.IntegrationDashboardPanelStore',{
  extend:'Ext.data.Store',
  storeId:'IntegrationDashboardPanelStore',
  model: 'JDA.dm.IntegrationDashboard.model.IntegrationDashboarGridModel',
  autoLoad: true,
  //cxf/frameworkservices/messagestore/messages?page[offset]=0&page[limit]=5 
  proxy: {
            type: 'memory',
           
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'count'
            }
        }
});


