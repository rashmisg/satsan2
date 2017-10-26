/**
Utility class to change history state
*/
Ext.define('Jda.ISL.Utils.HistoryUtil', {
  singleton: true,
  clearHistory: function() {
    // hack to disable tab switching on back press
    window.history.go(-(window.history.length - 1));
    ISL.app.getHistory().setActions([]);
    ISL.app.getHistory().setToken("");
  },
  addAction: function(route, controller) {
    console.log("history util add action");
    ISL.app.getHistory().add(Ext.create('Ext.app.Action', {
      url: route,
      controller: controller,
      application: ISL.app
    }), true);
  },
  goBack: function(flag) {
    console.log("history util go back");
    if (flag === undefined) {
      flag = true;
    }
    ISL.app.getHistory().back();
    var actions = ISL.app.getHistory().getActions();
    var url = '';
    if (actions.length > 0) {
      url = actions[actions.length - 1].getUrl();
    }
    ISL.app.getHistory().setToken(url);
    if (flag) {
      ISL.app.getHistory().fireEvent('change', flag);
    }
    window.history.go(actions.length - 1);
  }
});
