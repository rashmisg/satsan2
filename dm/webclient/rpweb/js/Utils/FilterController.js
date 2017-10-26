/**
 * @Override
 * Disable the ANY search.
 */
Ext.define('JDA.dm.Utils.FilterController.DisableAny', {
    override: 'RP.filtering.controller.FilterController',

    disableAny: true
});