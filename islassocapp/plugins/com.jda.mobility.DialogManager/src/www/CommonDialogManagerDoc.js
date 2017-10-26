/**
 * Plugin class used to create native dialogs.
 *
 * ## Create and display alert
 *     Jda.mobility.plugins.DialogManager.alert(
 *         {message: 'The redcoats are coming!', // Required
 *          title: 'Paul Revere', // Optional
 *          buttonText: 'OK', // Optional
 *          callback: function() { ... } // Optional
 *         });
 *
 * ## Create and display confirmation dialog
 *     Jda.mobility.plugins.DialogManager.confirm(
 *         {message: 'Are you sure you want to send money to store?', // Required
 *          title: 'Confirm Purchase', // Optional
 *          okButtonText: 'Send Money', // Optional. Overridden by buttonLabels
 *          buttonLabels: ['Many', 'Options', 'Go', 'Here'], // Optional
 *          cancelButtonText: 'Cancel Purchase', // Optional
 *          callback: function() { ... } // Optional
 *         });
 *
 * ## Create and display an input dialog
 *     Jda.mobility.plugins.DialogManager.confirm(
 *         {message: 'How much money would you like to pay towards credit card bill?', // Required
 *          title: 'Confirm Payment', // Optional
 *          okButtonText: 'Confirm', // Optional
 *          cancelButtonText: 'Cancel', // Optional
 *          defaultValue: '$100.00' // Optional
 *          callback: function() { ... } // Optional
 *         });
 *
 * @class Jda.mobility.plugins.DialogManager
 */

/**
* @method alert
* Shows a native alert dialog, which accepts the following options
* @param {Object} [options] Object containing the expected key:value sets.
* @param options.message Text to display inside the dialog
* @param options.title Title of the popup window
* @param options.callback Function to call when the alert has been dismissed
* @param options.buttonText Text to display on button which dismisses the dialog
*/

/**
 * @method confirm
 * Shows a native confirmation/cancellation dialog.
 * @param {Object} [options] Object containing the expected key:value set.
 * @param options.message Text to display inside the dialog
 * @param options.title Title of the popup window
 * @param options.callback Function to call when the alert has been dismissed
 * @param options.okButtonText Text to display on the primary button
 * @param options.cancelButtonText Text to display on the secondary button
 * @param options.buttonLabels Array of text to display as options instead of okButtonText
 */

 /**
  * @method prompt
  * Shows a native confirmation/cancellation dialog.
  * @param {Object} [options] Object containing the expected key:value set.
  * @param options.message Text to display inside the dialog
  * @param options.title Title of the popup window
  * @param options.defaultValue Default value of the input field
  * @param options.callback Function to call when the alert has been dismissed
  * @param options.kButtonText Text to display on the primary button
  * @param options.cancelButtonText Text to display on the secondary button
  */
