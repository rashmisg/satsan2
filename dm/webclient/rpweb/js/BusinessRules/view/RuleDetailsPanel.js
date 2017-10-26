Ext.define('JDA.dm.BusinessRules.view.RuleDetailsPanel', {
    extend: 'Ext.form.Panel',
    xtype: 'dm-ruleDetailsPanel',
    layout: 'vbox',
    title: 'Rule Details',
    width: '100%',
    height:'auto',
    id:'ruleDetailsPanel',
    controller:'RuleDetailsPanelController',
    namespace: 'JDA.dm.BusinessRules.view',
    buttons:[
      {
        xtype:'button',
        id:'save',
        text:'Save'
      },
      {
        xtype:'button',
        id:'cancel',
        text:'Cancel'
      }
    ],
    items:[
      {
        /*
          Left Hand Pane containing
          Rule name and description
        */
        xtype:'container',
        layout : 'hbox',
        width:'100%',
        items:[
          {
            xtype:'container',  // Added To Fix Bug of breaking textfields
            layout:'form',      //
            width : '50%',
            padding:{left:30,right:30,top:5,bottom:0},
            items:[
            {
              xtype:'container',
              padding:{left:30,right:30,top:5,bottom:0},
              layout:'vbox',
              items:[
                {
                  xtype:'textfield',
                  fieldLabel:'Rule Name',
                  labelAlign:'left',
                  allowBlank:false,
                  width:'100%',
                  name:'name',
                  id:'ruleName'
                },
                {
                  xtype:'textarea',
                  labelAlign:'left',
                  fieldLabel:'Description',
                  allowBlank:true,
                  width:'100%',
                  height : 70,
                  name:'description',
                  id:'description'
                },
                {
                  xtype:'textfield',
                  fieldLabel:'Model',
                  labelAlign:'left',
                  allowBlank:false,
                  width:'100%',
                  name:'model',
                  id:'model',
                  readOnly: true,
                  value : 'GS1'
                }

              ]
            }
          ]
        },
        /*
        Right hand pane containing
        Rule Type and Effective Period
        */
          {
            xtype:'container',
            layout:'form',
            width : '50%',
            padding:{left:30,right:30,top:5,bottom:0},
            items:[
              {
                xtype:'container',   // Added To Fix Bug of breaking textfields
                layout:'vbox',
                padding:{left:30,right:30,top:5,bottom:0},
                items:[
                  {
                    xtype:'combo',
                    fieldLabel:'Rule Type',
                    labelAlign:'left',
                    allowBlank:false,
                    typeAheadDelay:50,
                    typeAhead:true,
                    autoSelect:true,
                    minChars:1,
                    anyMatch:true,
                    forceSelection:true,
                    width:'100%',
                    name:'type',
                    id:'ruleType',
                    store:Ext.create('JDA.dm.BusinessRules.store.RuleTypeComboStore'),
                    emptyText: '',
                    valueField:'data',
                    displayField:'data'
                  },
                  {
                    xtype:'rpDateRange',
                    labelAlign:'left',
                    fieldLabel:'Effective Period',
                    allowBlank:true,
                    width:'100%',
                    name:'effectivePeriod',
                    id:'effectivePeriod'
                  },{
                  xtype:'textfield',
                  fieldLabel:'Type',
                  labelAlign:'left',
                  readOnly: true,
                  width:'100%',
                  name:'message',
                  id:'message',
                  value : 'TransferOrder'
                }
                ]
              },
                /*
                CheckBox Group
                */
              {      xtype:'container',
                    layout:'hbox',
                    padding:{left:130,right:0,top:0,bottom:0},
                    defaults:{padding:5},
                    items:[
                      {
                        xtype:'checkbox',
                        boxLabel:'Is Active',
                        name:'isActive',
                        id:'isActive',
                        inputValue: 'true',
                        uncheckedValue: 'false'
                      },
                      {
                        xtype:'checkbox',
                        boxLabel:'Is Hard Rule',
                        name:'isHard',
                        id:'isHard',
                        inputValue: 'true',
                        uncheckedValue: 'false'
                      }
                    ]
              }
        ]
        }
        ]
      },
        {
            xtype:'container',  // Added To Fix Bug of breaking textfields
            layout:'form',      //
            width : "100%",
            padding:{left:30,right:30,top:5,bottom:0},
            items:[
            {
              xtype:'container',
              padding:{left:30,right:30,top:5,bottom:10},
              layout:'hbox',
              items:[
                {
                  xtype:'textarea',
                  fieldLabel : "Script",
                  allowBlank:false,
                  width:'100%',
                  height : 250,
                  name:'script',
                  id:'script'
                }
              ]
            }
          ]
        }
    ]
});
