/**
 * Plugin class used to manage the addion and removal of elements to the
 * navigation bar.
 *
 * ## Add a bar button
 *     Jda.mobility.plugins.NavigationBarComponentManager.addBarButton( undefined, {
 *         type: Jda.mobility.plugins.NavigationBarComponentManager.types.icon,
 *         iconPath: 'path' },
 *         'happy/path' );
 *
 * ## Add multiple bar buttons
 *     var buttonConfigs = [
 *        { callback: function() {},
 *          config: { type: Jda.mobility.plugins.NavigationBarComponentManager.types.icon,
 *                    iconPath: 'foo.png'
 *                  }
 *        },
 *        { callback: function() {},
 *          config: { type: Jda.mobility.plugins.NavigationBarComponentManager.types.text,
 *                    title: 'bar'
 *                  }
 *        }];
 *
 *     Jda.mobility.plugins.NavigationBarComponentManager.addBarButtons( buttonConfigs, 'happy/path' );
 *
 * ## Change the bar title
 *     Jda.mobility.plugins.NavigationBarComponentManager.changeTitle( 'title', 'happy/path' );
 *
 * ## Remove all the bar buttons
 *     Jda.mobility.plugins.NavigationBarComponentManager.removeAllButtons( 'happy/path' );
 * @private
 * @class Jda.mobility.plugins.NavigationBarComponentManager
 */

/**
 * @property {Object} types
 * Button types.
 */
var _types = {
        text: "ButtonTypeText",
        icon: "ButtonTypeIcon",
        dropDown: "ButtonTypeDropDown",
        label: "ButtonTypeLabel",
        groupedPicker: "ButtonTypeGroupedPicker",

        // These two items will be removed after the 8.1.1 release, please do not use if you can avoid doing so.
        sync: "ButtonTypeSync",
        spinner: "ButtonTypeSpinner"
    },
    /**
     * @property {Object} locations
     * Button locations.
     */
    _locations = {
        left: "ButtonLocationLeft",
        right: "ButtonLocationRight"
    },
    /**
     * @private
     * @property {Array} _buttonCallbacks
     */
    _buttonCallbacks = [];

/**
 * @private
 * Maps the button tap event to the corresponding callback function stored in
 * {@link Jda.mobility.plugins.NavigationBarComponentManager#_buttonCallbacks}.
 * @param {Object} result
 */
function _buttonTapCallback(result) {
    var buttonIndex = result.buttonIndex,
        buttonCallback = _buttonCallbacks[buttonIndex],
        callbackScope;

    if (typeof buttonCallback === 'function') {
        callbackScope = window;
    }
    else {
        callbackScope = buttonCallback.scope;
        buttonCallback = buttonCallback.fn;
    }

    buttonCallback.call(callbackScope, result);
}

/**
 * @private
 * Establishes the button configuration.
 * @param {Object} config key:value set of button configuration options.
 * @param {Object} config.type {@link Jda.mobility.plugins.NavigationBarComponentManager#types}
 * @param {Object} config.location {@link Jda.mobility.plugins.NavigationBarComponentManager#locations}
 */
function _normalizeButtonConfig(config) {
    config.type = config.type || _types.text;
    config.location = config.location || _locations.left;

    if (config.type === _types.dropDown) {
        config.location = _locations.right; // Force drop downs to the right side
    }

    if (config.type === _types.groupedPicker) {
        config.iosApplyButtonText = Jda.getMessage('jda.mobility.navigationbarcomponentmanager.groupedpicker.iOSApply');
        config.androidCancelButtonText = Jda.getMessage('jda.mobility.navigationbarcomponentmanager.groupedpicker.AndroidCancel');
        config.androidConfirmButtonText = Jda.getMessage('jda.mobility.navigationbarcomponentmanager.groupedpicker.AndroidConfirm');
    }
}

/**
 * @method addBarButtons
 * Adds a given set of button configurations to the native navigation bar component.
 * @param {Array} btnConfigs Button configurations.
 * @param {String} route Resource path.
 */
function _addBarButtons(btnConfigs, route) {
    var configs = [];

    for (var i = 0; i < btnConfigs.length; i++) {
        var buttonConfig = btnConfigs[i];

        buttonConfig.config.buttonIndex = _buttonCallbacks.length;

        _normalizeButtonConfig(buttonConfig.config);

        _buttonCallbacks.push(buttonConfig.callback);
        configs.push(buttonConfig.config);
    }

    cordova.exec(_buttonTapCallback, undefined, "NavigationBarComponentManager", "addBarButtons", [ route, configs ]);
}

/**
 * @method addBarButton
 * Adds a button to the native navigation bar component.
 * @param {Function} onTapCallback Function called upon a tap event from the
 * added buttion.
 * @param {String} route Resource path.
 * @param {Object} config key:value set of button configuration options.
 * @param {Object} config.type {@link Jda.mobility.plugins.NavigationBarComponentManager#types}
 * @param {Object} config.location {@link Jda.mobility.plugins.NavigationBarComponentManager#locations}
 * @param {String} route Resource url path.
 */
function _addBarButton(onTapCallback, config, route) {
    _normalizeButtonConfig(config);

    config.buttonIndex = _buttonCallbacks.length;
    _buttonCallbacks.push(onTapCallback);

    cordova.exec(onTapCallback, undefined, "NavigationBarComponentManager", "addBarButton", [ route, config ]);
}

/**
 * @method changeTitle
 * Changes the displayed title of the native navigation bar component.
 * @param {String } title
 * @param {String} route Resource path.
 */
function _changeTitle(title, route) {
    cordova.exec(undefined, undefined, "NavigationBarComponentManager", "changeTitle", [ route, title ]);
}

/**
 * @method removeAllButtons
 * Removes all of the buttons from the native navigation bar matching the specified route.
 * @param {String} route Resource path.
 */
function _removeAllButtons(route) {
    cordova.exec(undefined, undefined, "NavigationBarComponentManager", "removeAllButtons", [ route ]);
}

module.exports = {
    types: _types,
    locations: _locations,
    addBarButton: _addBarButton,
    addBarButtons: _addBarButtons,
    changeTitle: _changeTitle,
    removeAllButtons: _removeAllButtons
};
