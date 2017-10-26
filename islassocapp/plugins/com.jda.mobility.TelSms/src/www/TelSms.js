/**
 * Plugin class that provides access to the calling and messaging features of the device.
 * Each platform displays the device features using native paradigms. The Android platform
 * displays the sms/tel features through a popup dialog. iOS on the other hand displays the
 * popover over the element and thus requires the element coordinates.
 *
 * ## SMS / Telephone dialog. Android Platform
 *     Jda.Cage.TelSms.promptForTelSms( success, failure,
 *         { phoneNumber: '17608451116' } );
 *
 * ## SMS / Telephone dialog. iOS Platform
 *     Jda.Cage.TelSms.promptForTelSms( success, failure,
 *         { x: 60,
 *           y: 60,
 *           phoneNumber: '17608451116' } );
 *
 * @class Jda.mobility.plugins.TelSms
 */

/**
 * @method promptForTelSms
 * Displays a native prompt for making sms/tel actions.
 * @param {Function} [callback] Callback to notify caller of success.
 * @param {Function} [callback] Callback to notify caller of failure.
 * @param {Object} config Key:Value set. Callers must provide the following
 * @param {Number} config.x Element horizontal coordinate position within the webview. (iOS only)
 * @param {Number} config.y Element vertical coordinate position within the webview. (iOS only)
 * @param {String} config.phoneNumber Phonenumber required for contact. Should be of the format
 * 12345678912
 * @param config.errorMessage Error message to return in the event of a failure.
 */
exports.promptForTelSms = function( success, failure, config ) {
    config.smsButtonText = Jda.getMessage( 'jda.mobility.telsms.sms' );
    config.telButtonText = Jda.getMessage( 'jda.mobility.telsms.tel' );

    cordova.exec(success, failure, "TelSms", "promptForTelSms", [ config ]);
};
