# Writing a REST API: Exposing the MongoDB database to the application

Now we have a MongoDB database set up, but we can only interact with it through the MongoDB shell.
We're going to build a REST API so that we can make HTTP calls for CRUD (create, read, update, and delete).

## The rules of a REST API

* REST (REpresentational State Transfer) is stateless - it has no idea of any current user state or history.
* API (application program interface) enables applications to talk to each other.

So REST API is a stateless interface to your application.

In basic terms a REST API takes an incoming HTTP request, does some processing, and always sends back an HTTP response.

### Request URLs

| Action | URL path | Parameters | Example |
|--------|----------|------------|---------|
| Create new location | `/locations` | | http://loc8r.com/api/locations |
