'use strict';

var BluebirdPromise = require('bluebird');
var graph = require('fbgraph');
var parseURL = require('url').parse;
var basename = require('path').basename;

module.exports = function getFacebookPicture(pageURI) {
    var name = basename(parseURL(pageURI).pathname);

    return BluebirdPromise.fromCallback(function callGraph(done) {
        return graph.get(name + '/picture', { type: 'large' }, done);
    }).get('location');
};
