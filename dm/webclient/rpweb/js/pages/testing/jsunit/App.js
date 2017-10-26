/**
 * @class JDA.dm.pages.testing.jsunit.App
 *
 * @extends JDA.dm.pages.testing.jsunit.App
 * @author 
 */
Ext.define('JDA.dm.pages.testing.jsunit.App', {
    extend: 'JDA.dm.taskflow.App',

    controllers: [
        'Testing'
    ],

    views: [
        'Main'
    ],

    mainView: 'Main',

    namespace: 'JDA.dm.testing',

    noHeader: true
});
