var BluebirdPromise = require('bluebird');

describe('getFacebookPicture(pageURI)', function() {
    var getFacebookPicture;
    var graph;

    var success, failure;
    var result;

    var uri;

    beforeAll(function() {
        getFacebookPicture = require('../../lib/picture/facebook');
        graph = require('fbgraph');
    });

    beforeEach(function(done) {
        spyOn(graph, 'get');

        success = jasmine.createSpy('success()');
        failure = jasmine.createSpy('failure()');

        uri = 'https://www.facebook.com/Pennzoil';

        result = getFacebookPicture(uri).then(success, failure);
        process.nextTick(done);
    });

    it('should return a Promise', function() {
        expect(result).toEqual(jasmine.any(BluebirdPromise));
    });

    it('should get the user\'s profile picture', function() {
        expect(graph.get).toHaveBeenCalledWith('Pennzoil/picture', { type: 'large' }, jasmine.any(Function));
    });

    describe('when the get', function() {
        var callback;

        beforeEach(function() {
            callback = graph.get.calls.mostRecent().args[2];
        });

        describe('succeeds', function() {
            var data;

            beforeEach(function(done) {
                data = { image: true, location: 'https://scontent.xx.fbcdn.net/hprofile-xpa1/v/t1.0-1/150767_679343238837211_815495802068179950_n.jpg?oh=b1d1f9d302f955f3af9c4a68db972ca9&oe=56ECECAE' };
                callback(null, data);

                process.nextTick(done);
            });

            it('should fulfill with the image URL', function() {
                expect(success).toHaveBeenCalledWith(data.location);
            });
        });

        describe('fails', function() {
            var reason;

            beforeEach(function(done) {
                reason = new Error('Something went really wrong...');
                callback(reason, null);

                process.nextTick(done);
            });

            it('should reject the promise', function() {
                expect(failure).toHaveBeenCalledWith(reason);
            });
        });
    });
});
