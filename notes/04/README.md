# 4. Building a static site with Node and Express

* Create a static site that you can click through.
* We'll take the data out from the views and put it into the controllers.
* Controllers passing hard-coded data to the views.

## Defining the routes in Express

Pages we want:

* Locations
    * List page - `/`
    * Details page - `/location`
    * Add Review page - `/location/review/new`
* Others
    * About page - `/about`

### Different controller files for different collections

Looking at the collections we've decided upon, we'll split the controllers up into Locations and Others.

Create these files:

* app_server/controllers/locations.js
* app_server/controllers/others.js

In index.js we'll require both of these files and assign each to a relevant variable name.

The index.js file:

```js
var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');

router.get('/', ctrlLocations.homeList);
router.get('/location', ctrlLocations.locationInfo);
router.get('/location/review/new', ctrlLocations.addReview);

router.get('/about', ctrlOthers.about);

module.exports = router;
```

## Building basic controllers
