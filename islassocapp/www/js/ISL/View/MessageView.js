
Ext.define('Jda.ISL.View.MessageView', {
    extend: 'Ext.Container',
    config: {
        cls: 'message-view',
        id: 'message-view',
        modal:true,
        layout: 'vbox',
        hideOnMaskTap: false,
        items: [{
          xtype:'label',
          id: 'message',
          cls: 'message-view-text',
          flex: 1.5
        }, {
          xtype: 'container',
          layout: 'hbox',
          docked: 'bottom',
          flex: 1,
          items: [{
            xtype:'label',
            id:'timer-label',
            flex: 2.5,
            html: '<div class="message-view-timer">Next task in 5 seconds</div>'
          }, {
            xtype: 'button',
            cls: ['next-button', 'shadow'],
            flex: 1,
            text: Jda.getMessage('jda.ISL.Next'),
            id: 'next-button'
          }]
        }]
    }
});
