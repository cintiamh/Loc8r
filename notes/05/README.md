# Building a data model with MongoDB and Mongoose

## Install MongoDB

```
$ brew update
$ brew install mongodb
```

We'll be working with a MongoDB database, but most of the work will be in Express and Node.

## Connecting the Express application to MongoDB using Mongoose

We could connect our application directly using MongoDB and have the two interact with each other using the native driver.
While the native MongoDB driver is very powerful it isn't particularly easy to work with.
It also doesn't offer a built in way of defining and maintaining data structures.
Mongoose exposes most of the functionality of the native driver, but in a more convenient way, designed to fit into the flows of application development.

Mongoose includes the ability to add validation to our data definitions.

MongoDB only talks to Mongoose, and Mongoose talks to Node and Express.

| Database  |           Application            | Browser application |
|-----------|----------------------------------|---------------------|
| MongoDB   |  Mongoose <=> Node.js / Express  |    Angular.js       |

### Adding Mongoose to our application

```
$ npm install --save mongoose
```

### Adding a Mongoose connection to our application

When we connect our application to a database MongoDB will create a database when we first try to use it.

Mongoose opens a pool of five reusable connections when it connects to a MongoDB database.
This pool of connections is shared between all requests.

Opening and closing connections to databases can take a while, especially if your database is on a separated server.
The best practice is to open the connection when your application starts up, and to leave it open until your application restarts or shuts down.

#### Setting up the connection file

In app_server/models/db.js

```js
var mongoose = require('mongoose');
```

Require this file in app.js:

```js
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('./app_server/models/db');
```

We're not going to export any functions from db.js, so we don't need to assign it to a variable when we require it.

#### Creating the Mongoose connection
