Ext.define('Jda.ISL.View.ExceptionMenu', {
    extend: 'Ext.Panel',

    config: {
        id: "exception-menu-sheet",
        width: "90%",
        top: 'auto',
        hideOnMaskTap: true,
        hidden: true,
        modal: true,
        showAnimation: {
            type: 'slideIn',
            // duration: 100,
            direction: 'down'
        },
        layout: { type: 'vbox', align: 'stretch' },
        items: [{
            xtype: 'button',
            cls: ['excpetion-button'],
            id: 'send-to-manager-option',
            text: 'Send to manager'
        }, {
            xtype: 'button',
            cls: ['excpetion-button'],
            id: 'out-of-stock-option',
            text: 'Not enough stock to complete'
        }, {
            xtype: 'button',
            cls: ['excpetion-button'],
            itemId: 'send-wear-message',
            text: 'The item is damaged'
        }]
    }
});
