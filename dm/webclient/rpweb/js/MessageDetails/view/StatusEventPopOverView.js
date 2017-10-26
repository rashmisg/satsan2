Ext.define('JDA.dm.MessageStore.view.StatusEventPopOverView',{
	extend: 'Ext.Panel',
	xtype: 'grid',
    title: 'Status Events',
    messageId: null,
    store: Ext.create('Ext.data.Store', {
        fields: ["timestampAsString", "status","versionId","attrributes.errors"],
        autoLoad: 'true',
        proxy: {
            type: 'ajax',
            url: RP.buildDataServiceUrl("connect", "cxf/frameworkservices/v1/messagestore/messages/" + this.messageId),
            reader: {
                type: 'json',
                root: 'data.attributes.StatusEvents'  // setting root to Status events
            }
        }
    }),
    columnLines: true,
    align: 'center',
    pack: 'center',
    forcefit: true,
    width: 800,
    height: 600,
    autoScroll: true,
    columns: [{
        dataIndex: 'status',
        text: 'Message Status',
        sortable: false,
        flex: 0.8
    },{
        dataIndex: 'timestampAsString',
        text: 'Time Stamp',
        flex: 1.5
    }, {
        dataIndex: 'versionId',
        text: 'Version Id',
        flex: 0.6
    }, {
        dataIndex: 'attrributes.errors',
        text: 'Errors',
        sortable: false,
        flex: 1.2
    }],
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            margin: '2 2 2 2',
            frame: true,
            defaults : {
                padding : '15px'
            },
            items: [{
                xtype: 'displayfield',
                fieldLabel: '<strong>Message Id</strong>',
                value: this.messageId,
                flex: 1.5
            }, {
                xtype: 'displayfield',
                fieldLabel: 'Format Type',
                // value: res.data.attributes.FormatType,
                flex: 1

            }, {
                xtype: 'displayfield',
                fieldLabel: 'Created Date',
                // value: me.formatDate(res.data.attributes.CreatedTimestamp),
                flex: 2
            }]
        }
    ]

});