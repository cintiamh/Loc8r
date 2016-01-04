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
