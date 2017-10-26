
Ext.define('Jda.ISL.View.EscalatePopover', {
    extend: 'Ext.Container',
    config: {
        cls: 'outofstock-popover',
        id: 'escalate-popover',
        modal:true,
        layout: 'vbox',
        hideOnMaskTap: true,
        items: [{
          xtype:'label',
          flex: 0.8,
          html: '<div class="escalate-manager">Send to manager</div>'
        }, {
          xtype:'label',
          flex: 1,
          html: '<div class="escalate-manager-description">No worries. We\'ll look into it.</div><div class="escalate-manager-description">It would help us if you could describe what went wrong:</div>'
        }, {
          xtype:'textareafield',
          cls: 'text-area',
          flex: 2,
          id:'escalate-text-area',
          disabled: true
        }, {
          xtype: 'container',
          flex: 2,
          layout: 'hbox',
          docked: 'bottom',
          items: [{
            xtype: 'button',
            cls: 'cancel-button',
            flex: 1,
            text: Jda.getMessage('jda.ISL.Cancel'),
            id: 'cancel-send-to-manager'
          }, {
            xtype: 'button',
            cls: ['send-button', 'shadow'],
            flex: 1,
            text: Jda.getMessage('jda.ISL.Send'),
            id: 'send-to-manager'
          }]
        }]
    }
});
