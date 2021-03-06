require('./base');
var router      = new Raddish.Router();

describe('Service loader tests.', function() {
    describe('#get', function() {
        it('The identifier home:menu.model.items should return a Model object', function(done) {
            ObjectManager.get('com://home/menu.model.items', null)
                .then(function(model) {
                    model.should.be.an.instanceOf(Raddish.Model);

                    done();
                });
        });

        it('The identifier home:menu.controller.items should return a Controller object', function(done) {
            ObjectManager.get('com://home/menu.controller.items', {
                    request: request
                })
                .then(function(controller) {
                    controller.should.be.an.instanceOf(Raddish.Controller);

                    done();
                });
        });

        it('Should return a Table object', function(done) {
            ObjectManager.get('com://home/menu.database.table.items')
                .then(function(table) {
                    table.should.be.an.instanceOf(Raddish.Table);

                    done();
                });
        });
    });

    describe('#getConfig()', function() {
        it('parameter db should give back an database config object and should have property default', function() {
            Raddish.getConfig('db').should.be.an.instanceOf(Object).and.have.property('default');
        });

        it('parameter format should return the default format (JSON)', function() {
            Raddish.getConfig('format').should.equal('json');
        });
    });
});