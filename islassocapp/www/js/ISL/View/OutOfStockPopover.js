Ext.define('Jda.ISL.View.OutOfStockPopover', {
  extend: 'Ext.Container',
  config: {
    cls: 'outofstock-popover',
    id: 'outofstockpopover-popover',
    modal: true,
    layout: 'vbox',
    hideOnMaskTap: true,
    items: [{
      xtype: 'label',
      flex: 0.8,
      html: '<div class="escalate-manager">Not enough stock to complete</div>'
    }, {
      xtype: 'label',
      flex: 1,
      html: '<div class="escalate-manager-description">Oops, looks like there is something wrong with our quantity.</div><div class="escalate-manager-description">How many did you find?</div>'
    }, {
      xtype: 'container',
      flex: 2,
      layout: {
        type: 'hbox',
        align: 'middle'
      },
      items: [{
        xtype: 'label',
        id: "out-of-stock-quantity",
        flex: 1,
        html: "1"
      }, {
        xtype: 'container',
        flex: 2,
        layout: 'vbox',
        items: [{
          xtype: 'button',
          cls: 'up-button',
          flex: 1,
          id: 'up-button'
        }, {
          xtype: 'button',
          cls: 'down-button',
          flex: 1,
          id: 'down-button'
        }]
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
          id: 'cancel-out-of-stock'
        }, {
          xtype: 'button',
          cls: ['send-button', 'shadow'],
          flex: 1,
          text: Jda.getMessage('jda.ISL.Send'),
          id: 'out-of-stock-send'
        }]
      }]
    }]
  }
});
