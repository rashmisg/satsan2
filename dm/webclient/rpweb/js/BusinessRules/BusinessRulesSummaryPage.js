Ext.define('JDA.dm.BusinessRules.BusinessRulesSummaryPage', {
    extend: 'RP.mvc.QuickApp',
    namespace: 'JDA.dm.BusinessRules',
    controllers: ['BusinessRulesSummaryController'],
    views: [
        'BusinessRulesSummary'
    ],
    mainView: 'BusinessRulesSummary',
    preventHeader: true,
    closeable: true,
    fullScreen: false,

    title: 'Business Rules Summary',

    initComponent: function() {
        // this.on('close', this.onClose, this);
        this.callParent(arguments);
    },

    configure: function(config) {
        this.getController().configure(config);
    },

    getController: function() {
        return this.applet.getController('BusinessRulesSummaryController');
    }
});
