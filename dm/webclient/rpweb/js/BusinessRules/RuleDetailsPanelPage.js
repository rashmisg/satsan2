Ext.define('JDA.dm.BusinessRules.RuleDetailsPanelPage', {
    extend: 'RP.mvc.QuickApp',
    namespace: 'JDA.dm.BusinessRules',
    controllers: ['RuleDetailsPanelController'],
    mainView: 'RuleDetailsPanel',

    closeable: true,
    fullScreen: false,
    layout:{
      type:'auto',
      align:'fit'
    },

    title: 'Rule Details', //TODO: localization

    initComponent: function() {
        this.on('close', this.onClose, this);
        this.callParent(arguments);
    },

    configure: function(config) {
        this.getController().configure(config);
    },

    getController: function() {
        return this.applet.getController('RuleDetailsPanelController');
    }
});
