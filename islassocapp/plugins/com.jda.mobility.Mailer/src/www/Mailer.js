/**
 * Plugin class used show and hide the loading mask.
 *
 * ## Show/send the native mail dialog
 *     Jda.mobility.plugins.Mailer.sendMail( function(){callOnSuccess();},
 *         function(){callOnFailure();},
 *         [{ recipientAddresses:[roadRunner@acme.com],
 *            subject: 'Beep Beep',
 *            message: 'I am a message.',
 *            isHTML: true,
 *            attachments: [] }] );
 *
 * @class Jda.mobility.plugins.Mailer
 */

/**
 * Shows the native mail dialog, the config should be of form (all fields are optional):
 * @param {Function} success Success callback function.
 * @param {Function} failure Failrue callback function.
 * @param {Object} [mailConfig] Should contain a single object containing the configuration options.
 * @param mailConfig.recipientAddresses Array of email address strings (optional)
 * @param mailConfig.subject Subject line for email (optional)
 * @param mailConfig.message Message content for email (optional)
 * @param mailConfig.isHTML Boolean indicating whether to render as HTML (default false)
 * @param mailConfig.attachments Attachment objects of form:
 * @param mailConfig.filePath Path of the file on the device (required)
 * @param mailConfig.mimeType Mime Type of file (required)
 * @param mailConfig.displayName Name file will be displayed as within email (optional, defaults to last component of filepath)
 */
exports.sendMail = function(success, failure, mailConfig) {
    cordova.exec(success, failure, 'Mailer', 'sendMail', [ mailConfig ]);
};
