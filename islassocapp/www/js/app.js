Ext.Loader.setConfig({
    disableCaching: false
});

Ext.Loader.setPath({
    'Jda': '.'
});

Ext.application({
    name: 'ISL',

    watch: null,
    RippleService: null,

    viewport: {
        layout: 'card'
    },

    controllers: [ 'Jda.ISL.Controller.Main'],

    launch: function() {
        var me = this;
        ISL.app.RippleService = new Jda.ISL.Libs.RippleService();
        console.log(me.RippleService);
        Jda.mobility.plugins.LoadingMaskManager.hideLoadingMask();
    }
});
