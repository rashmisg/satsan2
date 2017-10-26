var datePickerShown = false;

exports.show = function(options, callback) {
    // Don't want to show multiple date pickers
    if (datePickerShown) {
        return;
    }

    datePickerShown = true;

    // If no callback was provided, just use an empty function.
    callback = callback || function() { };

    // Override DateTime Picker with MF DateTime Picker
    if (options && options.mode == 'datetime') {
        // Convert date to millis
        if (options.date) {
            if (options.date instanceof Date) {
                options.date = options.date.getTime();
            }
            else {
                console.warn('DatePicker requires you provide a Date object for the DateTime mode. Your call has been defaulted to Date.now()');
                options.date = Date.now();
            }
        }
        else {
            options.date = Date.now();
        }

        // Wrap the callback so we return a Date object
        var dateFromMillisCallback = function(dateTimeMillis) {
            // If the dialog was canceled, we get no object back
            if (dateTimeMillis) {
                callback(new Date(parseInt(dateTimeMillis, 10)));
            }

            datePickerShown = false;
        };

        cordova.exec(dateFromMillisCallback, undefined, 'DateTimePicker', 'datetime', [ options ]);
    }
    else {
        var callbackWrapper = function(date) {
            callback(date);

            datePickerShown = false;
        };

        var errorCallback = function() {
            datePickerShown = false;
        };

        window.datePicker.show(options, callbackWrapper, errorCallback);
    }
};
