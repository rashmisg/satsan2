Ext.define('JDA.dm.BusinessRules.store.RuleTypeComboStore',{
  extend:'Ext.data.Store',
  model:'JDA.dm.BusinessRules.model.ComboModel',
  id:'RuleTypeCombo',
  proxy:{
    type:'memory'
  },
  data:[
    {data:RP.getMessage('dm.BusinessRules.messages.validate')}
    /*,
    {data:RP.getMessage('dm.BusinessRules.messages.update')},
    {data:RP.getMessage('dm.BusinessRules.messages.filter') }*/
]
});
