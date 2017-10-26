/**
 * JSUnit testing framework controller.
 * @author 
 */
/* eslint no-console: 0 */
Ext.define('JDA.dm.testing.controller.Testing', {
    extend: 'Ext.app.Controller',

    views: [
        'Main'
    ],

    init: function() {
        RP.Formatting.setUserLocale('en-US');
        // Initializing the uom util so tests that contain uom fields won't
        // fail because they are missing the default values.
        // RPUX.util.Uom.init('dm');

        var components = new Ext.util.HashMap();
        CSUnit.leaks = new Ext.util.HashMap();
        var initialComponents, initialStores;

        // Creating a the exception dialog for every single request that is missed
        // is killing performance. It also causes the test to leak components since the
        // exception dialog is created and doesn't get destroyed. For now we're going to
        // stub it out. Ideally we should be tracking/reporting which tests are not
        // handling requests.
        sinon.stub(RP.Ajax, 'displayExceptionDialog');

        // Piggyback on the component manager's add and remove to keep track of all of
        // the components that are created/destroyed during a test. If components aren't
        // destroyed properly, they're going to remain in the leaks hashmap.
        Ext.Function.interceptBefore(Ext.ComponentManager.all, 'add', function(cmp) {
            components.add(cmp);
        });
        Ext.Function.interceptAfter(Ext.ComponentManager.all, 'remove', function(cmp) {
            components.remove(cmp);
        });

        // Sets up leak detection
        CSUnit.mocha.suite.suites.forEach(function(suite) {
            suite.beforeAll(function() {
                // Reset to only track components from this test
                // Clears components from taskflow setup that would be included in the first test's results
                components = components.clear();

            });
            suite.afterAll(function() {
                // kill any asynchronous code
                window.clearAllTimeouts();
                window.clearAllIntervals();

                // reset the RP request counter
                window.Ext.Ajax.activeRequests = 0;

                // reset the rendering suspension, some of the suspends are resumed asynchronously
                // or outside of the method being tested
                Ext.AbstractComponent.layoutSuspendCount = 0;

                // Check if there are any components hanging around that werent destroyed/removed.
                if (components.getCount() > 0) {
                    CSUnit.leaks.add(this.currentTest.parent.title, components.getKeys());
                }
                // clean up any stores remaining
                Ext.data.StoreManager.each(function(str) {
                    if( !initialStores.contains(str)) {
                        //destroy any stores created during test
                        Ext.destroy(str);
                    }
                });
                // restore component manager to it's initial state
                Ext.ComponentManager.all = initialComponents.clone();
            });
        });

        /**
         * Controls whether or not a fakeServer can be created.
         * @param {Boolean} True to restrict fakeServer creation.
         */
        var toggleFakeServer = function(restrict) {

            if (restrict) {

                // Prevent restoring of the global fake server.
                sinon.stub(CSUnit.fakeServer, 'restore')
                    .throws('CSUnit.fakeServer.restore should never be called - the test suite will auto clean up.');

                // Prevent creation of a new fake server instance
                sinon.stub(sinon.fakeServer, 'create')
                    .throws('Use the default CSUnit.fakeServer instead of creating a new instance');
            } else if(sinon.fakeServer.create.restore) {
                sinon.fakeServer.create.restore();
                CSUnit.fakeServer.restore.restore();
            }
        };

        CSUnit.on('loadtests', function() {
            CSUnit.addSuite(new CSUnit.Test.Suite('DM.test.Suite'));
        });

        // Sets up a reusable sinon fake server once before any suites run.
        CSUnit.mocha.suite.beforeAll(function() {
            setupTimeOuts();
            // If we crashed don't make people reload the Page
            toggleFakeServer(false);

            // Remove any old results from previous runs.
            CSUnit.leaks.clear();

            logger.logTrace('[JSUnit] Initializing Sinon fake server.');

            // setup the fake server for the first test suite
            CSUnit.fakeServer = sinon.fakeServer.create();
            CSUnit.fakeServer.autoRespond = true;
            CSUnit.fakeServer.autoRespondAfter = 1;

            initialComponents = Ext.ComponentManager.all.clone();
            initialStores = Ext.data.StoreManager.clone();

            toggleFakeServer(true);
        });

        CSUnit.mocha.suite.afterEach(function() {

            toggleFakeServer(false);

            CSUnit.fakeServer.restore();
            CSUnit.fakeServer = undefined;

            // create a new fake server for the next test to prevent requests spilling over
            // into subsequent tests
            CSUnit.fakeServer = sinon.fakeServer.create();
            CSUnit.fakeServer.autoRespond = true;
            CSUnit.fakeServer.autoRespondAfter = 1;

            // close any orphaned messageboxes
            if (Ext.MessageBox.isVisible()) {
                Ext.MessageBox.close();
            }

            toggleFakeServer(true);
        });

        CSUnit.mocha.suite.afterAll(function() {
            toggleFakeServer(false);

            if (CSUnit.leaks.getCount() > 0) {
                console.log('%c ⚠ Leaks Detected! ',
                    'background: red; color: white; font-weight: bolder; font-size: 200%',
                    CSUnit.leaks.map);
            }

            CSUnit.fakeServer.restore();
            CSUnit.fakeServer = undefined;
            resetTimeOuts();
        });

        var setupTimeOuts = function() {
            // kill defered processing
            window.timeoutList = [];
            window.intervalList = [];

            window.oldSetTimeout = window.setTimeout;
            window.oldSetInterval = window.setInterval;
            window.oldClearTimeout = window.clearTimeout;
            window.oldClearInterval = window.clearInterval;

            window.setTimeout = function(code, delay) {
                var retval = window.oldSetTimeout(code, delay);
                window.timeoutList.push(retval);
                return retval;
            };
            window.clearTimeout = function(id) {
                var ind = window.timeoutList.indexOf(id);
                if(ind >= 0) {
                    window.timeoutList.splice(ind, 1);
                }
                var retval = window.oldClearTimeout(id);
                return retval;
            };
            window.setInterval = function(code, delay) {
                var retval = window.oldSetInterval(code, delay);
                window.intervalList.push(retval);
                return retval;
            };
            window.clearInterval = function(id) {
                var ind = window.intervalList.indexOf(id);
                if(ind >= 0) {
                    window.intervalList.splice(ind, 1);
                }
                var retval = window.oldClearInterval(id);
                return retval;
            };
            window.clearAllTimeouts = function() {
                for(var i in window.timeoutList) {
                    window.oldClearTimeout(window.timeoutList[i]);
                }
                window.timeoutList = [];
            };
            window.clearAllIntervals = function() {
                for(var i in window.intervalList) {
                    window.oldClearInterval(window.intervalList[i]);
                }
                window.intervalList = [];
            };
        };

        var resetTimeOuts = function() {
            window.setTimeout = window.oldSetTimeout;
            window.setInterval = window.oldSetInterval;
            window.clearTimeout = window.oldClearTimeout;
            window.clearInterval = window.oldClearInterval;
        };
    }
});
