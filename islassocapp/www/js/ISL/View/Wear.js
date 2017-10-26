Ext.define('Jda.ISL.View.Wear', {
  extend: 'Ext.Container',

  config: {
    id: "wear-list-container",
    layout: 'vbox',
    padding: '20px',
    items: [{
      xtype: 'button',
      itemId: 'send-wear-message',
      text: 'Send Message',
      padding: '20px',
      height: '44px'
    }, {
      xtype: 'list',
      itemId: 'message-list',
      itemTpl: '{message}',
      flex: 1
    }]
  }
});
