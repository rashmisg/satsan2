Ext.define('JDA.dm.MessageDetails.MessageDetailsSummaryPage', {
    extend: 'RP.mvc.QuickApp',
    namespace: 'JDA.dm.MessageDetails',
    controllers: ['MessageDetailsSummaryController'],
    views: [
        'MessageDetailsSummary'
    ],
    mainView: 'MessageDetailsSummary',
    preventHeader: true,
    closeable: true,
    fullScreen: false,

    title: 'Message Details Summary',

    initComponent: function() {
        // this.on('close', this.onClose, this);
        this.callParent(arguments);
    }
});
