var BluebirdPromise = require('bluebird');

describe('getPicture(links)', function() {
    var getPicture;
    var getFacebookPicture;

    var links;

    var success, failure;

    var getFacebookPictureDeferred;

    function defer() {
        var resolve, reject;
        var promise = new BluebirdPromise(function() {
            resolve = arguments[0];
            reject = arguments[1];
        });

        return {
            resolve: resolve,
            reject: reject,
            promise: promise
        };
    }

    beforeAll(function() {
        require('../../lib/picture/facebook');
    });

    beforeEach(function(done) {
        delete require.cache[require.resolve('../../lib/get_picture')];

        getFacebookPicture = spyOn(require.cache[require.resolve('../../lib/picture/facebook')], 'exports');

        getPicture = require('../../lib/get_picture');

        links = {
            facebook: 'http://www.facebook.com/toyota'
        };

        success = jasmine.createSpy('success()');
        failure = jasmine.createSpy('failure()');

        getFacebookPictureDeferred = defer();
        getFacebookPicture.and.returnValue(getFacebookPictureDeferred.promise);

        getPicture(links).then(success, failure);
        process.nextTick(done);
    });

    it('should get the facebook profile picture', function() {
        expect(getFacebookPicture).toHaveBeenCalledWith(links.facebook);
    });

    describe('when the picture is fetched', function() {
        var uri;

        beforeEach(function(done) {
            uri = 'https://scontent.xx.fbcdn.net/hprofile-xpa1/v/t1.0-1/150767_679343238837211_815495802068179950_n.jpg?oh=b1d1f9d302f955f3af9c4a68db972ca9&oe=56ECECAE';

            getFacebookPictureDeferred.resolve(uri);
            process.nextTick(done);
        });

        it('should fulfill with the picture URI', function() {
            expect(success).toHaveBeenCalledWith(uri);
        });
    });

    describe('if there is no facebook link', function() {
        beforeEach(function(done) {
            delete links.facebook;
            getFacebookPicture.calls.reset();

            getPicture(links).then(success, failure).finally(done);
        });

        it('should not get the facebook profile picture', function() {
            expect(getFacebookPicture).not.toHaveBeenCalled();
        });

        it('should reject the promise', function() {
            expect(failure).toHaveBeenCalledWith(new Error('A facebook link is required to get a picture.'));
        });
    });
});
