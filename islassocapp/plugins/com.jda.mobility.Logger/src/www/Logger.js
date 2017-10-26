/**
 * Plugin class used to redirect console log messages back to the navive logger.
 *
 * @private
 * @class Jda.mobility.plugins.Logger
 */

/**
 * Replaces the messages normally targeted for the web browser console log and
 * redirects those messages to the native logger.
 * @param {Object} level Log level intended to replace.
 */
var replaceLogger = function(level) {
    var oldFn = console[level];

    exports[level] = console[level] = function() {
        oldFn.apply(console, arguments);

        var argsAsArray = Array.prototype.slice.call(arguments),
            serializedArgs = [];

        for (var i = 0; i < argsAsArray.length; i++) {
            serializedArgs.push(String(argsAsArray[i])); // using String() as a safer alternative to toString()
        }

        cordova.exec(undefined, undefined, 'Logger', level, serializedArgs);
    };
};

replaceLogger('debug');
replaceLogger('error');
replaceLogger('info');
replaceLogger('log');
replaceLogger('trace');
replaceLogger('warn');

window.onerror = console.error;
