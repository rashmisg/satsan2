
Ext.define('Jda.ISL.View.ItemDamagedPopover', {
    extend: 'Ext.Container',
    config: {
        cls: 'escalate-popover',
        id: 'item-damage-popover',
        modal:true,
        layout: 'vbox',
        hideOnMaskTap: true,
        items: [{
          xtype:'label',
          html: '<div class="item-damaged">The product is damaged.</div>'
        }, {
          xtype:'label',
          html: '<div class="item-damaged-description">Well that\'s not good.</div><div class="item-damaged-description">Care to take a picture of it?</div>'
        },
      //   {
      //     xtype: 'image',
      //     id: 'damagedimage',
      //     //cls : 'imgcamerabutton'
      //     //src: './resources/camera.png',
      //     width: 150,
      //     height: 150
      // },
      {
          xtype: 'image',
          id: 'camerabutton',
          cls : 'imgcamerabutton',
          src: './resources/camera.png',
          listeners: {
                tap: function(btn) {
                    console.log('Image tapped!');
                    var panel = btn.up('container');
                      panel.getPhoto(navigator.camera.PictureSourceType.CAMERA);
                }
          // handler: function(btn) {
          //   var panel = btn.up('container');
          //   panel.getPhoto(navigator.camera.PictureSourceType.CAMERA);
          }
        },
          {
          xtype: 'container',
          flex: 2,
          layout: 'hbox',
          docked: 'bottom',
          items: [{
            xtype: 'button',
            cls: 'cancel-button',
            flex: 1,
            text: Jda.getMessage('jda.ISL.Cancel'),
            id: 'cancel-item-damage'
          }, {
            xtype: 'button',
            cls: ['send-button', 'shadow'],
            flex: 1,
            text: Jda.getMessage('jda.ISL.Send'),
            id: 'item-damage-send'
          }]
        }]
    },
    getPhoto: function(source) {
        var me = this;
        navigator.camera.getPicture(me.success, me.failure, {
            quality: 50,
            allowEdit : true,
            targetWidth: 200,
            targetHeight: 200,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: source
        });

    },

    success: function(image_uri) {
        var img = Ext.ComponentQuery.query('#camerabutton')[0];
        img.setSrc(image_uri);
        img.setCls('imgcameracaptured');
    },

    failure: function(message) {
        alert("Failed - " + message);
    }
});
