/**
 * @class JDA.dm.testing.view.Main
 *
 * This view is the main view.
 *
 * @extends Ext.panel.Panel
 * @author 
 * @xtype dm-jsunit-main
 */
Ext.define('JDA.dm.testing.view.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.dm-jsunit-main',

    initComponent: function() {
        Ext.apply(this, {
            layout: 'fit',
            items: [{
                xtype: 'csunittestingpanel'
            }]
        });

        this.callParent(arguments);
    }
});
