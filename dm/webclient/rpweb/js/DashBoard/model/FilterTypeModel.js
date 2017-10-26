Ext.define('JDA.dm.DashBoard.model.FilterTypeModel', {
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