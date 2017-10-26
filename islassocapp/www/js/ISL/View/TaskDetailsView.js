Ext.define('Jda.ISL.View.TaskDetailsView', {
  extend: 'Ext.Panel',

  config: {
    layout: 'vbox',
    id: 'task-detail-view',
    scrollable: {
      direction: 'vertical',
      directionLock: true,
      momentumEasing: {
        momentum: {
          acceleration: 30,
          friction: 0.5
        },
        bounce: {
          acceleration: 0.0001,
          springTension: 0.9999
        },
        minVelocity: 5
      },
      outOfBoundRestrictFactor: 0
    },
    items: [{
      xtype: 'container',
      layout: 'vbox',
      id: 'task-top-container',
      items: [{
        xtype: 'image',
        flex: 5,
        itemId: 'itemImage',
        src: '',
        cls: 'task-details-img'
          // height: '150px'
      }, {
        xtype: 'container',
        itemId: 'itemdetails',
        cls: 'shadow',
        padding: 15,
        flex: 3,
        tpl: new Ext.XTemplate(
          ['<div class="task-itemdetails">',
            '<p class="task-item-detail-name">{name}</p>',
            '<p>{color}</p>',
            '<p>{size}</p>',
            '</div>'
          ].join('')
        )
      }, {
        xtype: 'container',
        itemId: 'typebar',
        cls: 'shadow',
        margin: 0,
        flex: 1,
        tpl: new Ext.XTemplate(
          [
            '<div id="type-bar" class="typebar">',
            '<div class="color-bar"></div>',
            '<div class="task-type">{type}</div>',
            '<div id="timeElapsed" class="task-time">{[this.getRelativeTime(values.created)]}</div>',
            '</div>'
          ].join(''), {
            getRelativeTime: function(datetime) {
              var d = new Date(datetime);
              if (datetime === "" || datetime === undefined) {
                d = new Date();
                return Jda.ISL.Util.TimeUtil.timeDifference(d, d.getTime() + d.getTimezoneOffset() * 60);
              }
              // get current system date
              var now = new Date();
              // Convert current system date time to UTC
              var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
              // Use UTC converted time to calculate the time difference
              return Jda.ISL.Util.TimeUtil.timeDifference(now_utc, d.getTime() + d.getTimezoneOffset() * 60);
            }
          }
        )
      }]
    }, {
      xtype: 'container',
      layout: 'vbox',
      items: [{
        xtype: 'container',
        id: 'itemlocation',
        cls: 'task-itemlocation',
        layout: 'hbox',
        flex: 2,
        items: [{
          xtype: 'container',
          flex: 50,
          cls: ['task-itemlocation-from', 'right-arrow'],
          layout: 'vbox',
          items: [{
            xtype: 'button',
            id: 'from-booth',
            itemId: 'from',
            cls: 'location-top-shadow',
            flex: 8,
            tpl: new Ext.XTemplate(
              ['<div class="task-details">',
                '<p class="booth-location-text">{[Jda.getMessage(\'jda.ISL.Location\')]}</p>',
                '<p class="booth-location">{from_loc}</p>',
                '<p class="booth-section">{from_section}</p>',
                '<tpl if = "isHide">',
                '<p class="task-detail-from-Loc hide">{[Jda.getMessage(\'jda.ISL.WhereIsIt\')]}</p>',
                '<tpl else>',
                '<p class="task-detail-from-Loc">{[Jda.getMessage(\'jda.ISL.WhereIsIt\')]}</p>',
                '</tpl>',
                '</div>'
              ].join('')
            )
          }, {
            xtype: 'container',
            id: 'booth-orange',
           // cls: 'task-detail-orange-bar',
            docked: 'bottom',
            flex: 2
          }]
        }, {
          xtype: 'container',
          cls: 'task-itemlocation-to',
          flex: 50,
          layout: 'vbox',
          items: [{
            xtype: 'button',
            flex: 8,
            id: 'to-booth',
            cls: 'location-top-shadow',
            itemId: 'to',
            tpl: new Ext.XTemplate(
              ['<div class="task-details">',
                '<p class="booth-location-text">{[Jda.getMessage(\'jda.ISL.ReturnTo\')]}</p>',
                '<p class="booth-location">{to_loc}</p>',
                '<p class="booth-section">{to_section}</p>',
                '<tpl if = "isHide">',
                '<p class="task-detail-to-Loc hide">{[Jda.getMessage(\'jda.ISL.WhereIsIt\')]}</p>',
                '<tpl else>',
                '<p class="task-detail-to-Loc">{[Jda.getMessage(\'jda.ISL.WhereIsIt\')]}</p>',
                '</tpl>',
                '</div>'
              ].join('')
            )
          }, {
            xtype: 'container',
            id: 'booth-green',
            cls: 'task-detail-green-bar',
            docked: 'bottom',
            flex: 2
          }]
        }]
      }, {
        xtype: 'container',
        layout: 'vbox',
        flex: 5,
        id: 'floor-planogram-container',
        items: [{
          xtype: 'container',
          layout: 'hbox',
          items: [{
            xtype: 'button',
            cls: 'floor-planogram-btn',
            id: 'floorplan',
            flex: 50,
            text: Jda.getMessage('jda.ISL.Floorplan')
          }, {
            xtype: 'button',
            cls: 'floor-planogram-btn',
            id: 'planogram',
            flex: 50,
            text: Jda.getMessage('jda.ISL.Planogram')
          }]
        }, {
          xtype: 'image',
          flex: 7,
          id: 'floor-planogram-Image',
          cls: 'task-details-floorplan-img',
          // height: '250px'
          listeners: {
            tap: {
              fn: function(event) {
                this.fireEvent('tap', this, event);
              },
              element: 'innerElement'
            }
          }
        }]
      }]
    }, {
      xtype: 'container',
      id: 'task-bottom-container',
      layout: 'hbox',
      cls: ['task-detail-button-cntr'],
      docked: 'bottom',
      height: '54px',
      //hidden: true,
      items: [{
        xtype: 'button',
        id: 'task-scan-button',
        cls: 'scan-icon',
        ui: 'action'
          //minWidth: '30%',
      }, {
        xtype: 'button',
        id: 'task-exception-button',
        cls: 'exception-icon',
        ui: 'action'
      }, {
        xtype: 'button',
        id: 'task-ok-button',
        cls: ['task-detail-done-button', 'shadow'],
        text: 'OK',
        width: '30%',
        hidden: true,
        height: '44px',
        docked: 'right'
      }, {
        xtype: 'button',
        id: 'task-done-button',
        cls: ['task-detail-done-button', 'shadow'],
        text: 'Done',
        width: '40%',
        height: '44px',
        docked: 'right'
      }, {
        xtype: 'label',
        id: 'task-exipred-label',
        html: '',
        docked: 'right'
      }]
    }]
  }
});
