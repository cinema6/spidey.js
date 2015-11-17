describe('index.js', function() {
    var index;

    beforeAll(function() {
        index = require('../../index');
    });

    it('should export the spidey.js lib', function() {
        expect(index).toBe(require('../../lib/spidey'));
    });
});
