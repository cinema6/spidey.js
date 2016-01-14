spidey.js
=========
Overview
--------
Spidey.JS is a library for scraping social media links from webpages. By default, it will fetch links to the website's corresponding Facebook, Twitter, Instagram, YouTube, Pinterest, Google+, and Tumblr pages, and the profile picture from their Facebook page (if their Facebook page is found.)

API
--------
### spidey(*uri*, [*options*])
Uses [`request`](https://github.com/request/request) to fetch the webpage, and scrapes it for social media links.

* Parameters
    * **uri** (`String`): URI of the webpage to scrape.
    * **[options]** (`Object`): Configuration `Object` to pass to [`request`](https://github.com/request/request#requestoptions-callback).
* Returns
    * [`Promise`](https://github.com/petkaantonov/bluebird): A [`bluebird`](https://github.com/petkaantonov/bluebird) `Promise` that will be fulfilled with an object in the following format:

    ```json
    {
        "links": {
            "facebook":     "..." || null,
            "twitter":      "..." || null,
            "instagram":    "..." || null,
            "youtube":      "..." || null,
            "pinterest":    "..." || null,
            "google":       "..." || null,
            "tumblr":       "..." || null
        },
        "images": {
            "profile":      "..." || null
        }
    }
    ```

### spidey.configure(*links*)
Globally reconfigures `spidey()` to scrape for new configured links (in addition to the defaults.)

* Parameters
    * **links** (`Object`): An `Object` in the following format:

    ```javascript
    {
        // Will search for friendster social links by
        // first searching for links that contain
        // "friendster.com" and then searching for links
        // that contain "friendst.er." Will not include any
        // links that contain "/share/".
        "friendster": [
            "friendster.com",
            "friendst.er",
            "!/share/"
        ],

        // Reconfigures the Facebook link lookup to also
        // search for links that contain "fb.me."
        "facebook": ["facebook.com", "fb.me"]
    }
    ```
* Returns
    * `Function`: A reference to `spidey`.

    ```javascript
    var spidey = require('spidey');
    
    spidey.configure({ myspace: ['myspace.com'] })('http://some-website.com')
        .then(result => console.log(result.links.myspace));
    ```