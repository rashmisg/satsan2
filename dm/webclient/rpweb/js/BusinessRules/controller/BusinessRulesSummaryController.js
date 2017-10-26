Ext.define('JDA.dm.BusinessRules.controller.BusinessRulesSummaryController',
{
    extend:'Ext.app.Controller',
    config: {
      businessRulesStore: null,
      isRuleSelected: false,
      selectedRuleId: null,
      selectedRuleName: null,
      selectedRuleType: null,
      selectedRuleDesc: null,
      selectedRuleIsActive: false,
      selectedRuleIsHardRule: false,
      selectedRuleFromDate: null,
      selectedRuleToDate: null,
      selectedScript : null,
      selectedModel : null,
      selectedMessage : null,
      filterString : null,
      pageOffset: 0,
      pageLimit: 25,
      count: 0,
      retainQueryParam: false,
      search : true
    },
    refs:
    [
        {
          ref:'ruleDetails',
          selector:'ruleDetails'
        },
        {
          ref:'BusinessRulesSummary',
          selector:'businessRulesSummary'
        },
        {
          ref:'BusinessRules',
          selector:'#BusinessRules'
        },
        {
          ref:'summaryDetails',
          selector:'#summaryDetails'
        },
        {
          ref:'businessRulesGrid',
          selector:'#BusinessRulesGrid'
        },
        {
          ref:'deleteRuleButton',
          selector:'#deleteRuleButton'
        }
    ],

    views: [
      'BusinessRulesSummary'
    ],
    stores: [
        'BusinessRulesSummaryStore'
    ],
    
  init:function(){
    console.log("init of BusinessRulesSummaryController");
    this.control(
      {
        'button[id=addRuleButton]':{click:this.showAddRulePage}
      }
      // {
      //   'button[id=editRuleButton]':{click:this.showEditRulePage}
      // }
    );
    this.control({
      'button[id=deleteRuleButton]': {
        rowDeleteClick: this.deleteRule
      }
    });
    this.control({
      'button[id=editRuleButton]': {
        rowEditRuleClick: this.showEditRulePage
      }
    });
    this.control({
      'grid[id=BusinessRulesGrid]': {
       rowItemSelected: this.ruleSelected
      }
     });
    this.control({
      'button[id=searchButton]' : {
    click : function(button, e, options) {
    this.setSearch(true);
    this.onSearchClick(button, e, options);
        }
      }
    });

    this.control({
      'button[id=clearButton]' : {
    click : function(button, e, options) {
    this.setSearch(false);
    this.onClearClick(button, e, options);
        } 
      }  
    });
    this.control({
      'pagingtoolbar[id=businessRulePagingToolBar]': {
       businessRuleNextSelected: this.moveNext
      }
     });
    this.control({
      'pagingtoolbar[id=businessRulePagingToolBar]': {
       businessRulePrevSelected: this.movePrev
      }
     });
    this.control({
      'pagingtoolbar[id=businessRulePagingToolBar]': {
       businessRuleFirstSelected: this.moveFirst
      }
     });
    this.control({
      'pagingtoolbar[id=businessRulePagingToolBar]': {
       businessRuleLastSelected: this.moveLast
      }
     });
    this.control({
      'pagingtoolbar[id=businessRulePagingToolBar]': {
       businessRulePageChange: this.moveToPage
      }
     });
    this.control({
      'pagingtoolbar[id=businessRulePagingToolBar]': {
       businessRulePageSizeChange: this.moveToPageSize
      }
     });
  },
  moveNext:function() {
    console.log("moveNext selected");
    var me = this;
    me.retainQueryParam = true;
    me.pageOffset += me.pageLimit;
    me.disableButtons();
    me.showView();
  },

  moveToPage:function(pagingToolBar,changeEvent) {
    console.log("Move to page");
    var me = this;
    me.retainQueryParam = true;
    if(changeEvent > Math.ceil(me.count/me.pageLimit)){
      changeEvent = Math.ceil(me.count/me.pageLimit);
    }
    me.pageOffset = me.pageLimit*(changeEvent-1);
    me.disableButtons();
    // me.getMessageStore().getProxy().setExtraParam('offset', me.pageOffset);
    // me.getMessageStore().getProxy().setExtraParam('limit', me.pageLimit);
    // me.getMessageStore().load();
    me.showView();
  },

  moveToPageSize:function(pagingToolBar,changeEvent) {
    console.log("Move to pageSize");
    var me = this;
    me.retainQueryParam = true;
    if(changeEvent === undefined || pagingToolBar.store.pageSize === me.pageLimit){
      return;
    }
    me.pageOffset = changeEvent.fromRecord -1;
    me.pageLimit = pagingToolBar.store.pageSize;
    if(me.isRuleSelected){
      me.isRuleSelected = false;
     }
    me.disableButtons();

  //  me.getBusinessRulesStore().getProxy().setExtraParam('offset', me.pageOffset);
  //  me.getBusinessRulesStore().getProxy().setExtraParam('limit', me.pageLimit);
  //  me.getBusinessRulesStore().load();
  me.showView();
  },

  movePrev:function() {
    console.log("movePrev selected");
    var me = this;
    me.retainQueryParam = true;
    me.pageOffset -= me.pageLimit;
    if(me.pageOffset < 0){
      pageOffset = 0;
    }
    me.disableButtons();

    //  me.getBusinessRulesStore().load();
    me.showView();
  },

  moveFirst:function() {
    console.log("moveFirst selected");
    var me = this;
    me.pageOffset = 0;
    me.retainQueryParam = true;
      //me.getBusinessRulesStore().load();
    me.disableButtons();

      me.showView();
  },

  moveLast:function() {
    console.log("moveLast selected");
    var me = this;
    me.retainQueryParam = true;
    me.pageOffset = (me.count%me.pageLimit===0)?(me.pageLimit*((me.count/me.pageLimit)-1)):(me.pageLimit*Math.floor(me.count/me.pageLimit));
//    me.getBusinessRulesStore().load();
    me.disableButtons();

me.showView();
  },
onSearchClick : function(){
  var rulename = Ext.getCmp('rulename').value;
  var type = Ext.getCmp('type').value;
  var status = Ext.getCmp('status').value;
  var messageType = Ext.getCmp('messageType').value ;
      var me = this;
      var filter = "";

      if(rulename !== ""){
        if(filter === "" ){
        filter += "name eq \'"+rulename+"\' ";
        }else{
        filter +="and name eq \'"+rulename+"\' ";
        }
      }
      var iActive;
      me.pageOffset = 0;
      if(status !== null){

        if(status === "Active"){
          iActive = true;
        }else{
          iActive = false;
        }
        
        if(filter === "" ){
        filter += "isActive eq "+iActive+" ";
        }else{
        filter +="and isActive eq "+iActive+" ";
        }

      }

      if(type !== null){
        if(filter === "" ){
        filter += "type eq \'"+type+"\' ";
        }else{
        filter +="and type eq \'"+type+"\' ";
        }
      }
      me.filterString = filter;
      me.showView();
     /* if(messageType !== ""){
        if(filter === "?filter=" ){
        filter += "message eq \'"+messageType+"\' ";
        }else{
        filter +="and message eq \'"+messageType+"\' ";
        }
      }
      */
},
onClearClick : function(button){
Ext.getCmp('rulename').setValue(""); 
Ext.getCmp('type').setValue(null);
Ext.getCmp('status').setValue('Active');
Ext.getCmp('messageType').setValue("");
var me = this;
me.filterString = null;
me.pageOffset = 0;
me.showView();
},
onLaunch:function(){
    console.log("Launch of BusinessRulesSummaryController");
    this.setFilterString(null);
    this.showView();
  },
configure:function(){
      console.log("configure of BusinessRulesSummaryController");
  },
ruleSelected:function(record,item,index,e,eOpts) {
    console.log("Rule Selected");
    if(this.isRuleSelected && this.selectedRuleId === item.data.id){
      this.isRuleSelected = false;
      this.setSelectedRuleId(null);
      this.setSelectedRuleName(null);
      this.setSelectedRuleType(null);
      this.setSelectedRuleDesc(null);
      this.setSelectedRuleIsActive(false);
      this.setSelectedRuleIsHardRule(false);
      this.setSelectedRuleFromDate(null);
      this.setSelectedRuleToDate(null);
      this.setSelectedScript(null);
      this.setSelectedModel(null);
      this.setSelectedMessage(null);
      this.disableButtons();
    }else {
      this.setSelectedRuleId(item.data.id);
      this.setSelectedRuleName(item.data.name);
      this.setSelectedRuleType(item.data.type);
      this.setSelectedRuleDesc(item.data.description);
      this.setSelectedRuleIsActive(item.data.isActive);
      this.setSelectedRuleIsHardRule(item.data.isHard);
      this.setSelectedRuleFromDate(item.data.effectiveFromDate);
      this.setSelectedRuleToDate(item.data.effectiveToDate);
      this.setSelectedScript(item.data.script);
      this.setSelectedModel(item.data.model);
      this.setSelectedMessage(item.data.message);
      this.isRuleSelected = true;
      this.enableButtons();
    }
  },
  disableButtons:function(){
    console.log("disableButtons");
    Ext.getCmp('manageSequenceButton').disable();
    Ext.getCmp('editRuleButton').disable();
    Ext.getCmp('deleteRuleButton').disable();
  },
  enableButtons:function(){
    console.log("enableButtons");
    // Ext.getCmp('manageSequenceButton').enable(); // TODO: Uncomment once manage sequence is handled
    Ext.getCmp('editRuleButton').enable();
    Ext.getCmp('deleteRuleButton').enable();
  },
  showView:function(){
    console.log("showView  BusinessRulesSummaryController");
    var me = this;

      if (!this.getBusinessRulesStore()) {
        this.setBusinessRulesStore(Ext.create('JDA.dm.BusinessRules.store.BusinessRulesSummaryStore'));
         // this.getBusinessRulesStore().on('load', callback, me);
      }
      var data;
      if(me.filterString){
        data = {
             offset: me.pageOffset,
             limit: me.pageLimit,
             filter : me.filterString
          };
      }else{
        data = {
             offset: me.pageOffset,
             limit: me.pageLimit
          };
      }
      RP.Ajax.useDefaultXhrHeader = false;
      RP.Ajax.request({
          url: RP.buildDataServiceUrl("connect","cxf/datamanagement/v1/rule"),//'http://861dq72j.jda.corp.local:8181/cxf/datamanagement/rule',
          method: 'GET',
          params: data,
          callback: function(options, success, response) {
            console.log("Success"+success);
            if(success) {
              console.log("response"+response.responseText);
              var res = Ext.decode(response.responseText, true);
              var records = [];
              if(res !== null && typeof (res) !== 'undefined'){
                Ext.each(res.data, function(obj){
                  var isActive = obj.attributes.isActive?RP.getMessage('dm.BusinessRules.messages.active'):RP.getMessage('dm.BusinessRules.messages.inactive');
                  records.push({
                    type: obj.attributes.type,
                    id: obj.id,
                    name: obj.attributes.name,
                    isActive: isActive,
                    isHard: obj.attributes.isHard,
                    description: obj.attributes.description,
                    effectiveFromDate: obj.attributes.effectiveFromDate,
                    effectiveToDate: obj.attributes.effectiveToDate,
                    script:obj.attributes.script,
                    model : obj.attributes.model,
                    message:obj.attributes.message
                  });
                });

                me.count = res.count;
              
        me.getBusinessRulesGrid().store.removeAll();
        me.getBusinessRulesStore().loadData(records);
        me.getBusinessRulesGrid().down('pagingtoolbar').store.totalCount = res.count;
        var bbar = Ext.getCmp('BusinessRulesGrid').down('pagingtoolbar');
        //Fix : onLoad for empty records is resulting in ! in current page
        if(res.count!==0){
          bbar.displayMsg = "{0} - {1} of {2}";
          me.getBusinessRulesGrid().down('pagingtoolbar').onLoad();
        }else{
          me.getBusinessRulesGrid().getStore().removeAll();
          bbar.displayMsg = "No data to display";
          bbar.updateInfo();
        }
        me.getBusinessRulesGrid().reconfigure(me.getBusinessRulesStore());
                me.getBusinessRulesGrid().store = me.getBusinessRulesStore();
              }
            }else{
                console.log('Request failed');
                Ext.Msg.alert(RP.getMessage('dm.BusinessRules.messages.requestFailed'),RP.getMessage('dm.BusinessRules.messages.tryAgain'));
            }
          }
      });
  },
    showAddRulePage:function()
    {
      var config = [];
      config.push({
        isRuleAdded:false
      });
      RP.mvc.QuickAppManager.load('JDA.dm.BusinessRules.RuleDetailsPanelPage', {
          config:config,
          onClose: Ext.Function.bind(this.resetBusinessRulesSummary, this),
          destroyOnClose: true
        });
    },

    showEditRulePage:function()
    {
      var config = [];
      config.push({
        ruleName:this.selectedRuleName,
        ruleType:this.selectedRuleType,
        ruleDesc:this.selectedRuleDesc,
        ruleActive:this.selectedRuleIsActive,
        ruleHard:this.selectedRuleIsHardRule,
        ruleEffectiveStartDate:this.selectedRuleFromDate,
        ruleEffectiveEndDate:this.selectedRuleToDate,
        script : this.selectedScript,
        model : this.selectedModel,
        message : this.selectedMessage,
        isRuleUpdated:false
      });
      RP.mvc.QuickAppManager.load('JDA.dm.BusinessRules.RuleDetailsPanelPage', {
            config:config,
            onClose: Ext.Function.bind(this.resetBusinessRulesSummary, this),
            destroyOnClose: true
        });
    },

    deleteRule:function()
    {
      console.log("Delete Rule");
      var me = this;
      RP.Ajax.useDefaultXhrHeader = false;
      Ext.MessageBox.confirm(RP.getMessage('dm.BusinessRules.messages.confirmDelete'), RP.getMessage('dm.BusinessRules.messages.confirmDeleteMessage')+this.selectedRuleName+"?",function(btn, text){
        if (btn == 'yes'){
          var deleteUrl = "cxf/datamanagement/v1/rule/" + me.selectedRuleId;
          RP.Ajax.request({
            url: RP.buildDataServiceUrl("connect",deleteUrl),//'http://861dq72j.jda.corp.local:8181/cxf/datamanagement/rule',
            method: 'DELETE',
            params: {
            },
            callback: function(options, success, response) {
              console.log("Success"+success);
              if(success) {
                console.log("response"+response.responseText);
                console.log("rule Deleted");
                me.showView();
                me.setSelectedRuleId(null);
                var msg = Ext.create('Ext.window.MessageBox');
                msg.alert(RP.getMessage('dm.BusinessRules.messages.success'), RP.getMessage('dm.BusinessRules.messages.deleteSuccess'));
                me.disableButtons();
              }else{
                console.log('Delete failed');
                Ext.Msg.alert(RP.getMessage('dm.BusinessRules.messages.deleteFailed'),response.responseText.substring(12,response.responseText.indexOf(',')-1));
              }
            }
          });
        }
      });
    },

    resetBusinessRulesSummary:function(config)
    {
      //reset all the values
      console.log("resetBusinessRulesSummary of BusinessRulesSummaryController");
      var msg;
      if(config && config.config[0]){
        console.log("Show alert message");
        if(config.config[0].isRuleUpdated) {
          if(config.config[0].isRuleUpdated === true){
            msg = Ext.create('Ext.window.MessageBox');
            msg.alert(RP.getMessage('dm.BusinessRules.messages.success'), RP.getMessage('dm.BusinessRules.messages.updateSuccess'));
          }
        }else if(config.config[0].isRuleAdded){
          if(config.config[0].isRuleAdded === true){
            msg = Ext.create('Ext.window.MessageBox');
            msg.alert(RP.getMessage('dm.BusinessRules.messages.success'), RP.getMessage('dm.BusinessRules.messages.addSuccess'));
          }
        }
      }
      this.showView();
      this.disableButtons();
      this.setSelectedRuleId(null);
    },

    close: function() {
        this.resetBusinessRulesSummary();
        // this.application.taskForm.close();
    }
});
