Ext.define('JDA.dm.DashBoard.view.SettingsView',{
        extend:'Ext.window.Window',
        title:'Settings',
        height:400,
        width:700,
        modal:true,
        initComponent: function() {
        var me = this;
        
        me.items = [{
                  xtype:'panel',
                  id:'chartPanel1',
                  // dock:'top',
                  // padding:{'top':4},
                  height:'50px',
                  width:'100%',
                  // cls:'tbar-align-below',
      items:[
            {
                // width:'40%',
                padding:{'left':20},
                labelAlign: 'left',
                xtype:'label',
                text: 'Filters'
              },
        {
            xtype:'container',
            defaultType:'combobox',
            multiSelect: true,
            width:'100%',
            layout:'hbox',
            fieldDefaults: {
              msgTarget: 'under'

            },
            items :
            [
              // {
              //   width:'40%',
              //   padding:{'left':20},
              //   labelAlign: 'left',
              //   fieldLabel: 'From',
              //   allowBlank:true,
              //   name: 'From',
              //   value:'Status',
              //   forceSelection:true,
              //   typeAheadDelay:50,
              //   typeAhead:true,
              //   autoSelect:true,
              //   minChars:1,
              //   anyMatch:true,
              //   store:Ext.create('JDA.dm.BusinessRules.store.StatusComboStore'),
              //   queryMode:'local',
              //   displayField:'data',
              //   valueField:'data'
              // },
              // {
              //   xtype:'container',
              //   width:'10%'
              // },
              // {
              //   width:'30%',
              //   allowBlank:true,
              //   store:Ext.create('JDA.dm.BusinessRules.store.StatusComboStore'),
              //   // fieldLabel: RP.getMessage('dm.BusinessRules.messages.table'),
              //   // labelAlign: 'left',
              //   name: 'table'
              // }
            ]
          },{
          xtype:'label',
            defaultType:'textfield',
            width:'100%',
            layout:'hbox'
          },{
            xtype:'container',
            defaultType:'combobox',
            width:'100%',
            layout:'hbox',
            fieldDefaults: {
              msgTarget: 'under'
            },
            items :
            [
              // {
              //   width:'40%',
              //   padding:{'left':20},
              //   labelAlign: 'left',
              //   fieldLabel: RP.getMessage('dm.BusinessRules.messages.status'),
              //   allowBlank:true,
              //   name: 'Status',
              //   value:'Active',
              //   forceSelection:true,
              //   typeAheadDelay:50,
              //   typeAhead:true,
              //   autoSelect:true,
              //   minChars:1,
              //   anyMatch:true,
              //   store:Ext.create('JDA.dm.BusinessRules.store.StatusComboStore'),
              //   queryMode:'local',
              //   displayField:'data',
              //   valueField:'data'
              // },
              // {
              //   xtype:'container',
              //   width:'10%'
              // },
              // {
              //   width:'30%',
              //   allowBlank:true,
              //   // fieldLabel: RP.getMessage('dm.BusinessRules.messages.table'),
              //   // labelAlign: 'left',
              //   name: 'table'
              // }
            ]
          },
          {
            xtype:'container',
            width:'100%',
            layout:'hbox',
            fieldDefaults: {
              msgTarget: 'under'

            },
            items :
            [
              {
                width:'40%',
                padding:{'left':20},
                labelAlign: 'left',
                fieldLabel: 'Period',
                xtype: 'combobox',
                allowBlank:true,
                // name: 'Status',
                // value:'Active',
                forceSelection:true,
                // typeAheadDelay:50,
                // typeAhead:true,
                // autoSelect:true,
                // minChars:1,
                // anyMatch:true,
                store:Ext.create('JDA.dm.DashBoard.store.PeriodStore'),
                // queryMode:'local',
                displayField:'data',
                valueField:'data'
              }
              
            ]
          },
          {
                // width:'40%',
                padding:{'left':20},
                labelAlign: 'left',
                xtype:'label',
                text: 'Display'
              },
              {
            xtype:'container',
            width:'100%',
            layout:'hbox',
            fieldDefaults: {
              msgTarget: 'under'

            },
            items :
            [
              {
                width:'40%',
                padding:{'left':20},
                labelAlign: 'left',
                fieldLabel: 'View',
                xtype: 'combobox',
                allowBlank:true,
                // name: 'Status',
                // value:'Active',
                forceSelection:true,
                // typeAheadDelay:50,
                // typeAhead:true,
                // autoSelect:true,
                // minChars:1,
                // anyMatch:true,
                store:Ext.create('JDA.dm.DashBoard.store.ViewStore'),
                // queryMode:'local',
                displayField:'data',
                valueField:'data'
              },
              {
                width:'40%',
                padding:{'left':20},
                labelAlign: 'left',
                fieldLabel: 'Grouped by',
                xtype: 'combobox',
                allowBlank:true,
                // name: 'Status',
                // value:'Active',
                forceSelection:true,
                // typeAheadDelay:50,
                // typeAhead:true,
                // autoSelect:true,
                // minChars:1,
                // anyMatch:true,
                store:Ext.create('JDA.dm.DashBoard.store.GroupByStore'),
                // queryMode:'local',
                displayField:'data',
                valueField:'data'
              }
              
            ]
          }]
    }];
    this.callParent();
    }

    });