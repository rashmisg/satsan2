Ext.define('Jda.ISL.Controller.Main', {
    extend: 'Jda.mobility.controller.NavigationController',

    config: {
      defaultRoute: 'tasklist',
        routes: {
            'tasklist': 'showView'
        },
        refs: {
            taskList: '#task-list',
            pullToRefreshContainer: '#pull-refresh-container'
        },
        control: {

          pullToRefreshContainer: {
            onbeforefetch: '_onBeforePullToRefresh',
            latestfetched: '_onPullRefresh'
    }
        },
        taskStore: null,
        timer:null,
        isExternalUpdateAlert: false,
        isNoTaskAlert: false,
        isUpdateInProgress: false,
        isNotified: false,
        isOnScreen : false,
        isRequestFired: false,
        taskNo: 1,
        isTaskResumed: false,
        urlQuery: '?fields=id%2C%20quantity%2C%20status%2C%20type%2C%20type_color%2C%20name%2C%20from_loc%2C%20priority%2C%20created&filter=status%20%3D%20open&order=priority%20desc%2C%20created%20asc'
    },

    init: function() {
      var me = this;
      this.setView(Ext.create('Jda.ISL.View.Main'));
      Jda.mobility.plugins.NotificationManager.addListener(Jda.mobility.constants.Notifications.REAUTH_SUCCESS_NOTIFICATION, function() {
        if(me.storeToReload) {
          me.storeToReload.load();
        }
        me.storeToReload = null;
      });
    },

    launch: function() {
      this.clearTimer();
      var me = this;
      document.addEventListener('resume', function() {
        console.log('show view resumed');
        me.setIsTaskResumed(true);
            me.showView();
        });
    },
    showView: function() {
      this.setIsOnScreen(true);
      console.log('show vieww');
      //this.showUpdateNotification();
      //Jda.mobility.plugins.NavigationBarComponentManager.changeTitle( 'title', this.getDefaultRoute());
      var me = this;
      Jda.mobility.plugins.PageContextManager.getUrlFromCpsAccount('refs', function(urlFromCpsAccount) {
          console.log(" urlFromCpsAccount :" + urlFromCpsAccount);
        if(urlFromCpsAccount.indexOf('127') === -1) {
            Jda.ISL.Util.DataService.urlFromCpsAccount = urlFromCpsAccount;
        }
        me.showTask();
      });
    },
    showUpdateNotification: function() {
      console.log('nav bar');
      if(this.getIsOnScreen() === true){
      if(this.getIsNotified() === false){
        this.isRequestFired = true;
        Jda.mobility.plugins.NavigationBarComponentManager.removeAllButtons(this.getDefaultRoute());
        Jda.mobility.plugins.NavigationBarComponentManager.addBarButton( this.showTask.bind(this), {
          type: Jda.mobility.plugins.NavigationBarComponentManager.types.icon,
          iconPath: 'notification.png',
          location: Jda.mobility.plugins.NavigationBarComponentManager.locations.right },
             this.getDefaultRoute());
             this.setIsNotified(true);
      }
    }
    },
    showTask: function() {
      console.log('Taskkkk list');
      if(this.getIsUpdateInProgress()) {
        return;
      }
      this.setIsUpdateInProgress(true);
      this.setViewportActiveItem();
      Ext.Ajax._defaultHeaders = Jda.ISL.Util.DataService.getRequestHeader();
      var url = Jda.ISL.Util.DataService.getTasksUrl() + this.getUrlQuery();
      var reqHdr = Jda.ISL.Util.DataService.getRequestHeader();
      console.log(url + " :: " + reqHdr);
      var me = this;
      var callback = function(records, operations, success) {
        this.setIsUpdateInProgress(false);
        if (success) {
          if(records.data.items.length === 0) {
            //No Tasks exists
            this.getTaskList().refresh();

            Ext.defer(function(){
              if(!this.getIsNoTaskAlert()) {
                this.setIsNoTaskAlert(true);
                Jda.mobility.plugins.DialogManager.alert({
                message: "No tasks exist",
                callback: function() {
                  me.setIsNoTaskAlert(false);
                }
              });
              }
            }, 500, this);
                      }
          console.log("List populated");
          me.getTaskList().addListener('itemtap', me._selectTask, me, {single: true});
          this.checkOpenTaskStatus();
          //this.getPullToRefreshContainer().getScrollable().getScroller().scrollToTop();
        } else {
          Jda.mobility.plugins.LoadingMaskManager.hideLoadingMask();
          console.log("failure");
        }
      };

      if (!this.getTaskStore()) {
        this.setTaskStore(Ext.create('Jda.ISL.Store.TaskStore'));
        this.getTaskStore().on('load', callback, this);
      }

      this.getTaskList().setStore(this.getTaskStore());
      this.getPullToRefreshContainer().setStore(this.getTaskStore());
      this.getTaskStore().getProxy().setUrl(url);
      this.getTaskStore().load();
      this.setIsOnScreen(true);
      console.log("store loading");
      this.removeUpdateNotification();

    },

    _selectTask: function( context, index, target, record, e, eOpts ) {
      console.log('open task task tap');
      this.setIsTaskResumed(true);
        this.clearTimer();
        this.setIsOnScreen(false);
        console.log("TASK selected");
        console.log("Selected " + index + "\n Type is : " + record.data.sku);
        console.log("Selected " + index + "\n Type is : " + record.data.id);
        var config = {};
        // config.route = "taskdetails";
        config.recordID = record.data.id;
        config.taskStore = this.getTaskStore();
        this.pushController('Jda.ISL.Controller.TaskDetails', config);
    },
    clearTimer: function() {
    if(this.getTimer() !== null) {
      clearInterval(this.getTimer());
      this.setTimer(null);
    }
  },

  checkOpenTaskStatus: function() {
      var tempTimer = setInterval(function() {
      var me = this;
      var url = Jda.ISL.Util.DataService.getTasksUrl() + this.getUrlQuery();
        if(!me.isRequestFired) {
          console.log('open check request fired');
          me.isRequestFired = true;
          Ext.Ajax.request({
          url: url,
          method: 'GET',
          timeout: Jda.ISL.Utils.Constants.AJAX_TIMEOUT,
          success: function(conn, response, options, eOpts) {
              console.log('open is on screen'+me.getIsOnScreen());
            if(!me.getIsOnScreen()) {
              console.log('open is not on screen');
              return;
            } else if(me.getIsTaskResumed()){
              console.log('open task resume');
              me.setIsTaskResumed(false);
              me.isRequestFired = false;
              me.checkOpenTaskStatus();
              return;
            }
          console.log('open task check sucess'+me.getTaskNo());
          me.setTaskNo(me.getTaskNo()+1);
          me.isRequestFired = false;
            var data = Ext.decode(conn.responseText);
            var openTasks = [];

              for(var i = 0; i < data.resource.length; i++){
                  //console.log('open task loop');
                var task = {};
                if(data.resource[i].status === 'open'){
                  task.id = data.resource[i].id;
                  task.status = data.resource[i].status;
                  openTasks.push(task);
                }

                for(var j = 0; j< me.getTaskStore().data.items.length; j++){
                  if(data.resource[i].id == me.getTaskStore().data.items[j].raw.id){
                    if(data.resource[i].status !== me.getTaskStore().data.items[j].raw.status){

                      console.log('change list1'+data.resource[i].status +me.getTaskStore().data.items[j].raw.status);
                      //  me.setIsExternalUpdateAlert(true);
                        //me.showDialog(me);
                        me.showUpdateNotification();
                        return;
                }
                else if(data.resource[i].priority !== me.getTaskStore().data.items[j].raw.priority){
                  console.log('change list priority'+data.resource[i].priority +me.getTaskStore().data.items[j].raw.priority);
                    me.showUpdateNotification();
                    return;
                }
              }
            }
          }

            if(openTasks.length !== me.getTaskStore().data.items.length){
              console.log('open task length not matching'+me.getTaskNo()+'length'+openTasks.length +me.getTaskStore().data.items.length);
              me.showUpdateNotification();
            }

          me.updateTimeElapsed();
        },
        failure: function(conn, response, options, eOpts) {
           console.log('Task Status', 'Data request failure');
           me.isRequestFired = false;
           me.updateTimeElapsed();
        }
    });
    }
  }.bind(this), 5000);
  this.setTimer(tempTimer);
  },
  showDialog: function(me){
    var mee = me;
    Jda.mobility.plugins.DialogManager.alert({
       message: Jda.getMessage('jda.ISL.taskListUpdatedExternally'),
       callback: function() {
         //mee.setIsExternalUpdateAlert(false);
         //mee.showTask();
         mee.showUpdateNotification();
       }
    });
  },

  updateTimeElapsed: function() {
    this.getTaskList().refresh();
  },

_onBeforePullToRefresh: function () {
  console.log('on before pull');
// Ext.getStore('taskStore').removeAll();
},

_onPullRefresh: function () {
  console.log('on pull');
 this.showTask();
},
removeUpdateNotification: function(){
console.log('Remove nav bar');
Jda.mobility.plugins.NavigationBarComponentManager.removeAllButtons(this.getDefaultRoute());
this.isRequestFired = false;
this.setIsNotified(false);
}

});
