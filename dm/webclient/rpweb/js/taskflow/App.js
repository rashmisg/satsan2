/**
 * Extends REFS' mvc taskform and adds a DM specific class so we can style things special.
 * It also injects some page handling logic for old third level nav pages. It only does
 * this if the application has the pages config set, otherwise it should behave exactly
 * the same as the RP mvc taskform.
 * @author 
 */
Ext.define('JDA.dm.taskflow.App', {
    extend: 'RP.mvc.TaskForm',
    cls: 'dm-taskflow',

    initComponent: function() {

        this.callParent(arguments);

        if (this.pages && this.pages.length) {
            Ext.suspendLayouts(); // We don't want to see the landing page
            this._addPageListeners();
        }
    },

    /**
     * @private
     * Adds a global page activate listener and double checks that the id is
     * set up properly so the page creator can look it up.
     */
    _addPageListeners: function() {
        if (this.id !== this.$className) {
            throw 'The Application\'s id property must match the class name';
        }

        jda.event.GlobalEventManager.on(jda.event.GlobalEvents.PageActivate, this._onPageActivate.bind(this));
    },

    /**
     * @private
     * Checks if the page being activated is one this app is responsible for.
     * @param  {String} event  Page activate event name.
     * @param  {String} pageId PageId being activated.
     */
    _onPageActivate: function(event, pageId, menu) {
        var page = this.getPage(pageId);

        if (!page) {
            // This page doesn't belong to us - drop it.
        } else {
            this._setActiveView(page);
        }
    },

    /**
     * @private
     * Handles showing the correct view that corrosponds with the page being
     * requested by the global event.
     * @param  {Object} page Page config from the app.
     */
    _setActiveView: function(page) {
        var mainView = this.applet.mainView,
            nextView;

        if (!mainView) {
            throw 'Applet is missing a main view';
        }

        /**
         * This is needed to change the applications pageId since we have multiple pages in
         * the app.  This will allow us to listen to page deactivate and before deactivate
         * properly without doing any additional hacky/weird things
         */
        this.$pageId = page.pageId;

        //TODO: Check if the main view is a card deck

        logger.logTrace('[TaskForm Override] Setting active view to ' + page.view);

        nextView = this._createChildPage(page, mainView);

        this._clearBreadCrumbs(mainView.breadCrumbTrail);
        mainView.onDrillDown(nextView);
        mainView.firstCardActivate();

        Ext.resumeLayouts(true);
    },

    /**
     * @private
     * Creates the child page that we want to show and adds the first card activate hook.
     * Typically this would only go on the landing page, but we're hiding the landing page
     * so we need to put it on the first child page.
     * @param  {Object} page Page config from the app.
     * @param  {WM.ui.view.CardDeck} mainView Main card deck view.
     * @return {Ext.container.AbstractContainer} The child view to display.
     */
    _createChildPage: function(page, mainView) {
        var view = Ext.widget(page.view);
        view.on('activate', mainView.firstCardActivate, mainView);

        return view;
    },

    /**
     * @private
     * Removes all crumbs from the crumb trail and destroys any assoicated cards. This
     * allows us to manually drill down into our first card and not create duplicate
     * cards and crumbs later.
     * @param  {RP.chrome.breadcrumb.BreadCrumbTrail} breadCrumbTrail The bread crumb
     * trail to clean up.
     */
    _clearBreadCrumbs: function(breadCrumbTrail) {
        // Destroy the card (if any) associated with the bread crumb
        breadCrumbTrail.breadCrumbs.each(function(breadCrumb) {
            Ext.destroy(breadCrumb.card);
        });

        breadCrumbTrail.clear();
        breadCrumbTrail.crumbContainer.removeAll(true);
    },

    /**
     * Checks the app's page config for the given pageId.
     * @param  {String} pageId PageId to check for
     * @return {Object} pageConfig Page config object otherwise undefined.
     */
    getPage: function(pageId) {
        return Ext.Array.findBy(this.pages, function(page) {
            return page.pageId === pageId;
        });
    }
});
