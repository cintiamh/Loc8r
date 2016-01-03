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
