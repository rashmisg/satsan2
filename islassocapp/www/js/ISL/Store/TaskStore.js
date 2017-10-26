Ext.define('Jda.ISL.Store.TaskModel', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['id', 'type', 'type_color','sku', 'quantity', 'from_loc', 'to_loc', 'status', 'created', 'priority', 'description', 'name']
    }
});

Ext.define('Jda.ISL.Store.TaskStore', {
    extend: 'Ext.data.Store',
    config: {
        model: 'Jda.ISL.Store.TaskModel',
        proxy: {
            type: 'ajax',
            timeout: Jda.ISL.Utils.Constants.AJAX_TIMEOUT,
            enablePagingParams: false,
            reader: {
                type: 'json',
                rootProperty: 'resource'
            }
        }
    }
});
