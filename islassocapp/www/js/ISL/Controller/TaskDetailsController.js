Ext.define('Jda.ISL.Controller.TaskDetails', {
  extend: 'Jda.mobility.controller.NavigationController',

  config: {
    defaultRoute: 'taskdetails',
    routes: {
      'taskdetails': 'showView'
    },
    eventPublishers: {
      touchGesture: {
        recognizers: {
          swipe: {
            //this will include both vertical and horizontal swipe recognisers
            xclass: 'Ext.event.recognizer.Swipe'
          }
        }
      }
    },
    refs: {
      exceptionMenu: '#exception-menu-sheet',
      doneButton: '#task-done-button',
      okButton: '#task-ok-button',
      taskExpiredLabel: '#task-exipred-label',
      taskListButton: '#task-list-button',
      scanButton: '#task-scan-button',
      exceptionButton: '#task-exception-button',
      toLoc: '#to-booth',
      fromLoc: '#from-booth',
      floorLocation: '#floor-planogram-container',
      taskTopContainer: '#task-top-container',
      taskBottomContainer: '#task-bottom-container',
      floorplan: '#floorplan',
      planogram: '#planogram',
      taskDetailView: '#task-detail-view',
      greenBar: '#booth-green',
      orangeBar: '#booth-orange'
    },
    control: {
      taskListButton: {
        tap: 'onTaskListButtonTapped'
      },
      doneButton: {
        tap: 'onDoneButtonTapped'
      },
      okButton: {
        tap: 'onOkButtonTapped'
      },
      scanButton: {
        tap: 'onScanButtonTapped'
      },
      exceptionButton: {
        tap: 'onExceptionButtonTapped'
      },
      toLoc: {
        tap: 'onToLocationTapped'
      },
      fromLoc: {
        tap: 'onFromLocationTapped'
      },
      floorplan: {
        tap: 'onFloorplanTapped'
      },
      planogram: {
        tap: 'onPlanogramTapped'
      },
      taskDetailView: {
        initialize: 'onTaskDetailSwipe'
      }
    },
    taskDetailsStore: null,
    taskDetail: null,
    isRecursiveCall: false,
    timer: null,
    messageTimer: null,
    recordID: null,
    taskStore: null,
    isExternalUpdateAlert: false,
    selectedBooth: null,
    isFloorplanSelected: true,
    popover: null,
    taskName: null,
    scrollerConfig: {
      direction: 'vertical',
      directionLock: true,
      momentumEasing: {
        momentum: {
          acceleration: 30,
          friction: 0.5
        },
        bounce: {
          acceleration: 0.0001,
          springTension: 0.9999
        },
        minVelocity: 5
      },
      outOfBoundRestrictFactor: 0
    },
    messageSet:[
      "Alright!",
      "Excellent!",
      "Good Going!",
      "Great Job!",
      "Nice Work!",
      "Right On!",
      "Terrific!",
      "Way to Go!",
      "Well Done!",
      "Very Nice!"
    ],
    exceptionMessageSet:[
      "All Right",
      "Cheers",
      "Cool",
      "Groovy",
      "Thanks"
    ]
  },

  init: function() {
    this.setView(Ext.create('Jda.ISL.View.TaskDetailsView'));
    var th = window.innerHeight/1.7;
    var lh = (window.innerHeight - th)/1.3;
    console.log('location height ' + lh + 'top height ' + th);
    this.getTaskTopContainer().setHeight(th);
    this.getView().down('#itemlocation').setHeight(lh);
    this.getTaskBottomContainer().setHeight(window.innerHeight - (th + lh));
    this.getFloorLocation().setHeight(window.innerHeight - lh);
  },

  showView: function() {
    this.setViewportActiveItem();
    this.setIsRecursiveCall(false);
    this.getLatestTask();
    this.removeUpdateNotification();
  },

  launch: function() {
    var me = this;
    document.addEventListener('resume', function() {
      me.clearTimer();
      // me.getLatestTask();
    });
    if (this.getRecordID()) {
      me.getLatestTask();
    }
    Jda.ISL.Utils.HistoryUtil.addAction("taskdetails", this);  // Android Back button issue fix
    console.log("task details added action");
    ISL.app.getHistory().on('change', this._localHandleBack, this);  // Android Back button issue fix
    console.log("task details added change listener");
  },

  // Android Back button issue fix
  _localHandleBack: function() {
    console.log("task details local handle back : " + this.getDefaultRoute());
    console.log("task details local handle back : " + ISL.app.getHistory().getToken() );
    if( (this.getDefaultRoute() === ISL.app.getHistory().getToken()) ) { // if "route" at the top of navigation stack (history) matches this controller's defaultRoute
      console.log("inside if of taskdetails->localhandle back");
      // var parent = this.getPresentingController();
      // console.log("presenting controller : " + parent);
      // if(parent) {
      //   console.log("if parent");
      //   parent.popController();
      //   // Jda.ISL.Utils.HistoryUtil.clearHistory();
      // }
      this.onTaskListButtonTapped({fromBackBtn:'true'});
      // Kill any popovers
      this.hidePopover();
    }
  },


  clearTimer: function() {
    if (this.getTimer() !== null) {
      clearInterval(this.getTimer());
      this.setTimer(null);
    }
  },

  checkOpenTaskStatus: function(taskId) {
      var tempTimer = setInterval(function() {
        var me = this;
        var url = Jda.ISL.Util.DataService.getOpenTaskUrl(taskId);
        Ext.Ajax.request({
          url: url,
          method: 'GET',
          timeout: Jda.ISL.Utils.Constants.AJAX_TIMEOUT,
          success: function(conn, response, options, eOpts) {
            me.updateElapsedTime();
            var data = Ext.decode(conn.responseText);
            if (data.status == 'closed') {
              me.clearTimer();
              me.setRecordID(null);
              me.setIsRecursiveCall(false);
              if (!me.getIsExternalUpdateAlert()) {
                me.showUpdateNotification();
                me.setIsExternalUpdateAlert(true);
              }
              Jda.mobility.plugins.LoadingMaskManager.hideLoadingMask();
            }
          },
          failure: function(conn, response, options, eOpts) {
            console.log('Task Status', 'Data request failure');
            Jda.ISL.Util.DataService.showSyncFailure();
          }
        });
      }.bind(this), 5000);
      this.setTimer(tempTimer);
  },

  onOkButtonTapped: function() {
    this.setIsExternalUpdateAlert(false);
    this.hidePopover();
    //this.onTaskListButtonTapped(null);
    // this.getTaskExpiredLabel().setHtml('');
    var msg = this.getRandomMessage(false);
    this.showMessageView(msg);
    this.removeUpdateNotification();
  },

  showUpdateNotification: function() {
    var me = this;
    me.getOkButton().setHidden(false);
    me.getDoneButton().setHidden(true);
    me.getTaskExpiredLabel().setHtml('Task Expired');
    me.getExceptionButton().setDisabled(true);
    me.getScanButton().setDisabled(true);
    var buttonConfig = {
      type: Jda.mobility.plugins.NavigationBarComponentManager.types.icon,
      iconPath: 'notification.png',
      location: Jda.mobility.plugins.NavigationBarComponentManager.locations.right
    };
    Jda.mobility.plugins.NavigationBarComponentManager.removeAllButtons(this.getDefaultRoute());
    Jda.mobility.plugins.NavigationBarComponentManager.addBarButton( me.onOkButtonTapped.bind(me), buttonConfig, this.getDefaultRoute());
      //this.setIsNotified(true);
  },

  updateElapsedTime:function() {

    var datetime = this.getTaskDetail().created;
    console.log("Time in task details : " + datetime);
    var d = new Date(datetime);
    // get current system date
    var now = new Date();
    // Convert current system date time to UTC
    var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    // Use UTC converted time to calculate the time difference
    var timeElapsed = Jda.ISL.Util.TimeUtil.timeDifference(now_utc.getTime(), d.getTime());

    var time = document.getElementById("timeElapsed");
    if(time) {
      time.innerHTML = "" + timeElapsed;
    }

  },
  getLatestTask: function() {
    var me = this;
    var url = Jda.ISL.Util.DataService.getTasksUrl();
    var params = {
      filter: 'status=open',
      limit: 1,
      order: 'created desc'
    };
    if (me.getRecordID()) {
      me.clearTimer();
      url = url + "/" + me.getRecordID() + "?id_field=id";
      params = {};
      console.log("URL : " + url);
    }
    Jda.mobility.plugins.LoadingMaskManager.showLoadingMask();
    Ext.Ajax._defaultHeaders = Jda.ISL.Util.DataService.getRequestHeader();
    Ext.Ajax.request({
      url: url,
      method: 'GET',
      params: params,
      timeout: Jda.ISL.Utils.Constants.AJAX_TIMEOUT,
      success: function(conn, response, options, eOpts) {
        var data = Ext.decode(conn.responseText);
        console.log("response : " + data);
        var resource = data.resource;
        if (Object.prototype.toString.call(data) === '[object Object]' && me.getRecordID()) {
          resource = data;
        }
        var detail = {
          "id": 0,
          "type": "",
          "type_color": "",
          "sku": "",
          "name": "",
          "color": "",
          "size":"",
          "quantity": "",
          "from_loc": "",
          "from_section": "",
          "to_loc": "",
          "to_section": "",
          "status": "",
          "created": "",
          "product_data_uri":"",
          "floor_data_uri":"",
          "plan_data_uri":"",
          "isHide": false
        };
        if ((Object.prototype.toString.call(resource) === '[object Object]' && me.getRecordID()) || (Object.prototype.toString.call(resource) === '[object Array]' && resource.length)) {
          if (me.getIsRecursiveCall()) {
            me.setIsRecursiveCall(false);
            Jda.mobility.plugins.DialogManager.alert({
              message: "Task updated"
            });
            me.setIsRecursiveCall(false);
          }

          var details = null;
          if (Object.prototype.toString.call(resource) === '[object Object]') {
            details = resource;
          } else {
            details = resource[0];
          }
          console.log("Details : " + details.id);
          var from_loc = details.from_loc || "";
          var split_from_loc = from_loc.split("|");
          var to_loc = details.to_loc || "";
          var split_to_loc = to_loc.split("|");

          var qtyName = details.quantity + " " + details.name;

          detail = {
            "id": details.id,
            "type": details.type,
             "type_color": details.type_color,
            "sku": details.sku,
            "name": qtyName,
            "color": details.color,
            "size": details.size,
            "quantity": details.quantity,
            "from_loc": split_from_loc[0],
            "from_section":split_from_loc[1],
            "to_loc": split_to_loc[0],
            "to_section":split_to_loc[1],
            "status": details.status,
            "created": details.created,
            "product_data_uri":details.product_data_uri,
            "floor_data_uri":details.floor_data_uri,
            "plan_data_uri":details.plan_data_uri,
            "isHide": false
          };
          me.setTaskDetail(detail);
          me.setTaskName(details.name);
          console.log('task details :' + detail);
          me.getView().down('#typebar').setData(detail);
          me.getView().down('#itemdetails').setData(detail);
          me.getView().down('#itemlocation').down('#from').setData(detail);
          me.getView().down('#itemlocation').down('#to').setData(detail);
          Jda.ISL.Util.ImageUtil.getRestockItemImage(details.sku, function(url) {
            console.log(url);
            // me.getView().down('#itemImage').setSrc(url);
            me.getView().down('#itemImage').setSrc(detail.product_data_uri);
          });
          me.getDoneButton().setDisabled(false);
          me.getDoneButton().setCls(['task-detail-done-button', 'shadow']);
          me.checkOpenTaskStatus(detail.id);
        } else {

          if (me.getIsRecursiveCall()) {
            Jda.mobility.plugins.DialogManager.alert({
              message: "Task updated. No open tasks."
            });
            me.setIsRecursiveCall(false);
          } else {
            Jda.mobility.plugins.DialogManager.alert({
              message: "No open tasks"
            });
          }
          me.setTaskDetail(detail);
          me.getView().down('#typebar').setData(detail);
          me.getView().down('#itemdetails').setData(detail);
          me.getView().down('#itemlocation').down('#from').setData(detail);
          me.getView().down('#itemlocation').down('#to').setData(detail);
          me.getDoneButton().setDisabled(true);
          me.getDoneButton().setCls("task-detail-done-button-disabled");
          me.clearTimer();
        }
        me.setColorBarOnType();
        Jda.mobility.plugins.LoadingMaskManager.hideLoadingMask();
      },
      failure: function(conn, response, options, eOpts) {
        me.setRecordID(null);
        console.log('Task detail', 'Data request failure');
        Jda.mobility.plugins.LoadingMaskManager.hideLoadingMask();
      }
    });
  },

  onDoneButtonTapped: function(button) {
    var msg = this.getRandomMessage(false);
    this.showMessageView(msg);
//     var me = this;
//     me.clearTimer();
//     var details = me.getTaskDetail();
//     details.status = 'closed';
//     details.name = me.getTaskName();
//     var url = Jda.ISL.Util.DataService.getTasksUrl();
//     Jda.mobility.plugins.LoadingMaskManager.showLoadingMask();
//     Ext.Ajax.request({
//       url: url,
//       method: 'PUT',
//       jsonData: {
//         resource: [details]
//       },
//       timeout: Jda.ISL.Utils.Constants.AJAX_TIMEOUT,
//       success: function(conn, response, options, eOpts) {
//         var data = Ext.decode(conn.responseText);
//         var resource = data.resource;
// //         if (Object.prototype.toString.call(resource) === '[object Array]' && resource.length) {
//           // me.setIsRecursiveCall(true);
//           // me.getLatestTask();
// //           Jda.mobility.plugins.DialogManager.alert({
// //             message: "Task updated",
// //             callback: function () {
// //                 me.onTaskListButtonTapped(null); //Move to tasklist on click of done
// //             }
// //           });
// //         }
//         me.onTaskListButtonTapped(null);
//         Jda.mobility.plugins.LoadingMaskManager.hideLoadingMask();
//       },
//       failure: function(conn, response, options, eOpts) {
//         console.log('Task detail', 'Data update request failure');
//         Jda.mobility.plugins.LoadingMaskManager.hideLoadingMask();
//       }
//     });
  },
  onTaskListButtonTapped: function(button) {
    console.log("onTaskListButtonTapped");

    if(button === null) {
      window.history.go(-1);
    }
    var me = this;
    var config = {};
    if (Ext.os.is('Android')) {
      config.route = "main";
    }
    var taskListCtr = this.getPresentingController();
    taskListCtr.popController();
    taskListCtr.showView();
    this.popController();
    this.clearTimer();
    this.clearCountdownTimer();
  },

  onScanButtonTapped: function() {
    var me = this;
    var sku = me.getTaskDetail().sku;
    var onScanSuccess = function(result) {
      if (!result.cancelled) {
        var match = (result.text === sku ? 'Item Verified' : 'Item Mismatch');
        Jda.mobility.plugins.DialogManager.alert({
              message: match
            });
        // alert("We got a barcode\n" +
        //   "Result: " + result.text + "\n" +
        //   "Format: " + result.format + "\n" +
        //   match);
      }
    };
    var onScanError = function(error) {
      // alert("Scanning failed: " + error);
      Jda.mobility.plugins.DialogManager.alert({
              message: "Scanning failed"
            });
    };
    cordova.plugins.barcodeScanner.scan(onScanSuccess, onScanError);
  },

  clearSelection: function() {
    this.getFloorplan().setCls("floor-planogram-btn");
    this.getPlanogram().setCls("floor-planogram-btn");
  },

  onToLocationTapped: function() {
    this.setSelectedBooth('to');
    this.swipeUp();
  },

  onFromLocationTapped: function() {
    this.setSelectedBooth('from');
    this.swipeUp();
  },

  onFloorplanTapped: function() {
    this.setIsFloorplanSelected(true);
    this.getView().down('#floor-planogram-Image').setSrc(this.getTaskDetail().floor_data_uri);
    this.clearSelection();
    this.getFloorplan().setCls("floor-planogram-btn-selected");
    this.setColorBarOnType();
    this.getGreenBar().setCls("task-detail-green-bar");
  },

  onPlanogramTapped: function() {
    this.setIsFloorplanSelected(false);
    this.updatePlanogramForMisplacedItem();
  },

  onTaskDetailSwipe: function(comp) {
    comp.element.on('swipe', this.onSwipe.bind(this));
  },

  hideWhereItIsBtn: function(hide) {
    var detail = this.getTaskDetail();
    detail.isHide = hide;
    this.setTaskDetail(detail);
    this.getView().down('#itemlocation').down('#from').setData(this.getTaskDetail());
    this.getView().down('#itemlocation').down('#to').setData(this.getTaskDetail());
  },

  swipeUp: function() {
    var me = this;
    me.clearSelection();
    me.hideWhereItIsBtn(true);
    me.updatePlanogramForMisplacedItem();
    me.getTaskDetailView().setScrollable(this.getScrollerConfig());
    var  y = Math.ceil(this.getTaskTopContainer().getHeight());
    me.getTaskDetailView().getScrollable().getScroller().scrollTo(0, y, true);
    setTimeout(function() {
      me.getTaskDetailView().setScrollable(false);
    }, 300);
  },

  swipeDown: function() {
    var me = this;
    me.setColorBarOnType();
    me.getGreenBar().setCls("task-detail-green-bar");
    me.setSelectedBooth(null);
    me.hideWhereItIsBtn(false);
    me.getTaskDetailView().setScrollable(this.getScrollerConfig());
    me.getTaskDetailView().getScrollable().getScroller().scrollTo(0,0,true);
    setTimeout(function() {
      me.getTaskDetailView().setScrollable(false);
    }, 300);
  },

  onSwipe: function(event) {
    if (event.direction == "down") {
      this.swipeDown();
    } else if(event.direction == "up") {
      this.swipeUp();
    } else if(event.direction == "right") {
      this.onTaskListButtonTapped(null);
    }
  },

  updateBoothSelection: function() {
    //this.getOrangeBar().setCls("task-detail-orange-bar");
    this.setColorBarOnType();
    this.getGreenBar().setCls("task-detail-green-bar");
    if(this.getSelectedBooth() == "from") {
      this.getGreenBar().setCls("grey-bar");
    } else {
      this.getOrangeBar().setCls("grey-bar");
    }
  },

  updatePlanogramForMisplacedItem: function() {
    var detail = this.getTaskDetail();
    var type = detail.type;
    if(!this.getIsFloorplanSelected()) {
      this.clearSelection();
      this.getPlanogram().setCls("floor-planogram-btn-selected");
      this.getView().down('#floor-planogram-Image').setSrc(detail.plan_data_uri);
    } else {
      this.clearSelection();
      this.getFloorplan().setCls("floor-planogram-btn-selected");
      this.getView().down('#floor-planogram-Image').setSrc(detail.floor_data_uri);
    }
  },

  setColorBarOnType: function(){
    var type = this.getTaskDetail().type;
    var color = this.getTaskDetail().type_color;
    console.log("color" + color);
    this.getView().down('#booth-orange').setStyle({backgroundColor: color});
    Ext.select('.color-bar').setStyle('backgroundColor', color);
    this.getOrangeBar().setCls("task-detail-color-bar");
  },

  onExceptionButtonTapped: function() {
    this.hidePopover();
    var p = Ext.create('Jda.ISL.View.ExceptionMenu');
    this.setPopover(p);
    p.on('hide', function() {
        if (this.getPopover()) {
            this.getPopover().destroy();
            this.setPopover(null);
        }
    }, this);
    p.on('painted', function() {
        p.query("#send-to-manager-option")[0].on('tap', this.showSendToManagerPopover.bind(this));
        p.query("#out-of-stock-option")[0].on('tap', this.showOutOfStockExceptionPopover.bind(this));
        p.query("#send-wear-message")[0].on('tap', this.showItemIsDamagedPopover.bind(this));
    }, this, {
        single: true
    });
    p.showBy(this.getTaskBottomContainer(), 'bc-tc');

    // if(this.getExceptionMenu().isHidden() === true) {
    //   this.getExceptionMenu().showBy(this.getTaskBottomContainer(), 'bc-tc');
    //   this.getExceptionMenu().setHidden(false);
    // } else {
    //   this.getExceptionMenu().hide();
    //   this.getExceptionMenu().setHidden(true);
    // }
  },

  showOutOfStockExceptionPopover: function() {
    // this.getExceptionMenu().hide();
    // this.getExceptionMenu().setHidden(true);
    this.hidePopover();
    var p = Ext.create('Jda.ISL.View.OutOfStockPopover');
    p.setHeight(window.innerHeight - 40);
    p.setWidth(window.innerWidth - 40);
    this.setPopover(p);
    p.on('painted', function() {
        p.query("#cancel-out-of-stock")[0].on('tap', this.onCancelPopover.bind(this));
        p.query("#out-of-stock-send")[0].on('tap', this.sendToManager.bind(this));
        p.query('#up-button')[0].on('tap', this.onUpButtonTap.bind(this));
        p.query('#down-button')[0].on('tap', this.onDownButtonTap.bind(this));
    }, this, {
        single: true
    });
    p.showBy(this.getView(), 'cc-cc');
  },

  showSendToManagerPopover: function() {
    this.hidePopover();
    var p = Ext.create('Jda.ISL.View.EscalatePopover');
    p.setHeight(window.innerHeight - 40);
    p.setWidth(window.innerWidth - 40);
    this.setPopover(p);
    p.on('painted', function() {
        p.query("#escalate-text-area")[0].setWidth(window.innerWidth - 80);
        // p.query("#escalate-text-area")[0].blur();
        p.query("#cancel-send-to-manager")[0].on('tap', this.onCancelPopover.bind(this));
        p.query("#send-to-manager")[0].on('tap', this.sendToManager.bind(this));
        p.query("#escalate-text-area")[0].enable();
    }, this, {
        single: true
    });
    p.showBy(this.getView(), 'cc-cc');
  },
  showItemIsDamagedPopover: function() {
    this.hidePopover();
    var p = Ext.create('Jda.ISL.View.ItemDamagedPopover');
    p.setHeight(window.innerHeight - 40);
    p.setWidth(window.innerWidth - 40);
    this.setPopover(p);
    p.on('painted', function() {
        // p.query("#item-text-area")[0].setWidth(window.innerWidth - 40);
        p.query("#cancel-item-damage")[0].on('tap', this.onCancelPopover.bind(this));
        p.query("#cancel-item-damage")[0].on('tap', this.onCancelPopover.bind(this));
        p.query("#item-damage-send")[0].on('tap', this.sendToManager.bind(this));
    }, this, {
        single: true
    });
    p.showBy(this.getView(), 'cc-cc');
  },

  onCancelPopover: function() {
    this.hidePopover();
  },

  sendToManager: function() {
    var msg = this.getRandomMessage(true);
    this.showMessageView(msg);
//     var me = this;
//     me.clearTimer();
//     var details = me.getTaskDetail();
//     details.status = 'closed';
//     var url = Jda.ISL.Util.DataService.getTasksUrl();
//     Jda.mobility.plugins.LoadingMaskManager.showLoadingMask();
//     Ext.Ajax.request({
//       url: url,
//       method: 'PUT',
//       jsonData: {
//         resource: [details]
//       },
//       timeout: Jda.ISL.Utils.Constants.AJAX_TIMEOUT,
//       success: function(conn, response, options, eOpts) {
//         me.hidePopover();
//         me.onTaskListButtonTapped(null);
//         Jda.mobility.plugins.LoadingMaskManager.hideLoadingMask();
//       },
//       failure: function(conn, response, options, eOpts) {
//         console.log('Task detail', 'Data update request failure');
//         Jda.mobility.plugins.LoadingMaskManager.hideLoadingMask();
//       }
//     });
  },

  hidePopover: function() {
    if (this.getPopover()) {
        this.getPopover().destroy();
        this.setPopover(null);
    }
  },

  onUpButtonTap: function() {
    var p = this.getPopover().query("#out-of-stock-quantity")[0];
    var qty = parseInt(p.getHtml(), 10);
    p.setHtml(++qty);
  },

  onDownButtonTap: function() {
    var p = this.getPopover().query("#out-of-stock-quantity")[0];
    var qty = parseInt(p.getHtml(), 10);
    if(qty <= 0) {
      return;
    }
    p.setHtml(--qty);
  },
  removeUpdateNotification: function(){
    console.log('Remove nav bar');
    this.getOkButton().setHidden(true);
    this.getDoneButton().setHidden(false);
    this.getTaskExpiredLabel().setHtml('');
    this.getExceptionButton().setDisabled(false);
    this.getScanButton().setDisabled(false);
    Jda.mobility.plugins.NavigationBarComponentManager.removeAllButtons(this.getDefaultRoute());
    this.setIsNotified(false);
  },

  showMessageView: function(msg) {
    this.clearTimer();
    this.hidePopover();
    var p = Ext.create('Jda.ISL.View.MessageView');
    p.setWidth(window.innerWidth);
    p.query("#message")[0].setHtml(msg);
    this.setPopover(p);
    p.on('painted', function() {
      p.query("#next-button")[0].on('tap', this.onNextTaskTapped.bind(this));
      this.countdownTimer();
    }, this, {
        single: true
    });
    p.showBy(this.getView(), 'bc-bc');
  },

  countdownTimer: function() {
    var sec = 4;
    var tempTimer = setInterval(function() {
      var me = this;
      if (sec > 0) {
        var html = '<div class="message-view-timer">Next task in ' + sec + ' seconds</div>';
        this.getPopover().query("#timer-label")[0].setHtml(html);
        sec--;
      } else {
        me.clearCountdownTimer();
        me.hidePopover();
        me.getNextTask();
      }
    }.bind(this), 1000);

    this.setMessageTimer(tempTimer);
  },

  clearCountdownTimer: function() {
    if (this.getMessageTimer() !== null) {
      clearInterval(this.getMessageTimer());
      this.setMessageTimer(null);
    }
  },

  onNextTaskTapped: function() {
    this.clearCountdownTimer();
    this.hidePopover();
    this.getNextTask();
  },

  getNextTask: function() {
    var me = this;
    var details = me.getTaskDetail();
    details.status = 'closed';
    details.name = me.getTaskName();
    var url = Jda.ISL.Util.DataService.getTasksUrl();
    Jda.mobility.plugins.LoadingMaskManager.showLoadingMask();
    Ext.Ajax.request({
      url: url,
      method: 'PUT',
      jsonData: {
        resource: [details]
      },
      timeout: Jda.ISL.Utils.Constants.AJAX_TIMEOUT,
      success: function(conn, response, options, eOpts) {
        me.setRecordID(null);
        me.getNextTaskOnPriority();
      },
      failure: function(conn, response, options, eOpts) {
        console.log('Task detail', 'Data update request failure');
        Jda.mobility.plugins.LoadingMaskManager.hideLoadingMask();
      }
    });
  },

  getTaskId: function() {
    var itemId = this.getTaskDetail().id;
    var len = this.getTaskStore().data.items.length;
    var nextIndex = null, nextId = null;
    for(var i = 0; i < len; i++){
      if(itemId == this.getTaskStore().data.items[i].raw.id){
        nextIndex = i + 1;
        break;
      }
    }
    if(nextIndex < len) {
      nextId = this.getTaskStore().data.items[nextIndex].raw.id;
    }
    return nextId;
  },

  getNextTaskOnPriority: function() {
    var taskId = this.getTaskId();
    if(taskId === null) {
      Jda.mobility.plugins.LoadingMaskManager.hideLoadingMask();
      this.onTaskListButtonTapped(null);
      return;
    }
    var me = this;
    // var urlQuery = '?quantity%2C%20status%2C%20type%2C%20type_color%2C%20name%2C%20from_loc%2C%20priority%2C%20created&filter=status%20%3D%20open&order=priority%20desc%2C%20created%20asc';
    // var url = Jda.ISL.Util.DataService.getTasksUrl()+ urlQuery;
    // var params = {
    //   limit: 1
    // };

    var url = Jda.ISL.Util.DataService.getTasksUrl()+ "/" + taskId + "?id_field=id";
    var params = {};
    Ext.Ajax._defaultHeaders = Jda.ISL.Util.DataService.getRequestHeader();
    Ext.Ajax.request({
      url: url,
      method: 'GET',
      params: params,
      timeout: Jda.ISL.Utils.Constants.AJAX_TIMEOUT,
      success: function(conn, response, options, eOpts) {
        Jda.mobility.plugins.LoadingMaskManager.hideLoadingMask();
        var data = Ext.decode(conn.responseText);
        var detail = {
          "id": 0,
          "type": "",
          "type_color": "",
          "sku": "",
          "name": "",
          "color": "",
          "size":"",
          "quantity": "",
          "from_loc": "",
          "from_section": "",
          "to_loc": "",
          "to_section": "",
          "status": "",
          "created": "",
          "product_data_uri":"",
          "floor_data_uri":"",
          "plan_data_uri":"",
          "isHide": false
        };
        var details = null;
        if (Object.prototype.toString.call(data) === '[object Object]') {
            details = data;
        }
        if(details !== null) {
          var from_loc = details.from_loc || "";
          var split_from_loc = from_loc.split("|");
          var to_loc = details.to_loc || "";
          var split_to_loc = to_loc.split("|");
          var qtyName = details.quantity + " " + details.name;

          detail = {
            "id": details.id,
            "type": details.type,
            "type_color": details.type_color,
            "sku": details.sku,
            "name": qtyName,
            "color": details.color,
            "size": details.size,
            "quantity": details.quantity,
            "from_loc": split_from_loc[0],
            "from_section":split_from_loc[1],
            "to_loc": split_to_loc[0],
            "to_section":split_to_loc[1],
            "status": details.status,
            "created": details.created,
            "product_data_uri":details.product_data_uri,
            "floor_data_uri":details.floor_data_uri,
            "plan_data_uri":details.plan_data_uri,
            "isHide": false
          };
          me.setTaskDetail(detail);
          me.setTaskName(details.name);
          me.getView().down('#typebar').setData(detail);
          me.getView().down('#itemdetails').setData(detail);
          me.getView().down('#itemlocation').down('#from').setData(detail);
          me.getView().down('#itemlocation').down('#to').setData(detail);
          Jda.ISL.Util.ImageUtil.getRestockItemImage(details.sku, function(url) {
            me.getView().down('#itemImage').setSrc(detail.product_data_uri);
          });
          me.getDoneButton().setDisabled(false);
          me.getDoneButton().setCls(['task-detail-done-button', 'shadow']);
          me.setColorBarOnType();
          me.checkOpenTaskStatus(detail.id);
        } else {
          Jda.mobility.plugins.LoadingMaskManager.hideLoadingMask();
          me.onTaskListButtonTapped(null);
          // Jda.mobility.plugins.DialogManager.alert({
          //   message: "No open tasks"
          // });
        }
      },
      failure: function(conn, response, options, eOpts) {
        me.setRecordID(null);
        console.log('Task detail', 'Data request failure');
        Jda.mobility.plugins.LoadingMaskManager.hideLoadingMask();
      }
    });
  },

  getRandomMessage: function(isException) {
    var index = 0, msg = null;
    if(isException) {
      index = Math.floor(Math.random() * this.getExceptionMessageSet().length);
      if(index < this.getExceptionMessageSet().length) {
        msg = this.getExceptionMessageSet()[index];
      }
    } else {
      index = Math.floor(Math.random() * this.getMessageSet().length);
      if(index < this.getMessageSet().length) {
        msg = this.getMessageSet()[index];
      }
    }
    return msg;
  }

});
