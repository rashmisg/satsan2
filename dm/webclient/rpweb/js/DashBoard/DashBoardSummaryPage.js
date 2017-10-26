Ext.define('JDA.dm.DashBoard.DashBoardSummaryPage', {
    extend: 'RP.mvc.QuickApp',
    namespace: 'JDA.dm.DashBoard',
    controllers: ['DashBoardSummaryController'],
    views: [
        'DashBoardSummary'
    ],
    mainView: 'DashBoardSummary',
    preventHeader: true,
    closeable: true,
    fullScreen: false,

    title: 'DashBoard Summary',

    initComponent: function() {
        // this.on('close', this.onClose, this);
        this.callParent(arguments);
    },

    configure: function(config) {
        this.getController().configure(config);
    },

    getController: function() {
        return this.applet.getController('DashBoardSummaryController');
    }
});
