'use strict';

var cheerio = require('cheerio');
var find = require('lodash/collection/find');
var map = require('lodash/collection/map');
var filter = require('lodash/collection/filter');
var every = require('lodash/collection/every');
var flatten = require('lodash/array/flatten');

module.exports = function scrapeLinks(html, config) {
    var $ = cheerio.load(html);

    return Object.keys(config).reduce(function getLink(result, type) {
        var matchers = filter(config[type], function findMatcher(entry) {
            return entry.charAt(0) !== '!';
        });
        var negators = map(filter(config[type], function findNegator(entry) {
            return entry.charAt(0) === '!';
        }), function removeBang(entry) {
            return entry.substr(1);
        });
        var hrefs = flatten(map(matchers, function getHrefs(matcher) {
            return map($('a[href*="' + matcher + '"]'), function getHref(element) {
                return $(element).attr('href');
            });
        }));

        result[type] = find(hrefs, function checkForNegation(href) {
            return every(negators, function(negator) {
                return href.indexOf(negator) < 0;
            });
        }) || null;

        return result;
    }, {});
};
