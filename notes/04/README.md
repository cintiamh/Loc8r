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

others.js

```js
module.exports.about = function(req, res) {
    res.render('index', { title: 'About' });
};
```

locations.js

```js
module.exports.homeList = function(req, res) {
    res.render('index', { title: 'Home' });
};
module.exports.locationInfo = function(req, res) {
    res.render('index', { title: 'Location Info' });
};
module.exports.addReview = function(req, res) {
    res.render('index', { title: 'Add Review' });
};
```

## Creating some views

### A look at Bootstrap

#### Bootstrap responsive grid system

Bootstrap uses a 12-column grid. Bootstrap has various CSS references that let you target up to four different pixel-width breakpoints for your layouts.

* xs => Less than 768px
* sm => 768px or more
* md => 992px or more
* lg => 1,200 or more

To define the width of an element you combine a CSS reference from the list with the number of columns you wish it to span.

col-sm-6 => This class will make the element it's applied to take up to 6 columns on screens of size sm and larger.

* col denotes that this element will act as a column
* sm minimum target breakpoint
* 6 number of columns to take up

To get the responsive side of things to work, you can apply multiple classes to a single element. So if you wanted a div to span the entire width of the screen on the phone, but only half of the width on tablets and larger, you could use:

```html
<div class="col-xs-12 col-sm-6"></div>
```

We modified layout.jade to have a header and footer using Bootstrap:

```
doctype html
html
  head
    meta(name='viewport', content='width=device-width, initial-scale=1.0')
    title= title
    link(rel='stylesheet', href='/bootstrap/css/usebootstrap.min.css')
    link(rel='stylesheet', href='/stylesheets/style.css')
  body
    .navbar.navbar-default.navbar-fixed-top
        .container
            .navbar-header
                a.navbar-brand(href='/') Loc8r
                button.navbar-toggle(type='button', data-toggle='collapse', data-target='#navbar-main')
                    span.icon-bar
                    span.icon-bar
                    span.icon-bar
            #navbar-main.navbar-collapse.collapse
                ul.nav.navbar-nav
                    li
                        a(href='/about/') About
    .container
        block content
        footer
            .row
                .col-xs-12
                    small &copy; Cintia Higashi 2016
  script(src='/javascripts/jquery-2.1.4.js')
```

## Take the data out of the views and make them smarter

### How to move data from the view to the controller

The second parameter in the `render` method in the controller is a JSON object containing the data to send to the view.

So update your controller to:

```js
module.exports.homeList = function(req, res) {
    res.render('locations-list',
    {
      title: 'Loc8r - find a place to work with wifi',
      pageHeader: {
        title: 'Loc8r',
        strapline: 'Find places to work with wifi near you!'
      }
    });
};
```

Now you can access those values in the view:

```
h1= pageHeader.title
  small &nbsp;#{pageHeader.strapline}
```

#### Referencing data in Jade templates

There are two key syntaxes for referencing data in Jade templates.

The first is called interpolation, and it's typically used to insert data into the middle of some other content.

```
h1 Welcome to #{pageHeader.title}
```

If your data contains HTML, this will be escaped for security reasons. If you want the browser to render any HTML contained in the data you can use the following syntax:

```
h1 Welcome to !{pageHeader.title}
```

The second method of outputting the data is with buffered code, where you build the string using JavaScript. This is done by using the = sign directly after the tag declaration.

```
h1= "Welcome to " + pageHeader.title
```

Again, this will escape any HTML for security reasons. If you want to have unescaped HTML in your output you can use slightly different syntax:

```
h1!= "Welcome to " + pageHeader.title
```
