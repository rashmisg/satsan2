/**
 * This override adds a {@link #labelRows} option to draw horizontal axis labels on multiple
 * rows, and also an {@link #hideOverlappingLabels} option.
 */
Ext.define('Ext.ux.chart.axis.Axis.OverlappingLabelOptions', {
    override: 'Ext.chart.axis.Axis',
    alternateClassName: 'Ext.ux.AxisOverlappingLabelOptions',

    /**
     * @cfg {Integer/String}
     *
     * Number of label rows. If this option is set to 'auto', then overlapping labels will
     * be drawn on the next row where they don't overlap. Which can give a messy result.
     */
   labelRows: 1,

    /**
     * @cfg {Boolean}
     *
     * Set to false to prevent automatic hiding of overlapping labels.
     */
  hideOverlappingLabels: true,

   drawHorizontalLabels: function() {
        var me = this,
            labelConf = me.label,
            floor = Math.floor,
            max = Math.max,
            axes = me.chart.axes,
            insetPadding = me.chart.insetPadding,
            gutters = me.chart.maxGutters,
            position = me.position,
            inflections = me.inflections,
            ln = inflections.length,
            labels = me.labels,
            maxHeight = 0,
            ratio,
            bbox, point, prevLabel, prevLabelId,
            adjustEnd = me.adjustEnd,
            hasLeft = axes.findIndex('position', 'left') != -1,
            hasRight = axes.findIndex('position', 'right') != -1,
            textLabel, text,
            last, x, y, i, firstLabel;

        var labelRows = Ext.num(this.labelRows, 1),
            autoOffsetLabels = this.labelRows === 'auto',
            hideLabels = this.hideOverlappingLabels;

        var lastLabelOnRow = [],
            row, j;

        last = ln - 1;
        //get a reference to the first text label dimensions
        point = inflections[0];
        firstLabel = me.getOrCreateLabel(0, me.label.renderer(labels[0]));
        ratio = Math.floor(Math.abs(Math.sin(labelConf.rotate && (labelConf.rotate.degrees * Math.PI / 180) || 0)));

        for (i = 0; i < ln; i++) {
            row = 0; // rx: start at first row
            point = inflections[i];
            text = me.label.renderer(labels[i]);
            textLabel = me.getOrCreateLabel(i, text);
            bbox = textLabel._bbox;
            //maxHeight = max(maxHeight, bbox.height + me.dashSize + me.label.padding);
            x = floor(point[0] - (ratio ? bbox.height : bbox.width) / 2);
            if (adjustEnd && gutters.left === 0 && gutters.right === 0) {
                if (i === 0 && !hasLeft) {
                    x = point[0];
                }
                else if (i == last && !hasRight) {
                    x = Math.min(x, point[0] - bbox.width + insetPadding);
                }
            }
            if (position == 'top') {
                y = point[1] - (me.dashSize * 2) - me.label.padding - (bbox.height / 2);
            }
            else {
                y = point[1] + (me.dashSize * 2) + me.label.padding + (bbox.height / 2);
            }

            // rx: vertical offset
            y += (i % labelRows) * bbox.height;

            textLabel.setAttributes({
                hidden: false,
                x: x,
                y: y
            }, true);

            if (autoOffsetLabels) {
                // rx: find the row on which we can draw the label without overlapping
                for (j=0; j<lastLabelOnRow.length; j++) {
                    if (me.intersect(textLabel, lastLabelOnRow[j])) {
                        row++;
                        textLabel.setAttributes({
                            y: y + row * bbox.height
                        }, true);
                    }
                }

                // rx: calc maxHeight knowing the row
                maxHeight = max(maxHeight, bbox.height + me.dashSize + me.label.padding + (bbox.height * row));

                // rx: keep reference to know where we can place the next label
                lastLabelOnRow[row] = textLabel;
            } else {

                if (hideLabels) {
                    // Skip label if there isn't available minimum space
                    if (i !== 0 && (me.intersect(textLabel, prevLabel)|| me.intersect(textLabel, firstLabel))) {
                        if (i === last && prevLabelId !== 0) {
                            prevLabel.hide(true);
                        } else {
                            textLabel.hide(true);
                            continue;
                        }
                    }
                }

                maxHeight = max(maxHeight, bbox.height + me.dashSize + me.label.padding + bbox.height * (i % labelRows));
            }

            prevLabel = textLabel;
            prevLabelId = i;
        }

        return maxHeight;
    }
});


