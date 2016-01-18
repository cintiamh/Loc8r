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
* ObjectId - For a unique ID in a path other than "id"

## Defining simple Mongoose schemas

Create the file app_server/models/locations.js:

```js
var mongoose = require('mongoose');
```

And require it from the end of db.js:

```js
require('./locations');
```

### The basics of setting up a schema

```js
var locationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    address: String,
    rating: {type: Number, "default": 0, min: 0, max: 5},
    facilities: [String],
    coords: {type: [Number], index: '2dsphere'}
});
```

The data for a single geographical location is stored according to the GeoJSON format specification.
The 2dsphere enables MongoDB to do the correct calculations on geometries based on a spherical object.
To meet the GeoJSON specification, a coordinate pair must be entered into the array in the correct order: longitude then latitude.

### Creating more complex schemas with subdocuments

In a document database anything that belongs specifically to a parent document should be contained within that document.
In a relational database you'd create some separated tables, and join them together in a query when you need the information, like opening hours and reviews.

MongoDB offers the concept of subdocuments to store these repeating, nested data.
Subdocuments are very much like documents in that they have their own schema and each is given an unique id by MongoDB when created.
But subdocuments are nested inside a document and they can only be accessed as a path of that parent document.

```js
var openingTimeSchema = new mongoose.Schema({
    days: {type: String, required: true},
    opening: String,
    closing: String,
    closed: {type: Boolean, required: true}
});

var reviewSchema = new mongoose.Schema({
    author: String,
    rating: {type: Number, required: true, min: 0, max: 5},
    reviewText: String,
    createdOn: {type: Date, "default": Date.now}
})

var locationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    address: String,
    rating: {type: Number, "default": 0, min: 0, max: 5},
    facilities: [String],
    coords: {type: [Number], index: '2dsphere'},
    openingTimes: [openingTimeSchema],
    reviews: [reviewSchema]
});
```

### Compiling Mongoose schemas into models

An application doesn't interact with the schema directly when working with data; data interaction is done through models.

In Mongoose, a model is a compiled version of the schema.
Once compiled, a single instance of the model maps directly to a single document in your database.
It's through this direct one-to-one relationship that the model can create, read, save, and delete data.

#### Compiling a model from a schema

You just need to ensure that the schema is complete before you invoke the `model` command.

```js
mongoose.model('Location', locationSchema, 'Locations');
```

The parameters are:
* 'Location': The name of the model
* locationSchema: The schema to use
* 'Locations': MongoDB collection name (optional - default is pluralized version of the model name)

## Using the MongoDB shell to create a MongoDB database and add data

### MongoDB shell basics

Starting the MongoDB shell:

```
$ mongo
```

Listing all local databases

```
> show dbs
```

Using a specific database:

```
> use local
```

Listing the collections in a database:

```
> show collections
```

Seeing the contents of a collection

```js
db.collectionName.find(queryObject)
```

The simplest query is an empty query, which will return all of the documents in a collection.

```
> db.startup_log.find()
> db.startup_log.find().pretty()
```

### Creating a MongoDB database

You don't have to actually create a MongoDB database; you just have to start to use it.

```
> use Loc8r
```

#### Creating a collection and documents

Similarly, you don't have to explicitly create a collection as MongoDB will create it for you when you first save data into it.

```
> db.locations.save({  
    name: 'Starcups',
    address: '125 High Street, Reading, RG6 1PS',
    rating: 3,
    facilities: ['Hot drinks', 'Food', 'Premium wifi'],
    coords: [-0.9690884, 51.455041],
    openingTimes: [{
        days: 'Monday - Friday',
        opening: '7:00am',
        closing: '7:00pm',
        closed: false
    }, {
        days: 'Saturday',
        opening: '8:00am',
        closing: '5:00pm',
        closed: false
    }, {
        days: 'Sunday',
        closed: true
    }]
})
```

#### Adding subdocuments

MongoDB has an update command that accepts two arguments, the first being a query so that it knows which document to update, and the second contains the instructions on what to do when it has found the document.

```
> db.locations.update({
    name: 'Starcups'
}, {
    $push: {
        reviews: {
            author: 'Simon Holmes',
            id: ObjectId(),
            rating: 5,
            timestamp: new Date("July 16, 2013"),
            reviewText: 'What a great place. I can\'t say enough good things about it.'
        }
    }
})
```

## Getting our database live

### Setting up MongoLab and getting the database URI

http://docs.mongolab.com/

```
$ heroku config:set MONGOLAB_URI=your_db_uri
```

### Pushing up the data

Creating a temporary folder:

```
$ mkdir -p ~/tmp/mongodump
```

#### Dumping the data from the development database

`mongodump` parameters:

* `-h` - the host server
* `-d` - the database name
* `-o` - the output destination folder

```
$ mongodump -h localhost:27017 -d Loc8r -o ~/tmp/mongodump
```

#### Restoring the data to your live database

`mongorestore` parameters:

* `-h` - live host and port
* `-d` - live database name
* `-u` - Username for the live database
* `-p` - Password for the live database
* Path to the dump directory and database name.

```
$ mongorestore -h ds033669.mongolab.com:33669 -d heroku_app20110907 -u heroku_app20110907 -p 4rqhlidfdqq6vgdi06c15jrlpf ~/tmp/mongodump/Loc8r
```

#### Testing the live database

```
$ mongo hostname:port/database_name -u username -p password

$ mongo ds033669.mongolab.com:33669/heroku_app20110907 -u heroku_app20110907 -p 4rqhlidfdqq6vgdi06c15jrlpf
```

```
> show collections
> db.locations.find()
```

### Making the application use the right database

#### The NODE_ENV environment variable

The application already uses NODE_ENV. By default Heroku should set NODE_ENV to production so that the application will run in production mode on their server.

To ensure Heroku is using production mode:

```
$ heroku config:set NODE_ENV=production
```

You can read NODE_ENV from anywhere in the application by using:

```
process.env.NODE_ENV
```

Unless specified in your environment this will come back as `undefined`. You can specify different environment variables when starting the Node application by prepending the assignment to the launch command.

```
$ NODE_ENV=production nodemon
```

Don't set NODE_ENV from inside the application, only read it.
