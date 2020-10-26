const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
// eslint-disable-next-line no-unused-vars
const router = express.Router();

mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(config.CONNECTION_STRING, { useNewUrlParser: true });

// load models
/* eslint-disable no-unused-vars */
const User = require('./models/user');
const Client = require('./models/client');
const Token = require('./models/token');
/* eslint-disable no-unused-vars */

// load routes
const indexRoute = require('./routes/index-route');
const userRoute = require('./routes/user-route');
const clientRoute = require('./routes/client-route');
const oAuth2Route = require('./routes/oauth2-route');

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

// Enable CORS
if (config.MODE === 'development') {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        next();
    });
}

app.use('/', indexRoute);
app.use('/users', userRoute);
app.use('/clients', clientRoute);
app.use('/oauth2', oAuth2Route);

module.exports = app;
