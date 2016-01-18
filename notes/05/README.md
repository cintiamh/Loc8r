# Building a data model with MongoDB and Mongoose

## Install MongoDB

```
$ brew update
$ brew install mongodb
```

We'll be working with a MongoDB database, but most of the work will be in Express and Node.

## Run MongoDB

### Create the data directory

Before you start MongoDB for the first time, create the directory to which the mongodb process will write data.
By default, the mongod process uses the `/data/db` directory.
If you create a directory other than this one, you must specify that directory in the `dbpath` option when starting the mongod process using `--dbpath` option.

```
$ mkdir -p /data/db
```

### Set permission for the data directory

Ensure that the account running mongod has read and write permission for the directory.

### Run MongoDB

```
$ mongod
$ mongod --dbpath <path to data directory>
```

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

Database URI construct:

```
mongodb://username:password@localhost:27027/database
```

The username, password and port are optional.

For our application we only need (app_server/models/db.js):

```js
var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/Loc8r';
mongoose.connect(dbURI);
```

#### Monitoring the connection with Mongoose connection events

Mongoose will publish events based on the status of the connection.

#### Closing a Mongoose connection

In app_server/models/db.js

```js
var gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
}
// For nodemon restarts
process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});
// For app termination
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function() {
    process.exit(0);
  });
});
// For Heroku app termination
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app shutdown', function() {
    process.exit(0);
  });
});
```

#### Using multiple databases

If you need to, you can also use the code as:

```js
var dbURILog = 'mongodb://localhost/Loc8rLog';
var logDB = mongoose.createConnection(dbURILog);
logDB.on('connected', function() {
  console.log('Mongoose connected to ' + dbURILog);
});
...
```

## Why model the data

### What is Mongoose and how does it work?

Mongoose was built specifically as a MongoDB Object-Document Modeler (ODM) for Node applications.
One of the key principles is that you can manage your data model from within your application.

Naming conventions:
* In MongoDB each entry in a database is called a document.
* In MongoDB a collection of documents is called a collection (think "table" if you're used to relational databases).
* In Mongoose the definition of a document is called a schema.
* Each individual data entity defined in a schema is called a path.
* A Model is the compiled version of a schema. All data interactions using Mongoose go through the model.

MongoDB document:

```js
{
  "firstname": "Simon",
  "surname": "Holmes",
  _id: ObjectId("52279effc62ca8b0c1000007")
}
```

Corresponding Mongoose schema:

```js
{
  firstname: String,
  surname: String
}
```

The schema defines the name for each data path, and the data type it will contain.

#### Allowed Schema types

* String - UTF-8
* Number - doesn't support long or double numbers - need plugin for this
* Date - ISODate Object from MongoDB
* Boolean - True or false
* Buffer - For binary information such as images.
* Mixed - Any data type
* Array - Can either be an array of the same data type, or an array of nested subdocuments
* ObjectId - For a unique ID in a path other than "_id"
