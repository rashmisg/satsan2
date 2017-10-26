Ext.define('Jda.ISL.Util.DataService', {
    singleton: true,
    useProxy: false, // For tj developers to access proxy just change this parameter to true but DONOT commit
    urlFromCpsAccount: null,

    getBaseUrl: function() {
    //  console.log("get base url");
      var baseUrl;
      // baseUrl = "http://wi1npdci02.dev.corp.local";
      // var baseUrl =  "http://services-useast.skytap.com:17706"; //QA Environment
      if(this.urlFromCpsAccount === null) {
        baseUrl = "http://wi1npdci02.dev.corp.local";
      //  console.log("get base url : 1 " +baseUrl);
      } else {
        baseUrl = this.urlFromCpsAccount;
        baseUrl = baseUrl.substring(0, baseUrl.length - 1);
        //console.log("get base url : 2 " +baseUrl);
      }
      if(Jda.ISL.Util.DataService.useProxy) {
        baseUrl = "http://64.26.204.102:81";
      }
      return baseUrl;
    },

    getRequestHeader: function() {
      var baseUrl = Jda.ISL.Util.DataService.getBaseUrl();
      console.log("check"+Jda.ISL.Utils.Constants.apikey);
      var reqHdr = {
        "X-DreamFactory-Api-Key": Jda.ISL.Utils.Constants.apikey
      };
      return reqHdr;
    },

    getTasksUrl: function() {
      var taskUrl = Jda.ISL.Util.DataService.getBaseUrl() + '/api/v2/isl/_table/tasks';
      return taskUrl;
    },

    getOpenTaskUrl: function(taskId) {
      var openTaskUrl = Jda.ISL.Util.DataService.getBaseUrl() + '/api/v2/isl/_table/tasks/' + taskId + '?id_field=id';
      return openTaskUrl;
    },

    showSyncFailure :function(){
      Jda.Cage.DialogManager.alert({ message: RP.getMessage('jda.ISL.errormessages.datarequestfailure') });
      Jda.Cage.LoadingMaskManager.hideLoadingMask();
    }
});
