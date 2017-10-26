// Setup Ext path
Ext.Loader.setPath({
    'Jda': '../www/js'
});

// Handle when tests are being run via Grunt (Phantom JS)
if (window.PHANTOMJS) {
    blanket.options("reporter", "../node_modules/grunt-blanket-mocha/support/grunt-reporter.js");
}

// Mock cordova
window.cordova = {
    lastSuccessFn: null,
    lastErrorFn: null,
    lastNativeClass: null,
    lastNativeFnName: null,
    lastParams: null,

    exec: function(successFn, errorFn, nativeClass, nativeFnName, params) {
        cordova.lastSuccessFn = successFn;
        cordova.lastErrorFn = errorFn;
        cordova.lastNativeClass = nativeClass;
        cordova.lastNativeFnName = nativeFnName;
        cordova.lastParams = params;
    },

    clearSavedMockValues: function() {
        cordova.lastSuccessFn = null;
        cordova.lastErrorFn = null;
        cordova.lastNativeClass = null;
        cordova.lastNativeFnName = null;
        cordova.lastParams = null;
    }
};

var loadFile = function(file, callback) {
    var request = new XMLHttpRequest();
    request.onload = function() {
        callback(request);
    };
    request.onerror = function() {
        console.error('Error loading file: "' + file + '".');
    };
    request.open('GET', file, true);
    request.send();
};

// Daisy-chain load each plugin
function loadPlugins(plugins, callback) {
    // Loads the plugin at the index in the plugins array
    var loadPlugin = function(index, callback) {
        var pluginFolderUrl = plugins[index]
            pluginXmlUrl = pluginFolderUrl + '/plugin.xml';

        loadFile(pluginXmlUrl, function(request) {
            var plugin = xmlToJson(request.responseXML.firstChild);

            if (plugin['js-module']) {
                var target = plugin['js-module'].clobbers.attributes.target,
                    pluginScriptUrl = pluginFolderUrl + '/' + plugin['js-module'].attributes.src;

                attachBlanketScriptWithTarget(pluginScriptUrl, target, callback);
            }
            // Else there are multiple <js-module> children, one for each <platform> under <plugin>
            else {
                // Map of plugin platforms which is used to distinguish whether or not the same js-module is loaded for each
                // platform, which is necessary because of Windows plugins, which currently aren't in the plugin.xml at all.
                // e.g. { 'ios' : { clobbers: 'Jda.mobility.plugins.PageContextManager', script: '../plugins/dialog-manager/src/www/ios/DialogManager.js' } }
                var pluginPlatformMap = {};

                // Populate the target script map
                plugin.platform.forEach(function(platform) {
                    var jsModule = platform['js-module'];
                    var pluginScriptUrl = pluginFolderUrl + '/' + jsModule.attributes.src;

                    pluginPlatformMap[platform.attributes.name] = {
                        clobbers: jsModule.clobbers.attributes.target,
                        script: pluginScriptUrl
                    };
                });

                // Filter down to the unique clobbers + scripts that need to be loaded
                var uniqueClobbers = [];
                var uniqueScripts = [];
                for (var target in pluginPlatformMap) {
                    var clobbers = pluginPlatformMap[target].clobbers;
                    var script = pluginPlatformMap[target].script;

                    if (uniqueClobbers.indexOf(clobbers) === -1) {
                        uniqueClobbers.push(clobbers);
                    }
                    if (uniqueScripts.indexOf(script) === -1) {
                        uniqueScripts.push(script);
                    }
                }

                var sameScriptAppliesToAllPlatforms = uniqueClobbers.length === 1 && uniqueScripts.length === 1;
                if (sameScriptAppliesToAllPlatforms) {
                    attachBlanketScriptWithTarget(uniqueScripts[0], uniqueClobbers[0], callback);
                }
                else {
                    // Setup to load each platform script for the plugin
                    var platformScriptRequestsPending = Object.keys(pluginPlatformMap).length;
                    var platformScriptLoaded = function() {
                        if (--platformScriptRequestsPending === 0) {
                            callback();
                        }
                    }

                    for (var platform in pluginPlatformMap) {
                        var pluginScriptUrl = pluginPlatformMap[platform].script;
                        var target = pluginPlatformMap[platform].clobbers + '.' + platform; // append the platform name to the clobbers target
                        attachBlanketScriptWithTarget(pluginScriptUrl, target, platformScriptLoaded);
                    }
                }
            }
        });
    };

    // Async callback to load each plugin only when the previous one fully completes
    var nextPluginIndexToLoad = -1;
    var pluginLoaded = function() {
        if (++nextPluginIndexToLoad >= plugins.length) {
            // all done
            callback();
        }
        else {
            // not done
            loadPlugin(nextPluginIndexToLoad, pluginLoaded);
        }
    };

    pluginLoaded();
};

