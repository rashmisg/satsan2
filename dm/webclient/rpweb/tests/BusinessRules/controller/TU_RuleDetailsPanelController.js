/**
 * Tests the (integration) Rule Details Panel Controller
 * @author 
 */
describe('Unit Tests - Rule Details Panel Controller', function() {

    var _ruleDetailsController;

    before(function() {
        _ruleDetailsController = Ext.create('JDA.dm.BusinessRules.controller.RuleDetailsPanelController', {
            
        });
    });

    it ('should not error when created', function() {
        // CSUnit.Assert.isTrue(_ruleDetailsController !== undefined);
        // sinon.stub(Ext.Msg, 'alert').returns(true);

        expect(_ruleDetailsController).not.to.be(undefined);

    });

    after(function() {
        Ext.destroy(_ruleDetailsController);
        _ruleDetailsController = undefined;
    });
});
