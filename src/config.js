global.PROJECT_NAME = 'OAuth2.0 PKCE Authorization Server';
global.PROJECT_URL = 'http://localhost:3000';
global.PROJECT_VERSION = '1.0.0';
global.SALT_KEY = 'e8ccfba6-f087-4697-a567-2ee41e6b6697'; // important

module.exports = {
    MODE: 'development', // production or development
    CONNECTION_STRING: 'mongodb://localhost:27017/oauth2', // mongodb connection string (required)
};
