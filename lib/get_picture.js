'use strict';

var BluebirdPromise = require('bluebird');
var getFacebookPicture = require('./picture/facebook');

module.exports = function getPicture(links) {
    if (!links.facebook) {
        return BluebirdPromise.reject(new Error('A facebook link is required to get a picture.'));
    }

    return getFacebookPicture(links.facebook);
};
