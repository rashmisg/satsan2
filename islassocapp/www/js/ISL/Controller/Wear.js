Ext.define('Jda.ISL.Controller.Wear', {
  extend: 'Jda.mobility.controller.NavigationController',

  config: {
    routes: {
      'wear': 'showView'
    },
    refs: {
      connectionStatus: '#status-bar #connection-status',
      messagelist: '#wear-list-container #message-list',
      sendButton: 'button#send-wear-message'
    },
    control: {
      sendButton: {
        tap: 'onTapSendButton'
      }
    },
    messages: [],
    model: null,
    messagestore: null
  },

  init: function() {
    this.setView(Ext.create('Jda.ISL.View.Wear'));
    var model = Ext.define('Message', {
      extend: 'Ext.data.Model',
      config: {
        fields: ['message']
      }
    });
    this.setModel(model);

    var store = Ext.create('Ext.data.Store', {
      model: 'Message'
    });
    this.setMessagestore(store);
    this.getMessagelist().setStore(this.getMessagestore());
  },

  launch: function() {
    var me = this;
    document.addEventListener('resume', function() {
      me.showView();
    });

    function watch(handle) {
      var self = this;
      AndroidWear.onDataReceived(handle, function(e) {
        self.dataReceived(e.data);
      });

      self.handle = handle;
    }

    watch.prototype = {
      dataReceived: function(data) {
        console.log("AndroidWear message received: " + data);
        me.getMessagestore().addData({ 'message': data});
        me.getMessagelist().refresh();
      },

      sendMessage: function(message) {
        AndroidWear.sendData(this.handle, message);
        me.getMessagestore().addData({ 'message': 'Message sent to Wear' });
        me.getMessagelist().refresh();
        console.log("AndroidWear message sent! ", this.handle);
      }
    };

    if (AndroidWear) {
      AndroidWear.onConnect(function(e) {
        console.log("AndroidWear connection established");
        me.getMessagestore().addData({ 'message': 'AndroidWear connection established ' + e.handle });
        me.getMessagelist().refresh();
        ISL.app.watch = new watch(e.handle);
      });
    }
  },

  showView: function() {
    this.setViewportActiveItem();
  },

  onTapSendButton: function() {
    ISL.app.watch.sendMessage('Hello from ISL App');
  },

  onDataReceived: function(data) {
    console.log("AndroidWear message received, " + data);
    this.getMessages().push({ 'message': data });
    this.getMessagelist().setData(this.getMessages());
  }
});
