/**
 * Plugin class used manage the page context.
 *
 * ## Get the current page context
 *     Jda.mobility.plugins.PageContextManager.getPageContext( function(pageContext) {
 *         //do something with pageContext object
 *     } );
 *
 * ## Get the last page context
 *     Jda.mobility.plugins.PageContextManager.getLastPageContext(); // context
 *
 * ## Get the URL from the CPS account
 *     Jda.mobility.plugins.PageContextManager.getUrlFromCpsAccount( 'happy/path',
 *         function(){ doSomethingSuccessful(); } ); // account
 *
 * ## Set the active tab
 *     Jda.mobility.plugins.PageContextManager.setActiveTab( 'happy/path' );
 *
 * @class Jda.mobility.plugins.PageContextManager
 */

/**
 * @private
 * @property {Object} _lastPageContext
 * Holds the last page context returned from the native application.
 */
var _lastPageContext;

/**
 * @method getPageContext
 * Gets a json object with the various context items from the native device.
 * @param {Function} cb Function that will be called with the context object.
 */
 function _getPageContext(cb) {
    var interceptorFn = function(pageContext) {
        _lastPageContext = pageContext;
        cb.apply(this, arguments);
    };

    cordova.exec(interceptorFn, undefined, 'PageContextManager', 'getPageContext', []);
}

/**
 * @method getLastPageContext
 * Returns a cached copy of the page context from when it was last retrieved.
 * @return {Object} {@link Jda.mobility.plugins.PageContextManager#_lastPageContext}
 */
 function _getLastPageContext() {
    return _lastPageContext;
}

/**
 * @method getUrlFromCpsAccount
 * Gets a url by name from the cps account.  Will send back `null` if the url
 * entry was not found.
 * @param {String} name Name of the url to fetch from the cps account.
 * @param {Function} cb Function that will be called with the url upon successful
 * return.
 */
function _getUrlFromCpsAccount(name, cb) {
    cordova.exec(cb, undefined, 'PageContextManager', 'getUrlFromCpsAccount', [ name ]);
}

/**
 * @private
 * @method setWebViewToActiveController
 * Updates the native controller to show the web view, which is hidden until it
 * has finished changing tabs.
 *
 * @param {String} route Route that will be set active.
 * @param {Function} cb Function called on upon successful completion.
 */
function _setWebViewToActiveController(route, cb) {
    cordova.exec(cb, undefined, 'PageContextManager', 'setWebViewToActiveController', [ route ]);
}

/**
 * @method setActiveTab
 * Sets the active tab to the specified route
 * @param {String} route Route to change to.
 */
function _setActiveTab(route) {
    cordova.exec(undefined, undefined, 'PageContextManager', 'setActiveTab', [ route ]);
}

module.exports = {
    getPageContext: _getPageContext,
    getLastPageContext: _getLastPageContext,
    getUrlFromCpsAccount: _getUrlFromCpsAccount,
    setWebViewToActiveController: _setWebViewToActiveController,
    setActiveTab: _setActiveTab
};
