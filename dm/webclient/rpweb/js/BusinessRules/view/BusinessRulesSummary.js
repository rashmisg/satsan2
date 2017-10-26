Ext.define('JDA.dm.BusinessRules.view.BusinessRulesSummary',
{
  extend:'RP.chrome.task.TaskForm',
  title:'Business Rules',
  id: 'BusinessRulesSummary',
  xtype:'businessRulesSummary',
  namespace: 'JDA.dm.BusinessRules.view',
  controller:'BusinessRulesSummaryController',
  init:function(){
    var me = this;
    if (!me.store) {
            me.store = Ext.getStore('JDA.dm.BusinessRules.store.BusinessRulesSummaryStore');
        }
    this.getParent();
  },
  items:
    [
      {
        xtype:'box',
        html:'\n'
      },
      {
    title: RP.getMessage('dm.BusinessRules.messages.search'),
    collapsible:true,
    cls: 'my-panel',
    frame: true,
    bodyStyle: 'padding:5px 5px 0',
    width: '100%',
    layout: 'vbox', // arrange fieldsets side by side
    defaults: {
        // bodyPadding: 4
    },
    items:
      [
          {// Fieldset in Column 1 - collapsible via toggle button
            xtype:'container',
            defaultType: 'combo',
            layout: 'hbox',
            width:'100%',
            defaults: [{columnWidth:0.5}],
            fieldDefaults: {
                                msgTarget: 'under',
                                labelAlign: 'left'
                            },
            items :
            [ // Fieldset in Column 1 - collapsible via toggle button

                {
                  fieldLabel: RP.getMessage('dm.BusinessRules.messages.rulename'),
                  labelAlign: 'left',
                  width:'40%',
                  padding:{'left':20},
                  name: 'Rule Name',
                  xtype:'textfield',
                  id : 'rulename',
                  value : ""
                },
                {
                  xtype:'container',
                  width:'10%'
                },
                {
                  fieldLabel: RP.getMessage('dm.BusinessRules.messages.type'),
                  labelAlign: 'left',
                  width:'40%',
                  // padding:{'left':80},
                  name: 'type',
                  id : 'type',
                  forceSelection:true,
                  typeAheadDelay:50,
                  typeAhead:true,
                  autoSelect:true,
                  minChars:1,
                  anyMatch:true,
                  store:Ext.create('JDA.dm.BusinessRules.store.RuleTypeComboStore'),
                  displayField:'data',
                  valueField:'data',
                  xtype:'combo'
                }
              ]
          },
          {
              xtype:'container',
              defaultType:'textfield',
              defaults: {anchor: '70%'}
          },
          {
            xtype:'container',
            defaultType:'textfield',
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
                fieldLabel: RP.getMessage('dm.BusinessRules.messages.status'),
                name: 'status',
                forceSelection:true,
                typeAheadDelay:50,
                typeAhead:true,
                autoSelect:true,
                minChars:1,
                anyMatch:true,
                store:Ext.create('JDA.dm.BusinessRules.store.StatusComboStore'),
                queryMode:'local',
                displayField:'data',
                valueField:'data',
                id : 'status',
                xtype : 'combo'
              },
              {
                xtype:'container',
                width:'10%'
              },
              {
                width:'40%',
                allowBlank:true,
                fieldLabel: 'Message Type',    //TODO : Localise Mesasge Type Label
                labelAlign: 'left',
                name: 'messageType',
                id :'messageType',
                value : ""
              }
            ]
          }
      ],
      fbar:{
        layout:'hbox',
        items:
        [
            {
              text:RP.getMessage('dm.BusinessRules.messages.search'),
              cls:'',
              id : 'searchButton'
            },
            {
              text:RP.getMessage('dm.BusinessRules.messages.clear'),
              id : 'clearButton'
            }
        ]
      }
    },
    {
      xtype:'box',
      text:'\n',
      padding:20
    },
    {//second grid
      xtype:'panel',
      collapsible:true,
      title:RP.getMessage('dm.BusinessRules.messages.searchresults'),
      items:
        [
          {
            xtype:'grid',
            id: 'BusinessRulesGrid',
            // store:Ext.create('JDA.dm.BusinessRules.store.BusinessRulesSummaryStore'),
            store: Ext.getStore('BusinessRulesSummaryStore'),
            width: '100%',
            height: 400,
            listeners:{
              itemclick:function(record, item, index, e, eOpts ){
                console.log("item selected");
                this.fireEvent('rowItemSelected',record,item,index,e,eOpts);
              }
             },
            columns: [// --Change
              {text:"RuleName",dataIndex:'name',flex:1},
              {text:'Type',dataIndex:'type',flex:1},
              {text:"Message Type",dataIndex:'message',flex:1},
              {text:'Id',dataIndex:'id',flex:1,hidden : true},
              {text:'Status',dataIndex:'isActive',flex:1},
              {text : 'Script',dataIndex : 'script',flex:2,hidden : true},
              {text : 'Model',dataIndex : 'model',flex:1,hidden : true}
            ],
              dockedItems:
              [
                {
                xtype:'toolbar',
                itemId:'tbar',
                name:'tbar',
                width:'100%',
                items:[
                  {
                    xtype:'button',
                    name:'addRule',
                    id:'addRuleButton',
                    text:'Add Rule'
                  },
                  {
                    xtype:'button',
                    name:'manageSequence',
                    id:'manageSequenceButton',
                    text:RP.getMessage('dm.BusinessRules.messages.managesequence'),
                    disabled:true
                  },
                  {
                    xtype:'button',
                    name:'Edit',
                    id:'editRuleButton',
                    text:RP.getMessage('dm.BusinessRules.messages.edit'),
                    handler: function() {
                      this.fireEvent('rowEditRuleClick');
                    },
                    disabled:true
                  },
                  {
                    xtype:'button',
                    name:'deleteRule',
                    id:'deleteRuleButton',
                    text:'Delete Rule',
                    handler: function() {
                      this.fireEvent('rowDeleteClick');
                    },
                    disabled:true
                  },
                  '->',
                  {
                    xtype:'tool',
                    type:'gear',
                    id:'searchresultFields'
                    // autoEl:{tag:'img',src:''}
                  }
                ]
              },{ xtype: 'pagingtoolbar',
                    id:'businessRulePagingToolBar',
                      dock: 'bottom',
                      displayMsg: '{0} - {1} of {2}',
                      emptyMsg: 'No data to display',
                      store: 'JDA.dm.BusinessRules.store.BusinessRulesSummaryStore',
                      listeners: {
                        'beforechange': function( pagingToolBar, changeEvent ) {
                          console.log("beforechange");
                          this.fireEvent('businessRulePageChange',pagingToolBar,changeEvent);
                        },
                        'change': function( pagingToolBar,changeEvent ) {
                          console.log("change");
                          this.fireEvent('businessRulePageSizeChange',pagingToolBar,changeEvent);
                        }
                      },
                      moveNext : function(){
                        console.log("moveNext");
                        this.fireEvent('businessRuleNextSelected');
                        this.store.currentPage=this.store.currentPage+1;
                      },
                      movePrevious : function(){
                        console.log("movePrevious");
                        this.fireEvent('businessRulePrevSelected');
                        this.store.currentPage=this.store.currentPage-1;
                      },
                      moveFirst : function(){
                        console.log("moveFirst");
                        this.fireEvent('businessRuleFirstSelected');
                        this.store.currentPage=1;
                      },
                      moveLast : function(){
                        console.log("moveLast");
                        this.fireEvent('businessRuleLastSelected');
                        this.store.currentPage=Math.ceil(this.store.totalCount/this.store.pageSize);
                      }
                  }
            ],
              viewConfig:{enableTextSelection:true },
              filterType:"service"
          }
        ]

    }
    ]
});