// Recursively turn XML into JSON for (very much) easier manipulation
function xmlToJson(xml) {
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
        obj.attributes = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj.attributes[attribute.nodeName] = attribute.value;
            }
        }
    }
    else if (xml.nodeType == 3) { // text
        obj = xml.value;
    }

    // do children
    if (xml.hasChildNodes()) {
        for(var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof(obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
};

function attachBlanketScriptWithTarget(url, target, callback) {
    // blanket internals need this
    blanket.utils.cache[url] = { loaded: false };

    var whenDone = function(result) {
        // Build whatever target the plugin points to
        var targetObj = window;
        target.split(/\./).forEach(function(name) {
            targetObj[name] = targetObj[name] || {};
            targetObj = targetObj[name];
        });

        // Pluck things from the module.exports object and dump into the target object
        for (exportName in module.exports) {
            if (!module.exports.hasOwnProperty(exportName)) continue;
            targetObj[exportName] = module.exports[exportName];
        }

        // clean up the module and exports variables
        delete window.exports;
        delete window.module;

        callback();
    };

    blanket.utils.attachScript({
        url: url
    }, function (content) {
        // Set up module and exports variables for the script to write to
        window.module = {};
        window.exports = window.module.exports = {};
        // blanket internals log error if this isn't set to true here
        blanket.utils.cache[url].loaded = true;
        // instrument and attach the file. Don't know why it needs the same cb twice
        blanket.utils.processFile(content, url, whenDone, whenDone);
    });
};

// Get script, instrument, eval, and hit the callback
function attachBlanketScript(url, callback) {
    // blanket internals need this
    blanket.utils.cache[url] = { loaded: false };

    // xhr the script
    blanket.utils.attachScript({
        url: url
    }, function (content) {
        // blanket internals log error if this isn't set to true here
        blanket.utils.cache[url].loaded = true;
        // instrument and attach the file. Don't know why it needs the same cb twice
        blanket.utils.processFile(content, url, callback, callback);
    });
};

// Load all sencha components, hit callback
function loadSenchaComponents(components, callback) {
    var componentRequests = components.length;

    if (componentRequests === 0) {
        callback();
        return;
    }

    var componentLoaded = function() {
        if (--componentRequests === 0) {
            // All the things are loaded
            callback();
        }
    };

    components.forEach(function(component) {
        attachBlanketScript(component, componentLoaded);
    });
};

var loadTests = function(tests) {
    Ext.setup({
        onReady: function() {
            tests.forEach(function(test) {
                Jda.mobility.Loader.loadScript(test);
            });
            Jda.mobility.Loader.then(mocha.run);
        }
    });
};

var loadScripts = function() {
    try {
        loadFile('test.json', function(request) {
            var testJson = JSON.parse(request.responseText);
            var demoDate = testJson.demoDate;
            if (demoDate) {
                var parsedDemoDate = Jda.mobility.i18n.Date.parse(demoDate, Jda.mobility.i18n.Date.ISO8601);
                Jda.mobility.core.Sundial.setServerTime(parsedDemoDate);
            }

            loadPlugins(testJson['cordova-plugins'], function() {
                loadSenchaComponents(testJson['code'], function() {
                    loadTests(testJson['tests']);
                });
            });
        });
    }
    catch (e) {
        console.error(e.message);
    }
};

// After blanket has finished doing its thing, start loading our scripts
blanket.options("testReadyCallback", loadScripts);
