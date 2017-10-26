Ext.define('Jda.ISL.Util.ImageUtil', {
    singleton: true,

    getRestockItemImage: function(itemId, callback) {
        var imageurl = './resources/' + itemId + '.jpg';
        // Check to see image exists
        Ext.Ajax.request({
            url: imageurl,
            method: 'GET',
            timeout: 1000,
            success: function(conn, response, options, eOpts) {
                return callback(imageurl);
            },
            failure: function(conn, response, options, eOpts) {
                //Return default image
                console.log('ImageUtil', 'Image does not exists, returning default image');
                return callback('./resources/jeans.jpg');
            }
        });
    },

    getPlanogramImage: function(location, callback) {
      console.log('getPlanogramImage');
        var imageurl = location ? './resources/' + 'planogram-' + location + '.png' : './resources/' + 'planogram.png';
        console.log('image url' + imageurl);
        // Check to see image exists
        Ext.Ajax.request({
            url: imageurl,
            method: 'GET',
            timeout: 1000,
            success: function(conn, response, options, eOpts) {
                return callback(imageurl);
            },
            failure: function(conn, response, options, eOpts) {
                //Return default image
                console.log('ImageUtil', 'Image does not exists, returning default image');
                return callback('./resources/jeans.jpg');
            }
        });
    }
});
