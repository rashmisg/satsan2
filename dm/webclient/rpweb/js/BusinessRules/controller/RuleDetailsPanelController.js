Ext.define('JDA.dm.BusinessRules.controller.RuleDetailsPanelController', {
   extend: 'Ext.app.Controller',
   config: {
    isEditRule: false,
    isAddRule: false,
    selectedRuleName: null,
    isRuleUpdated:null,
    check: []
   },

  init: function() {
    var me = this;
    this.control({
      'button#save':{click:this.onsaveclick},
      'button#cancel':{click:this.onCancelclick}
      //,'combo#ruleType':{select:this.onRuleTypeSelect}
    });
  },

  launch:function(config) {
    console.log("launch of ruledetailspanel");
  },

  configure: function(config) {
    console.log("Configure of ruledetailspanel");
    this.isEditRule = this.isAddRule = false;
    var editRuleData;
    if(config.config && config.config[0]){
      if(config.config[0].isRuleUpdated === undefined ){
        this.isAddRule = true;
        editRuleData = config.config[0];
      }else{
        this.isEditRule = true;
        editRuleData = config.config[0];
        this._updateViewWithRule(editRuleData);
      }
    }
    this.check = editRuleData;
    console.log("editRuleData"+editRuleData);
  },

  _updateViewWithRule:function(editRuleData){
    Ext.getCmp('ruleName').setValue(editRuleData.ruleName);
    this.setSelectedRuleName(editRuleData.ruleName);
    Ext.getCmp('ruleName').readOnly = true;
    Ext.getCmp('description').setValue(editRuleData.ruleDesc);
    Ext.getCmp('ruleType').setValue(editRuleData.ruleType);
    Ext.getCmp('script').setValue(editRuleData.script);
    Ext.getCmp('message').setValue(editRuleData.message);
    Ext.getCmp('model').setValue(editRuleData.model);
    if(editRuleData.ruleActive == "Active"){
      Ext.getCmp('isActive').setValue(true);  
    }else{
      Ext.getCmp('isActive').setValue(false);
    }
    Ext.getCmp('isHard').setValue(editRuleData.ruleHard);
    var effectivePeriod = this._convertDatesToEffectiveDate(editRuleData.ruleEffectiveStartDate,editRuleData.ruleEffectiveEndDate);
    Ext.getCmp('effectivePeriod').setRawValue(effectivePeriod);
   // Ext.getCmp('message').setValue(editRuleData.message);
  //  Ext.getCmp('model').setValue(editRuleData.model);
  },

  _convertDatesToEffectiveDate:function(effectiveFromPeriod,effectiveToPeriod){
    var effectivePeriod;
    effectivePeriod = Ext.Date.format(new Date(effectiveFromPeriod), 'm/d/Y');
    effectivePeriod += " - " + Ext.Date.format(new Date(effectiveToPeriod), 'm/d/Y');
    return effectivePeriod;
  },

  _convertDate: function(effectivePeriod) {
    var effectiveFromPeriod = effectivePeriod.substr(0,10);
    var effectiveToPeriod = effectivePeriod.substr(13);

    if(effectiveFromPeriod !== "" && effectiveToPeriod === "") { // when only from date is selected
      return null;
    }

    effectiveFromPeriod = new Date(effectiveFromPeriod);
    effectiveToPeriod = new Date(effectiveToPeriod);
    
    var effectiveDatePeriod = new Array(2);
    // effectiveDatePeriod[0] = effectiveFromPeriod;
    // effectiveDatePeriod[1] = effectiveToPeriod;
    //TODO: Server needs to be updated to accept time in long format - getTime()
    effectiveDatePeriod[0] = effectiveFromPeriod.toISOString();
    effectiveDatePeriod[1] = effectiveToPeriod.toISOString();
    return effectiveDatePeriod;
  },

  onsaveclick:function(button){
    if(button.up('form').isValid())
    {
      console.log(button.up('form').getValues());
      var postJson = button.up('form').getValues();
      /*
      if(this.isEditRule){
        postJson.modifiedBy = "Naveen";//TODO: Remove this once server gets login name
      }else{
        postJson.createdBy = "Naveen";
        postJson.message = "TransferOrder"; // Manually adding message and model (just for tesing...should be removed later)
        postJson.model = "GS1"; 
      }
      */
      postJson.language = "XQuery";
      var effectivePeriod = this._convertDate(postJson.effectivePeriod);//TODO: check for null values
      if(effectivePeriod === null){
        Ext.Msg.alert(RP.getMessage('dm.BusinessRules.messages.invalidEffectivePeriod'),RP.getMessage('dm.BusinessRules.messages.selectEffectivePeriod'));
      } else {
        postJson.effectiveFromDate = effectivePeriod[0];
        postJson.effectiveToDate = effectivePeriod[1];
        delete postJson.effectivePeriod;
        var me = this;
        var urlMethod = (this.isEditRule)?'PUT':'POST';
        var postUrl = (this.isEditRule)?RP.buildDataServiceUrl("connect","cxf/datamanagement/v1/rule/"+this.selectedRuleName):RP.buildDataServiceUrl("connect","cxf/datamanagement/v1/rule");
        Ext.Ajax.useDefaultXhrHeader = false;
        Ext.Ajax.request({
          url: postUrl,
          jsonData : postJson,
          method: urlMethod,
          timeout: JDA.dm.Utils.Constants.AJAX_TIMEOUT,
          success: function(conn, response, options, eOpts) {
            var data = Ext.decode(conn.responseText);
            if (data.message == 'Created' || data.message == 'OK') {
              console.log('POST Success');
              button.up('form').getForm().reset();
              if(me.check) {
                if(me.check.isRuleUpdated !== undefined){
                  me.check.isRuleUpdated = true;  
                }else{
                  me.check.isRuleAdded = true;
                }
                
              }
              me.application.taskForm.close();
            }
          },
          failure: function(conn, response, options, eOpts) {
            console.log('POST failed');
            // Ext.Msg.alert(RP.getMessage('dm.BusinessRules.messages.postFailed'),conn.responseText.substring(12,conn.responseText.indexOf(',')-1));
          Ext.Msg.alert(RP.getMessage('dm.BusinessRules.messages.postFailed'),conn.responseText.substring(12,conn.responseText.indexOf(',')-1));
          }
        });
      }
    }
    else{
      Ext.Msg.alert('Form invalid','Please check the marked fields and try again');
    }
  },
  onCancelclick:function(button){
    button.up('form').getForm().reset();
    if(this.check) {
      if(this.check.isRuleUpdated !== undefined){
        this.check.isRuleUpdated = false;  
      }else if(this.check.isRuleAdded !== undefined){
        this.check.isRuleAdded = false;  
      }
      
    }
    this.application.taskForm.close();
  },
  alertCheck:function(){
    alert('hi');
  },
  close:function(){
    this.application.taskForm.close();
  },
  onRuleTypeSelect:function(combo,record,index){
    var ruleDetailsPanel=combo.up('form');
    function addendpanel(title){
      return Ext.create('Ext.panel.Panel',{
        title:'Expression Builder Panel for '+combo.getValue(),
        width:'100%',
        id:'endpanel'
      });
    }
    if(Ext.getCmp('endpanel')!='undefined')
    {
      ruleDetailsPanel.remove(Ext.getCmp('endpanel'));
    }
    ruleDetailsPanel.add(addendpanel(),ruleDetailsPanel.items.length);
  }
});
