/**
 * Plugin class used show and hide the loading mask.
 *
 * ## Show a loading mask
 *     Jda.mobility.plugins.showLoadingMask();
 *
 * ## Hide a loading mask
 *     Jda.mobility.plugins.hideLoadingMask();
 *
 * @class Jda.mobility.plugins.LoadingMaskManager
 */

 /**
  * @method showLoadingMask
  * Launches the loading mask.
  */
function _showLoadingMask() {
    cordova.exec(undefined, undefined, 'LoadingMaskManager', 'showLoadingMask', [ ]);
}

/**
 * @method hideLoadingMask
 * Hides the loading mask.
 */
function _hideLoadingMask() {
    cordova.exec(undefined, undefined, 'LoadingMaskManager', 'hideLoadingMask', [ ]);
}

module.exports = {
    showLoadingMask: _showLoadingMask,
    hideLoadingMask: _hideLoadingMask
};
