Ext.define('JDA.dm.DashBoard.store.FilterTypeStore',{
  extend:'Ext.data.Store',
  id:'FilterType',
  model:'JDA.dm.DashBoard.model.FilterTypeModel',
  data:[
    {data:'Status'},
    {data:'Type'}
  ]
});

Ext.define('JDA.dm.DashBoard.store.PeriodStore',{
  extend:'Ext.data.Store',
  id:'PeriodStore',
  model:'JDA.dm.DashBoard.model.FilterTypeModel',
  data:[
    {data:'Last 24 hrs'},
    {data:'Last 48 hrs'}
  ]
});

Ext.define('JDA.dm.DashBoard.store.ViewStore',{
  extend:'Ext.data.Store',
  id:'ViewStore',
  model:'JDA.dm.DashBoard.model.FilterTypeModel',
  data:[
    {data:'Status'},
    {data:'Direction'}
  ]
});

Ext.define('JDA.dm.DashBoard.store.GroupByStore',{
  extend:'Ext.data.Store',
  id:'GroupByStore',
  model:'JDA.dm.DashBoard.model.FilterTypeModel',
  data:[
    {data:'System'},
    {data:'MessageType'}
  ]
});
