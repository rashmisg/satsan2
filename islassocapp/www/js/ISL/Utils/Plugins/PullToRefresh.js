/* This companent extends from sencha's pull to refresh for list
  and extends the functionality a container.

  For ease of use in views, there is a container component 'PullToRefreshContainer'
  that can be used for the view.
  'PullToRefreshContainer' makes sure the view is scrollable and automatically adds this plugin to view.

  The view this plugin resides in(PullToRefreshContainer if you are using it) should set a store, that will be reloaded on pull and release of view.
  The view this pluging resided in should be scrollable vertically.

  On before fetch, 'onbeforefetch' event is fired.
  Once the store is reloaded, 'latestfetched' event is fired.
*/

Ext.define('Jda.ISL.Utils.Plugins.PullToRefresh', {
  extend: 'Ext.plugin.PullRefresh',
  alias: 'plugin.pullrefreshpanel',

  config: {
    snappingAnimationDuration: 150,
    pullRefreshText: 'Pull to refresh',
    scrollerAutoRefresh: true,
    lastUpdatedDateFormat: 'x' //"MM/dd/yyyy hh:mm:ss tt"
  },


  init: function(list) {
    if ((this.isList = list.getStore ? true : false) === true) {
      this.setList(list);
      this.scrollable = list.getScrollable().getScroller();
      return this.callParent(arguments);
    }
  },

  fetchLatest: function() {
    if (this.isList === true) {
      this.getList().fireEvent('onbeforefetch', this);
    //  this.getList().getStore().removeAll(false);
      return this.callParent(arguments);
    }
  },

  /* This is overridden to change sencha default behaviour.
     We dont need records to be appeneded to list, we need the list to be recreated.
  */
  onLatestFetched: function(operation) {
    var store = this.getList().getStore();
    if(operation.success === false) {
      if(operation.error.status === 401) {
        TMUser.app.getController('Jda.ISL.Controller.Main').storeToReload = store;
      }
    }

    this.lastUpdated = new Date();
    var newRecords = operation.getRecords();
    store.removeAll();
    store.insert(0, newRecords);

    // Call the callback fn
    if (Ext.isFunction(this.getList().onPullRefresh)) {
      this.getList().onPullRefresh.call(this.getList(), newRecords);
    }

    this.getList().fireEvent('latestfetched', this, newRecords);
    if (this.getAutoSnapBack()) {
      this.snapBack(true);
    }
    this.setState("loaded");
  }
});
