
Ext.define('JDA.dm.BusinessRules.model.BusinessRulesSummaryModel', {
    extend: 'Ext.data.Model',
    idProperty: 'resourceId',
    fields: [{
      name:'name',
      type:'string'
    },{
        name: 'type',
        type: 'string'
    }, {
        name: 'isActive',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
      name: 'id',
      type: 'string'
      },{
        name: 'description',
        type: 'string'
      },{
        name:'isHard',
        type:'string'
      },{
        name:'effectiveFromDate',
        type:'string'
      },{
        name:'effectiveToDate',
        type:'string'
      },{
        name :'script',
        type : 'string'
      },{
        name : 'model',
        type : 'string'
      },{
        name : 'message',
        type : 'string'
      }]
}
);

Ext.define('JDA.dm.BusinessRules.store.BusinessRulesSummaryStore',{
  extend:'Ext.data.Store',
  storeId:'BusinessRulesSummaryStore',
  config: {
  model: 'JDA.dm.BusinessRules.model.BusinessRulesSummaryModel'
  },
  proxy: {
            type: 'ajax',
            url: RP.buildDataServiceUrl("connect","cxf/datamanagement/v1/rule"),
            enablePaging: true,
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'count'
            }
      
    }
});