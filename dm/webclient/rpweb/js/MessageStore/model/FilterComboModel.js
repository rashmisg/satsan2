Ext.define('JDA.dm.MessageStore.model.FilterComboModel', {
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
