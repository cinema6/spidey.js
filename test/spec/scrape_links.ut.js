var fs = require('fs');

describe('scrapeLinks(html, config)', function() {
    var scrapeLinks;

    var baileys, pennzoil, toyota, chobani;

    var config;

    beforeAll(function() {
        scrapeLinks = require('../../lib/scrape_links');
    });

    beforeEach(function() {
        baileys = fs.readFileSync(require.resolve('../helpers/baileys.html')).toString();
        pennzoil = fs.readFileSync(require.resolve('../helpers/pennzoil.html')).toString();
        toyota = fs.readFileSync(require.resolve('../helpers/toyota.html')).toString();
        chobani = fs.readFileSync(require.resolve('../helpers/chobani.html')).toString();

        config = {
            facebook: ['facebook.com', 'fb.co', '!/sharer/'],
            twitter: ['twitter.com', 'tw.co', '!/intent/'],
            instagram: ['instagram.com', 'ig.co'],
            youtube: ['youtube.com', 'yt.co'],
            pinterest: ['pinterest.com', 'pin.it']
        };
    });

    it('should return all the link URLs it can find', function() {
        expect(scrapeLinks(baileys, config)).toEqual({
            facebook: 'http://www.fb.co/baileysus',
            twitter: 'http://www.twitter.com/baileysoriginal',
            instagram: 'http://instagram.com/baileysus',
            youtube: null,
            pinterest: 'http://pinterest.com/baileysus'
        });
        expect(scrapeLinks(pennzoil, config)).toEqual({
            facebook: 'https://www.facebook.com/Pennzoil',
            twitter: 'https://tw.co/pennzoil',
            instagram: 'http://instagram.com/pennzoil?ref=badge',
            youtube: 'https://www.youtube.com/user/pennzoil',
            pinterest: null
        });
        expect(scrapeLinks(toyota, config)).toEqual({
            facebook: 'http://www.facebook.com/toyota',
            twitter: 'http://twitter.com/toyota',
            instagram: 'http://ig.co/toyotausa/',
            youtube: 'http://www.youtube.com/user/ToyotaUSA',
            pinterest: null
        });
        expect(scrapeLinks(chobani, config)).toEqual({
            facebook: 'https://www.facebook.com/Chobani',
            twitter: 'https://twitter.com/Chobani',
            instagram: 'http://instagram.com/chobani/',
            youtube: 'http://www.youtube.com/user/ChobaniYogurt',
            pinterest: 'http://www.pinterest.com/chobani/'
        });
    });
});
