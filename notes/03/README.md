# 3. Creating and setting up a MEAN project

## Creating an Express project

To create an Express project you'll need to have five key things installed on your
development machine:

* Node and npm
* The Express generator installed globally
* Git
* Heroku

```
$ node --version
$ npm --version
$ express --version
```

Install express generator globally:

```
$ npm install -g express-generator
```

```
$ express
```

This would install the framework with default settings into your current folder.

### Configuration options when creating an express project

Options:

* HTML template engine (Jade)
* CSS preprocessor
* Add support for sessions or not

```
--css less|stylus => CSS preprocessor (Less or Stylus)
--ejs             => HTML template engine to EJS
--jshtml          => HTML template engine to Js HTML
--hogan           => HTML template engine to Hogan
```

Jade example:

```
#banner.page-header
    h1 My page
    p.lead Welcome to my page
```

Becomes

```
<div id="banner" class="page-header">
    <h1>My page</h1>
    <p class="lead">Welcome to my page</p>
</div>
```

### Creating an Express Project and Trying it Out

Since we decided to use the default configuration, just type in:

```
$ express
```

This will create the whole folder and files structure that will be the basis for our Loc8r application.
Next, you'll need to install the dependencies.

```
$ npm install
```

To try it out, run:

```
$ npm start
```

Now you can check it out at http://localhost:3000

### About Express Middleware

In the `app.js` file, there are a lot of lines that start with `app.use`. These are known as `middleware`.
When a request comes into the application it passes through each piece of middleware in turn.
Each middleware may or may not do something with the request, but it's always passed on to the next one until it reaches the application logic itself, which returns a response.

### Restarting the application

A Node application compiles before running, so if you make changes to the application code while it's running, they won't be picked up until Node process is stopped and restarted.

#### Automatically restarting the application with nodemon

Nodemon simply wraps the Node application, and other than monitoring for changes causes no interference.
First install `nodemon` globally:

```
$ npm install -g nodemon
```

Now, instead of running `npm start`, run just `nodemon`.
Note that nodemon is only intended for easing the development process, and shouldn't really be used in a live production.

### Modifying Express for MVC

MVC is the architecture that aims to separate out the data, display and application logic. This separation is to remove any tight coupling between components, making the code more maintainable and reusable.

MVC architecture loop:

1. A request comes into the application.
2. The request gets routed to a controller.
3. The controller, if necessary, makes a request to the model.
4. The model responds to the controller.
5. The controller sends a response to a view.
6. The view sends a response to the original requester.

### Changing the folder structure

1. Create a new folder `app_server`.
2. In `app_server` create two new folders called `models` and `controllers`.
3. Move the `views` and `routes` folders from the root into the `app_server` folder.

Now we have a really obvious MVC setup in the application, but if you try to run it now, it will fail.
Express doesn't know that we've added in some new folders, or have any idea what we want to use them for. So we need to tell it.

### Using the new views and routes folders

In `app.js` find the following line:

```javascript
app.set('views', path.join(__dirname, 'views'));
(...)
var routes = require('./routes/index');
var users = require('./routes/users');
```

And change it to:

```javascript
app.set('views', path.join(__dirname, 'app_server', 'views'));
(...)
var routes = require('./app_server/routes/index');
var users = require('./app_server/routes/users');
```

Now all should be working.

### Splitting controllers from routes

In a default Express setup, controllers are very much part of the routes, but we want to separate them out.
Controllers should manage the application logic, and routing should map URL requests to controllers.

Let's make the change in two steps to make it clearer.

In `app_server/routes/index.js` we have the following:

```javascript
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
```

Change it to:

```javascript
// Take anonymous function and define it as a named function
var homePageController = function(req, res) {
    res.render('index', { title: 'Express' });
}
// Pass name of function through as a callback in route definition
router.get('/', homePageController);
```

`res.render` is the Express function for compiling a view template to send as the HTML response that the browser will receive.
The first argument is the template name, ex: `index`, and the second argument is a JSON object to be passed in.

#### Creating and using Node modules

To create an external module in Node, you create a new file, choose which bits of it you want to expose to the original file, and then `require` your new file in your original file.

In your new module file you expose the parts of the code that you wish to by using the `module.exports` method.

```javascript
module.exports = function () {
  console.log("This is exposed to the requester");
};

require('./yourModule');

module.exports.logThis = function(message){
    console.log(message);
};
```

Create a new file: `app_server/controllers/main.js`:

```js
module.exports.index = function(req, res) {
    res.render('index', { title: 'Express' });
};
```

And modify `routes/index.js`:

```js
var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');

/* GET home page. */
router.get('/', ctrlMain.index);

module.exports = router;
```

## Import Bootstrap for quick, responsive layouts
