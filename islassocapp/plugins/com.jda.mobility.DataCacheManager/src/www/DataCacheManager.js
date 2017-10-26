/**
 * Plugin class used to manage the native web view cache.
 *
 * ## Save cache data
 *     Jda.mobility.plugins.DataCacheManager.saveData( 'FOO', [] );
 *
 * ## Load cache data
 *     Jda.mobility.plugins.DataCacheManager.loadData( 'FOO', function(results) {
 *         //do something with value
 *     } );
 *
 * ## Clear cache data
 *     Jda.mobility.plugins.DataCacheManager.clearCache();
 *
 * @class Jda.mobility.plugins.DataCacheManager
 */

 /**
  * Saves the web view cache data to the native device.
  * @param {String} id Identifier for the saved data.
  * @param {Array} data Cache data to save.
  */
exports.saveData = function(id, data) {
    cordova.exec(undefined, undefined, "DataCacheManager", "saveData", [ id, data ]);
};

/**
 * Loades the cache data corresponding to the id passed to @{Jda.mobility.plugins.DataCacheManager#saveData}.
 * @param {String} id Identifier for the saved data.
 * @param {Function} cb Success callback function.
 */
exports.loadData = function(id, cb) {
    cordova.exec(cb, undefined, "DataCacheManager", "loadData", [ id ]);
};

/**
 * Clears the cache data stored on the native device web view.
 */
exports.clearCache = function() {
    cordova.exec(undefined, undefined, "DataCacheManager", "clearCache", [ ]);
};
