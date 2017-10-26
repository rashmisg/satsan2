/**
 * Plugin class used to manage the adding, removal, and triggering of notifications.
 *
 * ## Adding a listener
 *     var handlerId = Jda.mobility.plugins.NotificationManager.addListener( 'DID_COMPLETE_TASK', function(){} );
 *
 * ## Removing a listener
 *     Jda.mobility.plugins.NotificationManager.removeListener( 'DID_COMPLETE_TASK', handlerId );
 *
 * ## Posting a notification
 *     Jda.mobility.plugins.NotificationManager.postNotification( Jda.mobility.constants.Notifications.REAUTH_PROMPT_NOTIFICATION );
 *     Jda.mobility.plugins.NotificationManager.postNotification( Jda.mobility.constants.Notifications.REAUTH_SUCCESS_NOTIFICATION );
 *
 * @class Jda.mobility.plugins.NotificationManager
 */

/**
 * @private
 * @property {Number} nextUniqueHandlerId
 * Number of handlers currently listening for notifications.
 */
var nextUniqueHandlerId = 0;

/**
 * Registers a listener that gets triggered by a posted notification with a matching notificationName.
 * See {@link Jda.mobility.plugins.NotificationManager#postNotification}
 * @param {String} notificationName The name of the notification that triggers the listeners handler.
 * @param {String} [handler] The function handle to call when the listener is triggered.
 * @return {Number} The unique id corresponding to the added handler.
 */
exports.addListener = function(notificationName, handler) {
    var handlerId = nextUniqueHandlerId++;

    cordova.exec(handler, undefined, "NotificationManager", "addListener", [ notificationName, handlerId ]);

    return handlerId;
};

/**
 * Removes an added listener if one exists.
 * @param {String} notificationName The name of an added listener. This parameter coresponds to
 * the notificationName registered by any listeners that were added using {@link Jda.mobility.plugins.NotificationManager#addListener}.
 * @param {Number} [handlerId] The id returned by {@link Jda.mobility.plugins.NotificationManager#addListener}.
 * {@link Jda.mobility.plugins.NotificationManager#addListener}.
 */
exports.removeListener = function(notificationName, handlerId) {
    cordova.exec(undefined, undefined, "NotificationManager", "removeListener", [ notificationName, handlerId ]);
};

 /**
  * Posts a notification using the native platforms notification mechanism. Any listeners that have been
  * added with a matching notificationName parameter will be called as result.
  * @param {String} notificationName The name of an added listener. This parameter coresponds to
  * the notificationName registered by any listeners that were added using {@link Jda.mobility.plugins.NotificationManager#addListener}.
  * @param {Object} [userInfo] An optional key/value set passed along with the notification to registerd listeners.
  */
exports.postNotification = function(notificationName, userInfo) {
    cordova.exec(undefined, undefined, "NotificationManager", "postNotification", [ notificationName, userInfo ? userInfo : {} ]);
};
