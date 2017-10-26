Ext.define('Jda.ISL.View.PullToRefreshContainer', {
  extend: 'Ext.Container',
  alias: 'widget.pullToRefreshContainer',

  config: {
    /* The store that is reloaded on pull */
    store: null,
    scrollable: true,
    plugins: [{
      xclass: 'Jda.ISL.Utils.Plugins.PullToRefresh'
    }]
  }
});
