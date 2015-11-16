'use strict';

var cheerio = require('cheerio');
var find = require('lodash/collection/find');
var map = require('lodash/collection/map');

module.exports = function scrapeLinks(html, config) {
    var $ = cheerio.load(html);

    return Object.keys(config).reduce(function getLink(result, type) {
        var hosts = config[type];

        result[type] = find(map(hosts, function getLinkHref(host) {
            return $('a[href*="' + host + '"]').attr('href');
        })) || null;

        return result;
    }, {});
};
