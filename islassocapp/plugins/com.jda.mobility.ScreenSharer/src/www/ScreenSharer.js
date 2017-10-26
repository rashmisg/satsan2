/**
 * Plugin class that allows screen capture.
 *
 * ## Take a screenshot and present to native mail application
 *     Jda.mobility.plugins.screenshotAndSend( function(){doSomethingAfterSuccess();},
 *                                             function()){doSomethingAfterFailure();},
 *                                             [arrayOfOptions] );
 *
 * ## Take a screenshot, allow annotation, and present to native mail application
 *     Jda.mobility.plugins.screenshotAnnotateAndSend( function(){doSomethingAfterSuccess();},
 *                                                     function()){doSomethingAfterFailure();},
 *                                                     [arrayOfOptions] );
 *
 * @class Jda.mobility.plugins.ScreenSharer
 */

/**
 * Takes a screenshot of the app, then presents the mail interface with the screenshot attached.
 * @param {Function} success A success callback function. Assuming your exec call
 * completes successfully, this function executes along with any parameters you pass to it.
 * @param {Function} failure  An error callback function. If the operation does not
 * complete successfully, this function executes with an optional error parameter.
 * @param {Array} [mailConfig] Array of arguments passed to the native mailer method.
 * The mailConfig is optional, and should match that of the Mailer (which this plugin uses).
 */
 exports.screenshotAndSend = function(success, failure, mailConfig) {
    cordova.exec(success, failure, 'ScreenSharer', 'screenshotAndSend', [ mailConfig ]);
};

/**
 * Takes a screenshot of the app, allows the user to annotate it, then presents
 * the mail interface with the screenshot attached.
 * @param {Function} success A success callback function. Assuming your exec call
 * completes successfully, this function executes along with any parameters you pass to it.
 * @param {Function} failure  An error callback function. If the operation does not
 * complete successfully, this function executes with an optional error parameter.
 * @param {Array} [mailConfig] Array of arguments passed to the native mailer method.
 * The mailConfig is optional, and should match that of the Mailer (which this plugin uses).
 */
exports.screenshotAnnotateAndSend = function(success, failure, mailConfig) {
    cordova.exec(success, failure, 'ScreenSharer', 'screenshotAnnotateAndSend', [ mailConfig ]);
};
