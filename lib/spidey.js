'use strict';

var scrapeLinks = require('./scrape_links');
var getPicture = require('./get_picture');
var assign = require('lodash/object/assign');
var cloneDeep = require('lodash/lang/cloneDeep');

var LINK_CONFIG = {
    facebook: ['facebook.com'],
    twitter: ['twitter.com'],
    instagram: ['instagram'],
    youtube: ['youtube.com/user'],
    pinterest: ['pinterest.com'],
    google: ['plus.google.com'],
    tumblr: ['tumblr.com']
};
var customConfig = {};

function spidey(uri, options) {
    var request = require('request-promise').defaults(options);

    return request.get(uri).then(function scrape(html) {
        var links = scrapeLinks(html, assign({}, LINK_CONFIG, customConfig));

        return getPicture(links).catchReturn(null).then(function createResponse(pictureURI) {
            return {
                links: assign({ website: uri }, links),
                images: {
                    profile: pictureURI
                }
            };
        });
    });
}

spidey.configure = function configureSpidey(links) {
    customConfig = cloneDeep(links);
    return spidey;
};

module.exports = spidey;