Ext.create('Ext.data.Store', {
    storeId: 'groupByStore',
    fields: ['groupBy'],
    data: [{
        groupBy: 'Message Type'
    }]
});

Ext.create('Ext.data.Store', {
    storeId: 'displayByStore',
    fields: ['displayBy'],
    data: [
          {displayBy: '1 Hour'}
    ]
});

Ext.create('Ext.data.Store', {
    storeId: 'displayByDayStore',
    fields: ['displayBy'],
    data: [{
        displayBy: '1 Day'
    }]
});

Ext.create('Ext.data.Store', {
    storeId: 'gridData1',
    fields: ['TargetSystem', 'Received', 'Processed','Error','Total'],
    data: [
        {
        "TargetSystem": "SCPO",
        "Received": "135",
        "Processed": "228",
        "Error" : "306",
        'Total' :  '669'
    },{
        "TargetSystem": "WMS", 
        "Received": "43",
        "Processed": "89",
        "Error" : "14",
        "Total" : "148"
    },{
        "TargetSystem": "TMS", 
        "Received": "16",
        "Processed": "76",
        "Error" : "306",
        "Total" : "398"
    }]
});

Ext.create('Ext.data.Store', {
    storeId: 'periodStore',
    fields: ['period' ],
        data: [
            { period: RP.getMessage('dm.DashBoard.messages.lastDay')},
            { period: RP.getMessage('dm.DashBoard.messages.last2Days')},
            { period: RP.getMessage('dm.DashBoard.messages.last3Days')},
            { period: RP.getMessage('dm.DashBoard.messages.last4Hours')},
            { period: RP.getMessage('dm.DashBoard.messages.last12Hours')},
            { period: RP.getMessage('dm.DashBoard.messages.lastWeek')},
            { period: RP.getMessage('dm.DashBoard.messages.lastMonth')}
        ]

});

Ext.create('Ext.data.Store', {
    storeId: 'directionStore',
    fields: ['direction' ],
        data: [
            { direction: 'All directions'},
            { direction: 'RECEIVED'},
            { direction: 'SENT'}
        ]
});

 Ext.define('Ext.data.reader.targetSystemReader', {
    extend: 'Ext.data.reader.Json',
    getResponseData : function(response) {     
        var data = this.callParent([response]);
        //console.log(process.env);
        return data;
    },
    root: 'data'
});
 
 Ext.create('Ext.data.Store', {
               storeId: 'targetSystemStore',
                fields: ['targetSystem'],
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    root:'data',
                    headers: { 'Content-Type' : 'application/json' },
                    url: window.location.protocol+"//"+window.location.host+'/stash/Deploy/config/application.json',
                    reader: Ext.create('Ext.data.reader.targetSystemReader', {}),
                    writer: {
                        type: 'json'
                    }
                }


});


Ext.create('Ext.data.Store', {
    storeId: 'statusStore',
    fields: ['status' ],
        data: [
            { status: 'All status'},
            { status: 'Received'},
            { status: 'Processed'},
            { status: 'Error'}
        ]
});

Ext.create('Ext.data.Store', {
    storeId: 'messageTypeStore',
    fields: ['messageType' ],
       autoLoad: true,
                proxy: {
                    type: 'ajax',
                    root:'data',
                    headers: { 'Content-Type' : 'application/json' },
                    //the store will get the content from the .json file
                   // url:'//controllist.json',
                    url: window.location.protocol+"//"+window.location.host+'/stash/Deploy/config/messageType.json',
                    reader: Ext.create('Ext.data.reader.targetSystemReader', {}),
                    writer: {
                        type: 'json'
                    }
                }


});


