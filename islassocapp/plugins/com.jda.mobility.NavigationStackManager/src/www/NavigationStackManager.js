/**
 * Plugin class used to manage the navigation stack or configurable routes.
 *
 * @private
 * @class Jda.mobility.plugins.NavigationStackManager
 */

/**
 * @private
 * Pushes a given route to the navigation stack. As a result, adds to the native
 * view stack.
 * @param {String} route Route to resource location.
 * @param {Function} popCallback Success callback function.
 */
exports.pushController = function(route, popCallback) {
    cordova.exec(popCallback, undefined, "NavigationStackManager", "pushController", [ route ]);
};
