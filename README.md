# oauth2-lite-server

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=a-longhi_oauth2-lite-server&metric=alert_status)](https://sonarcloud.io/dashboard?id=a-longhi_oauth2-lite-server)

This project has the intention to help developers dive into how OAuth2.0 works, implementing a simple node server.
Actually only Authorization Code Flow with Proof Key for Code Exchange (PKCE) is implemented.
Note: not for production.

## Code structure

- doc/
- postman/
- src/
    - controllers/
    - models/
    - repositories/
    - routes/
    - services/
    - validators/
    - app.js
    - config.js
- test/
    - config
- www/

## Tech

This project uses a number of open source projects to work properly:

* [Node.js](https://nodejs.org/) - evented I/O for the backend
* [Express](http://expressjs.com/) - fast node.js network app framework
* [Mongoose](http://mongoosejs.com/) - elegant mongodb object modeling for node.js
* [JWT Auth](http://mongoosejs.com/) - JsonWebToken implementation for node.js
* [apiDoc](http://apidocjs.com/) - Inline Documentation for RESTful web APIs
* [Mocha](https://mochajs.org/) - simple, flexible, fun javascript test framework for node.js


## Install
Prerequisites:

* [Npm](https://www.npmjs.com/)
* [Node.js](https://nodejs.org/) - version 8 or above

Install the dependencies and devDependencies:

```sh
$ cd oauth2-lite-server
$ npm install
```

## Run
Prerequisites:
* [mongoDB](https://www.mongodb.com/)


You need to edit **src/config.js** and put your configuration variables.
How to start the server:

```sh
$ npm start
```

How to start the server with livereload:

```sh
$ npm run live
```

### Testing

You need to edit the test config file **test/config** and run:

```sh
$ npm test
```

### Documentation

You can see the API documentation on **doc/** folder. If you want to re-generate the documentation, you need to run this comand:

```sh
$ apidoc -i src/controllers
```

### Development

Want to contribute? Great! Open your pull requests to the `develop` branch

License
----

Apache-2.0
See [LICENSE.md](LICENSE) file
