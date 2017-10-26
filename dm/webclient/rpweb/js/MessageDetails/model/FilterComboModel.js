Ext.define('JDA.dm.MessageDetails.model.FilterComboModel', {
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
