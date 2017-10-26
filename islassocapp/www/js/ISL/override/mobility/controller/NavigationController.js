Ext.define('Jda.mobility.controller.override.NavigationController', {
    override: 'Jda.mobility.controller.NavigationController',

    // When the controller is launched, meaning that the shared application
    // has launched it (from app.js's list of controllers), we assume that
    // we have a route, and can safely configure the navigation bar. Subclasses
    // should be sure to call parent if they implement launch.

    // Method to push a controller onto the stack. Currently, we expect that this is a
    // just the class name of a controller, and its config. It is created internally.
    pushController: function(controllerName, controllerConfig) {

        console.log("override push controller");

        // Prevent controllers from being pushed while already presenting a controller
        if (this.getPresentedController()) {
            return;
        }

        var application = this.getApplication(),
            config = Ext.applyIf({ application: application }, controllerConfig),
            controller = Ext.create(controllerName, config),
            route = this.getDefaultRoute() || this._getFirstRouteName();

        // Android Back button fix : Pass route param in config only for Android
        // DONOT pass any value in case of iOS or pass null
        if(Ext.os.is('Android') && controllerConfig && controllerConfig.route) {
          console.log("override push controller " + controllerConfig.route);
          route = controllerConfig.route;
        }

        // Mark this controller as our presented
        this.setPresentedController(controller);

        // Mark ourselves as the presenting controller and share the nav view
        controller.setPresentingController(this);
        controller.setNavView(this.getNavView());

        // Share the route, since they're on the same native controller ultimately
        controller.setDefaultRoute(route);

        // Initialize the controller, but don't launch it yet.
        controller.init(application);

        // Push the sub controller's view onto the navigation view
        this.getNavView().push(controller.getView());

        // Add it to the native view stack
        Jda.mobility.plugins.NavigationStackManager.pushController(route, Ext.bind(this.popController, this));

        // Allow the sub controller to configure it's nav bar
        controller.launch(application);
    }
});
