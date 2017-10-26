Ext.define('JDA.dm.MessageStore.MessageStoreSummaryPage', {
    extend: 'RP.mvc.QuickApp',
    namespace: 'JDA.dm.MessageStore',
    controllers: ['MessageStoreSummaryController'],
    views: [
        'MessageStoreSummary'
    ],
    mainView: 'MessageStoreSummary',
    preventHeader: true,
    closeable: true,
    fullScreen: false,

    title: 'Message Store Summary',

    initComponent: function() {
        // this.on('close', this.onClose, this);
        this.callParent(arguments);
    }
});
