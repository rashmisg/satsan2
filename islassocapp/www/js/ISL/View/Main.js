Ext.define('Jda.ISL.View.Main', {
    extend: 'Jda.ISL.View.PullToRefreshContainer',
    config: {
      id: 'pull-refresh-container',
      layout: {
        type: 'vbox'
      },
      scrollable:{
        direction:'vertical'
      },
      flex: 1,
      items: {
        xtype: 'dataview',
        itemId: 'task-list',
        layout: 'auto',
        style: {

        },
        // scrollable:{
        //   direction:'vertical'
        // },
        scrollable: null,
        margin: '0px',
        itemHeight: 42,
        loadingText: null,
        itemTpl: new Ext.XTemplate(
        ['<div class="list-item-border">',
        '<div class="tasklist-column-color" style="background-color: {type_color}"> </div>',
          '<div class="Column">',
          '<div class="Row">',
          '<div class="Column-type">{type}</div>',
          '<div class="Column-time">{[this.getRelativeTime(values.created)]}</div>',
          '</div>',
          "<tpl if='type == \"Misplaced Item\"'>",
          '<div class="task-description">{[this.getTaskDescriptionFormattedString(values)]}</div>',
          "<tpl else>",
          '<div class="task-description">{[this.getTaskDescriptionFormattedString(values)]}</div>',
          "</tpl>",
          '</div>',
          '</div>'
        ].join(''), {
            getRelativeTime: function(datetime) {
                var d = new Date(datetime);
                if(datetime === "" || datetime === undefined) {
                  d = new Date();
                  return Jda.ISL.Util.TimeUtil.timeDifference(d.getTime(), d.getTime());
                }

                // get current system date
                var now = new Date();
                // Convert current system date time to UTC
                var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());                                
                // Use UTC converted time to calculate the time difference
                return Jda.ISL.Util.TimeUtil.timeDifference(now_utc.getTime(), d.getTime());
            },
            getTaskDescriptionFormattedString: function(values) {

              var description = values.quantity + ' ' + values.name;
              if(values.type === 'Misplaced Item') {
                description = values.quantity + ' ' + values.name + ' from ' + values.from_loc;
              }

              // if(description.length > 40) {
              //   return description.substring(0,40)+'...';
              // }
              return description;
            }
          }
        ),
        infinite: true
      }
    }
});
