
Ext.define('JDA.dm.BusinessRules.model.RuleDetailsModel', {
    extend: 'Ext.data.Model',
    idProperty: 'resourceId',


    proxy: {
        type: 'rest',
        url: '',
        reader: {
            type: 'json',
            root: 'data'
        }
    },

    fields: [{
        name: 'resourceId',
        type: 'string'
    }, {
        name: 'addressId',
        type: 'string'
    }, {
        name: 'addressName',
        type: 'string'
    }, {
        name: 'addressLine1',
        type: 'string'
    }, {
        name: 'addressLine2',
        type: 'string'
    }]
}

);