Ext.define('JDA.dm.IntegrationDashboard.view.IntegrationDashboardView', {
    extend: 'Ext.Panel',
    xtype: 'dashboard-chart',
    id: 'integrationDashboardView',
    namespace: 'JDA.dm.IntegrationDashboard.view',
    controller: 'IntegrationDashBoardController',
    init: function() {
        var me = this;
        if (!me.store) {
            me.store = Ext.getStore('JDA.dm.IntegrationDashboard.store.IntegrationDashboardStore');
        }
        this.getParent();
    },
    initComponent: function() {
        var me = this;
        var ChartE = Ext.create('Ext.chart.Chart', {
            height: 300,
            width: 'auto',
            minWidth:2200,
            id: 'TimeBucketChart',
            cls:'chart-padding',
            padding:'0,7,7,7',
            insetPadding: 70,
            animate: false,
            shadow: false,
            style:'margin-left: 50px;',
            store: 'JDA.dm.IntegrationDashboard.store.IntegrationDashboardStore',
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['count'],
                label: {
                    renderer: function(v) {
                        return v;
                    }
                },
                grid: true,
                minimum: 0
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['DisplayBy'],
                grid: false,
                //hideOverlappingLabels: false,

                label: {
                    rotate: {
                        degrees: -45
                    },renderer: function(v) {
                        return v;
                    }
                }
            }],
            series: [{
                id:'errorColumnChart',
                type: 'column',
                axis: 'left',
                xField: 'DisplayBy',
                yField: 'count',
                // getGutters:function(){
                //         return[0,30];
                // },
                showInLegend: false,
                // colorSet: ['#0000FF','#FFffff','#00FF00'],
                style: {
                    opacity: 0.80,
                    width: 20
                },
                label: {
                    display: 'outside',
                    'text-anchor': 'middle',
                    field: ['count']
                }, 
                // highlight: {
                //     fill: '#000',
                //     'stroke-width': 20,
                //     stroke: '#fff'
                // },
                // tips: {
                //     trackMouse: true,
                //     style: 'background: #A6D1E6',
                //     // style: 'background: rgb(166,209,230)',
                //     // style :{
                //     // 'background': 'rgb(166,209,230)'    
                //     // },
                //     height: 20,
                //     renderer: function(storeItem, item) {
                //         this.setTitle(storeItem.get('count'));
                //     }
                // },
                listeners:{
                    itemclick:function(item, eOpts ){
                        console.log("chart column item selected");
                        var series = this.chart.series.get(0);
                        series.highlight = true;
                        item.highlighted = !item.highlighted;
                        series.unHighlightItem(item);
                        //series.cleanHighlights();
                        series.highlightItem(item);
                        series.highlight = false;
                    }
                },
                renderer: function(sprite, record, attr, index, store) {
                    return Ext.apply(attr, {
                        fill: '#1c8dc1'
                    });
                }
            }]
        });
        //create a grid that will list the dataset items.
        var gridPanelE = Ext.create('RP.ui.GridPanel', {
            margin: '0 3 3',
            minHeight: 150,
            width: 2200,
            id: 'DashBoardGridPanel',
            store: 'JDA.dm.IntegrationDashboard.store.IntegrationDashboardPanelStore',
            // forceFit: true,
            defaults: {
                sortable: true
            },
            columns: [],
            listeners:{
              itemclick:function(record, item, index, e, eOpts ){
                console.log("item selected");
                this.fireEvent('dashBoardProcessedGridItemSelected',record,item,index,e,eOpts);
              }}
        });

        var ChartP = Ext.create('Ext.chart.Chart', {
            height: 300,
            width: 'auto',
            minWidth:1800,
            id: 'TimeBucketProcessedChart',
            cls:'chart-padding',
            insetPadding: 70,
            style:'margin-left: 50px;',
            padding:'0,7,7,7',
            animate: false,
            shadow: false,
            store: 'JDA.dm.IntegrationDashboard.store.IntegrationDashboardStore',
     axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['count'],
                label: {
                    renderer: function(v) {
                        return v;
                    }
                },
                grid: true,
                minimum: 0
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['DisplayBy'],
                grid: false,
               // hideOverlappingLabels: false,
                label: {
                    rotate: {
                        degrees: -45
                    },renderer: function(v) {
                        return v;
                    }
                }
            }],
            series: [{
                type: 'column',
                axis: 'left',
                id:'processedColumnChart',
                xField: 'DisplayBy',
                yField: 'count',
                showInLegend: false ,
                // colorSet: ['#0000FF','#FFffff','#00FF00'],
                style: {
                    opacity: 0.80,
                    width: 20
                },
                label: {
                     display: 'outside',
                     'text-anchor': 'middle',
                     field: ['count']
                },
                // highlight: {
                    //fill: '#000'
                    // 'stroke-width': 40
                    // stroke: '#FF3F33'
                // },
                // tips: {
                //     trackMouse: true,
                //     style: 'background: #FFF',
                //     height: 20,
                //     renderer: function(storeItem, item) {
                //         this.setTitle(storeItem.get('count'));
                //     }
                // },
                listeners:{
                    itemclick:function(item, eOpts ){
                        console.log("chart column item selected");
                        var series = this.chart.series.get(0);
                        series.highlight = true;
                        item.highlighted = !item.highlighted;
                        series.unHighlightItem(item);
                        //series.cleanHighlights();
                        series.highlightItem(item);
                        series.highlight = false;
                    }
                },
                renderer: function(sprite, record, attr, index, store) {
                    return Ext.apply(attr, {
                       fill: '#1c8dc1'
                    });
                }
            }]
        });
        //create a grid that will list the dataset items.
        var gridPanelP = Ext.create('RP.ui.GridPanel', {
           margin: '0 3 3',
            minHeight: 150,
            width: 2200,
            id: 'DashBoardProcessedGridPanel',
            //    'min-height': '200px',
            store: 'JDA.dm.IntegrationDashboard.store.IntegrationDashboardPanelStore',
            // forceFit: true,
            defaults: {
                sortable: true
            },
            columns: [],
            listeners:{
              itemclick:function(record, item, index, e, eOpts ){
                console.log("item selected");
                this.fireEvent('dashBoardProcessedGridItemSelected',record,item,index,e,eOpts);
              }}
        });


        me.items = [{
            xtype: 'box',
            html: '<font size=5 face="robato"><b>Integration Dashboard</b></font>',
            padding: 10
        },{
            xtype: 'panel',
            padding: '8 8 8 8',
            id:'TabpanelParent',
            layout: 'fit',
            items: [{
                xtype: 'tabpanel',
                id:'TabPanel',
               // autoScroll: true,
                items: [{
                        title: '',
                        id: 'ErrorPanelP',
                        plain: true,
                        height:500,
                        autoScroll: true,
                        layout: {
                            align: 'stretch'
                     
                        },
                        defaults: {
                            active: true
                        },
                        items: [ChartE, gridPanelE]
                    },
                    {
                        title: '',
                        id: 'ProcessedPanel',
                        autoScroll: true,
                        height:500,
                        plain: true,
                        layout: {
                            align: 'stretch'
                        },
                        defaults: {
                            active: true
                        },
                        items: [ChartP, gridPanelP]
                    }
                ]
            }],
            dockedItems: [{
                xtype: 'toolbar',
                id : "integrationtoolbar",
                dock: 'left',
                padding: 10,

                // defaultType: 'combo',
                items: [{
                        xtype: 'label',
                        text: RP.getMessage('dm.DashBoard.messages.application')
                    },
                    {
                        xtype: 'combo',
                        id: 'targetSystemCombo',
                        multiSelect: true,
                        // fieldLabel: 'TargetSystem',
                        // labelStyle: 'width:60px',
                        Alignlabel: 'right',
                        // width:'20%',
                        // padding:{'left':80},
                        name: 'type',
                        forceSelection: true,
                        typeAheadDelay: 50,
                        // typeAhead:true,
                        autoSelect: true,
                        minChars: 1,
                        anyMatch: true,
                        store: Ext.data.StoreManager.lookup('targetSystemStore'),
                        displayField: 'targetSystem',
                        valueField: 'targetSystem',
                        value:  'All target systems',
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                console.log(newValue);
                            }
                        }
                    },

                    {
                        xtype: 'container',
                        height: 20
                    }, {
                        xtype: 'label',
                        text: RP.getMessage('dm.DashBoard.messages.messageType')
                    },
                    {
                        xtype: 'combo',
                        id: 'messageTypeCombo',
                        multiSelect: true,
                        // fieldLabel: 'Message Type',
                        // labelStyle: 'width:80px',
                        labelAlign: 'right',
                        width: '30px',
                        // padding:{'left':80},
                        name: 'type',
                        forceSelection: true,
                        typeAheadDelay: 50,
                        // typeAhead:true,
                        autoSelect: true,
                        minChars: 1,
                        anyMatch: true,
                        store: Ext.data.StoreManager.lookup('messageTypeStore'),
                        displayField: 'messageType',
                        valueField: 'messageType',
                        value:  'All message types'
                    }, {
                    //     xtype: 'container',
                    //     height: 20
                    // },{
                    //     xtype: 'label',
                    //     text: RP.getMessage('dm.DashBoard.messages.groupBy')
                    // }, {
                    //     xtype: 'combo',
                    //     id: 'groupByCombo',
                    //     labelAlign: 'right',
                    //     forceSelection: true,
                    //     typeAheadDelay: 50,
                    //     typeAhead: true,
                    //     autoSelect: true,
                    //     // allowBlank: false,
                    //     minChars: 1,
                    //     anyMatch: true,
                    //     store: Ext.data.StoreManager.lookup('groupByStore'),
                    //     displayField: 'groupBy',
                    //     valueField: 'groupBy',
                    //     value: Ext.data.StoreManager.lookup('groupByStore').getAt(0).get('groupBy')
                    // }, {
                        xtype: 'container',
                        height: 20
                    }, {
                        xtype: 'label',
                        text: RP.getMessage('dm.DashBoard.messages.period')
                    }, {
                        xtype: 'combo',
                        id: 'periodStoreCombo',
                        labelAlign: 'right',
                        forceSelection: true,
                        typeAheadDelay: 50,
                        typeAhead: true,
                        autoSelect: true,
                        // allowBlank: false,
                        minChars: 1,
                        anyMatch: true,
                        store: Ext.data.StoreManager.lookup('periodStore'),
                        displayField: 'period',
                        valueField: 'period',
                        value: Ext.data.StoreManager.lookup('periodStore').getAt(0).get('period'),
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                console.log(newValue);
                                this.fireEvent('periodValueChanged',field,newValue,oldValue);
                            }
                        }
                    }, {
                        xtype: 'container',
                        height: 20
                    }, {
                        xtype: 'label',
                        text: RP.getMessage('dm.DashBoard.messages.displayBy')
                    }, {
                        xtype: 'combo',
                        id: 'displayByCombo',
                        labelAlign: 'right',
                        forceSelection: true,
                        typeAheadDelay: 50,
                        typeAhead: true,
                        autoSelect: true,
                        // allowBlank: false,
                        minChars: 1,
                        anyMatch: true,
                        store: Ext.data.StoreManager.lookup('displayByStore'),
                        displayField: 'displayBy',
                        valueField: 'displayBy',
                        value: Ext.data.StoreManager.lookup('displayByStore').getAt(0).get('displayBy')
                    }, {
                        xtype: 'container',
                        height: 10
                    },
                    {
                        xtype: 'button',
                        text: '<div style="color: #FAFAFA">' + RP.getMessage('dm.DashBoard.messages.apply')+ '</div>',
                        id: 'submitButton',
                        height : 35,
                        cls: 'button-highlight',
                        handler: function() {}
                    }
                ]
            }]
        }];
        this.callParent();
    }



});