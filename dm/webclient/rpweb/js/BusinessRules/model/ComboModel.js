Ext.define('JDA.dm.BusinessRules.model.ComboModel', {
    extend: 'Ext.data.Model',
    idProperty: 'adata',
    fields: [{
        name: 'data',
        type: 'auto'
    }],
    proxy:{
      type:'memory'
    }
});
