Ext.define('JDA.dm.Utils.DataService', {
    singleton: true,
    urlFromCpsAccount: null,
    messageStoreFilterQuery:null,
    messageStoreControllerReference:null,

    getBaseUrl: function() {
      var baseUrl;
      baseUrl = "http://64.26.204.102:81"; //TODO: Update the url based on web service
      return baseUrl;
    },

    getRequestHeader: function() {
      var reqHdr = {
        "X-DreamFactory-Api-Key": JDA.dm.Utils.Constants.apikey
      };
      return reqHdr;
    },

    setMessageStoreFilterQuery:function(filterQuery){
      this.messageStoreFilterQuery = filterQuery;
    },

    getMessageStoreFilterQuery:function(){
      return this.messageStoreFilterQuery;
    },

    setMessageStoreControllerReference:function(controllerReference){
      this.messageStoreControllerReference = controllerReference;
    },

    getMessageStoreControllerReference:function(){
      return this.messageStoreControllerReference;
    },

    showNetworkFailure :function(){
      //Display network error here
    },

    hideLoadingMask:function(){
      Ext.select(".x-mask").remove();
      Ext.select(".x-mask-msg").hide();
      Ext.select(".x-mask-msg").hide();
    },

    // Change [{"column":"CreatedTimestamp","operator":"EQ","value":{"start":"2017-10-11T18:30:00.000Z","end":"2017-10-12T18:30:00.000Z"}}] to 
//[{"column":"CreatedTimestamp","operator":"LT","value":"2017-10-11T18:30:00.000Z"},{"column":"CreatedTimestamp","operator":"GT","value":"2017-10-12T18:30:00.000Z"}]
    convertDateTimeQuery:function(refsQuery){
      console.log("refsQuery" +refsQuery);
      var changedQuery = refsQuery.substring(0,refsQuery.indexOf("value")+7);
      changedQuery = changedQuery.replace("EQ","GT");
      changedQuery += refsQuery.substring(refsQuery.indexOf("start")+7,refsQuery.indexOf("start")+33);
      changedQuery += "},";
      changedQuery += refsQuery.substring(0,refsQuery.indexOf("value")+7);
      changedQuery = changedQuery.replace("EQ","LT");
      changedQuery += refsQuery.substring(refsQuery.indexOf("end")+5,refsQuery.indexOf("end")+31);
      changedQuery += "}";
      return changedQuery;
    }
});


Ext.data.Connection.override({
    request: function(options){
        var me = this;
        var updatedQuery,indexOfCreatedTimestamp,tempSubStringDateQuery,actualQuery;
        //remove empty query=[] 
        if(options.params){
          if(options.params.query && options.params.query.length === 2) {
            delete options.params.query;
          }else if(options.params.query && (options.params.query.match(/start/g) || []).length >= 1){
            var origQuery = options.params.query;
            var count = origQuery.match(/CreatedTimestamp/g).length;
            for(var loop=0;loop<count;loop++){
              indexOfCreatedTimestamp = origQuery.indexOf("CreatedTimestamp");
              tempSubStringDateQuery = origQuery.substring(indexOfCreatedTimestamp-11,indexOfCreatedTimestamp+112);
              actualQuery = tempSubStringDateQuery.substring(0,tempSubStringDateQuery.indexOf("}")+2);
              updatedQuery = JDA.dm.Utils.DataService.convertDateTimeQuery(actualQuery);
              origQuery = origQuery.substring(tempSubStringDateQuery.length+2,origQuery.length);
              options.params.query = options.params.query.replace(tempSubStringDateQuery,updatedQuery);

              console.log("updatedQuery" + updatedQuery);
            }
          }
        }
        return me.callOverridden(arguments);
    }
});
