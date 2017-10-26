Ext.define('JDA.dm.BusinessRules.view.RuleDetails',{
    extend:'RP.chrome.task.TaskForm',
    title:'Add Rules',
    allowPrint:true,
    allowRefresh:true,
    // floating:true,
    id:'ruleDetails',
    xtype:'ruleDetails',
    alias:'widget.ruleDetails',
    controller:'BusinessRulesSummaryController',
    items:
    [
      {
        xtype:'dm-ruleDetailsPanel',
        id:'ruleDetailsPanel'
      }
    ]
  });
