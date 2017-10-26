Ext.define('JDA.dm.IntegrationDashboard.IntegrationDashboardSummaryPage', {
    extend: 'RP.mvc.QuickApp',
    namespace: 'JDA.dm.IntegrationDashboard',
    controllers: ['IntegrationDashboardController'],
    views: [
        'IntegrationDashboardView'
    ],
    mainView: 'IntegrationDashboardView',
    preventHeader: true,
    closeable: true,
    fullScreen: false,

    title: 'Integration Dashboard',

    initComponent: function() {
        // this.on('close', this.onClose, this);
        this.callParent(arguments);
    },

    configure: function(config) {
        this.getController().configure(config);
    },

    getController: function() {
        return this.applet.getController('IntegrationDashboardController');
    }
});
