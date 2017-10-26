Ext.define('JDA.dm.MessageStore.model.StatusEventModel', {
    extend: 'Ext.data.Model',
    idProperty: 'adata',
    fields: ["timestampAsString", "status","versionId","attrributes.errors"],
    proxy:{
      type:'memory'
    }
});
