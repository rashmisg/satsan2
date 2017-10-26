exports.alert = function(options) {
    if (!options || (!options.message && !options.title)) {
        console.error('Message or title required for alert dialog');
        return;
    }

    var message = options.message,
        title = options.title,
        buttonText = options.buttonText || Jda.getMessage('jda.mobility.dialog.ok'),
        callback = options.callback;

    cordova.exec(callback, null, 'DialogManager', 'alert', [ message, title, buttonText ]);
};

exports.confirm = function(options) {
    if (!options || (!options.message && !options.title)) {
        console.error('Message or title required for confirm dialog');
        return;
    }

    var message = options.message,
        title = options.title,
        buttonLabels = options.buttonLabels || [],
        cancelButtonText = options.cancelButtonText || Jda.getMessage('jda.mobility.dialog.cancel'),
        callback = options.callback;

    if (buttonLabels.length < 1) {
        if (options.okButtonText) {
            buttonLabels.push(options.okButtonText);
        }
        else {
            buttonLabels.push(Jda.getMessage('jda.mobility.dialog.ok'));
        }
    }

    cordova.exec(callback, null, 'DialogManager', 'confirm', [ message, title, buttonLabels, cancelButtonText ]);
};

exports.prompt = function(options) {
    if (!options || (!options.message && !options.title)) {
        console.error('Message or title required for prompt dialog');
        return;
    }

    var message = options.message,
        title = options.title,
        defaultValue = options.defaultValue || '',
        buttonLabels = [
            options.okButtonText || Jda.getMessage('jda.mobility.dialog.ok'),
            options.cancelButtonText || Jda.getMessage('jda.mobility.dialog.cancel')
        ],
        callback = options.callback;

    cordova.exec(callback, null, 'DialogManager', 'prompt', [ message, title, buttonLabels, defaultValue ]);
};
