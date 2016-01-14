var BluebirdPromise = require('bluebird');
var fs = require('fs');
var assign = require('lodash/object/assign');

describe('spidey(uri, options)', function() {
    var spidey;

    var __request__;
    var request, scrapeLinks, getPicture;

    var uri, options;
    var success, failure;

    var getDeferred, getPictureDeferred;

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
        require('../../lib/scrape_links');
        require('../../lib/get_picture');
    });

    beforeEach(function(done) {
        __request__ = require('request-promise');

        scrapeLinks = spyOn(require.cache[require.resolve('../../lib/scrape_links')], 'exports').and.callThrough();
        getPicture = spyOn(require.cache[require.resolve('../../lib/get_picture')], 'exports').and.callThrough();

        delete require.cache[require.resolve('../../lib/spidey')];
        spidey = require('../../lib/spidey');

        uri = 'http://www.bmwusa.com/';
        options = {
            auth: {
                username: 'foo',
                password: 'bar'
            },
            followRedirect: false
        };

        success = jasmine.createSpy('success()');
        failure = jasmine.createSpy('failure()');

        (function() {
            var defaults = __request__.defaults;
            spyOn(__request__, 'defaults').and.callFake(function() {
                request = defaults.apply(this, arguments);

                getDeferred = defer();
                spyOn(request, 'get').and.returnValue(getDeferred.promise);

                return request;
            });
        }());

        getPictureDeferred = defer();
        getPicture.and.returnValue(getPictureDeferred.promise);

        spidey(uri, options).then(success, failure);
        process.nextTick(done);
    });

    it('should create a new request() instance with the supplied options', function() {
        expect(__request__.defaults).toHaveBeenCalledWith(options);
    });

    it('should get the supplied URI', function() {
        expect(request.get).toHaveBeenCalledWith(uri);
    });

    describe('when the html is returned', function() {
        var html;

        beforeEach(function(done) {
            html = fs.readFileSync(require.resolve('../helpers/baileys.html')).toString();

            getDeferred.resolve(html);
            process.nextTick(done);
        });

        it('should scrape the links from the HTML', function() {
            expect(scrapeLinks).toHaveBeenCalledWith(html, {
                facebook: ['facebook.com', '!/sharer/'],
                twitter: ['twitter.com', '!/intent/'],
                instagram: ['instagram'],
                youtube: ['youtube.com/user'],
                pinterest: ['pinterest.com'],
                google: ['plus.google.com'],
                tumblr: ['tumblr.com']
            });
        });

        it('should get the picture', function() {
            expect(getPicture).toHaveBeenCalledWith(scrapeLinks.calls.mostRecent().returnValue);
        });

        describe('and getting the picture succeeds', function() {
            var pictureURI;

            beforeEach(function(done) {
                pictureURI = 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash2/v/t1.0-1/p160x160/557283_10151130282316303_1281215985_n.jpg?oh=0e36317d548e21a48e0c27217c5822b1&oe=56F8DB18&__gda__=1458828776_076d91944f349453f673a5aad0ad7def';

                getPictureDeferred.resolve(pictureURI);
                process.nextTick(done);
            });

            it('should fulfill with the scraped data', function() {
                expect(success).toHaveBeenCalledWith({
                    links: assign({}, scrapeLinks.calls.mostRecent().returnValue, { website: uri }),
                    images: {
                        profile: pictureURI
                    }
                });
            });
        });

        describe('and getting the picture fails', function() {
            var reason;

            beforeEach(function(done) {
                reason = new Error('I couldn\'t do it...');

                getPictureDeferred.reject(reason);
                process.nextTick(done);
            });

            it('should fulfill the promise without the image', function() {
                expect(success).toHaveBeenCalledWith({
                    links: assign({}, scrapeLinks.calls.mostRecent().returnValue, { website: uri }),
                    images: {
                        profile: null
                    }
                });
            });
        });
    });

    describe('.configure(links)', function() {
        var html;
        var links;
        var result;

        beforeEach(function(done) {
            html = fs.readFileSync(require.resolve('../helpers/baileys.html')).toString();
            scrapeLinks.calls.reset();

            links = {
                facebook: ['fb.com', 'facebook.com'],
                vimeo: ['vimeo.com'],
                dailymotion: ['dailymotion.com']
            };

            result = spidey.configure(links);

            spidey(uri).finally(done);

            getDeferred.resolve(html);
            getPicture.and.returnValue(BluebirdPromise.resolve('my-image.png'));
        });

        it('should return spidey()', function() {
            expect(result).toBe(spidey);
        });

        it('should scrape the links with the specified config', function() {
            expect(scrapeLinks).toHaveBeenCalledWith(html, {
                facebook: ['fb.com', 'facebook.com'],
                twitter: ['twitter.com', '!/intent/'],
                instagram: ['instagram'],
                youtube: ['youtube.com/user'],
                pinterest: ['pinterest.com'],
                google: ['plus.google.com'],
                tumblr: ['tumblr.com'],
                vimeo: ['vimeo.com'],
                dailymotion: ['dailymotion.com']
            });
        });
    });
});
