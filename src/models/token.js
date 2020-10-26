const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
    state: {
        type: String,
        trim: true,
    },
    scope: {
        type: String,
        trim: true,
    },
    code_challenge: {
        type: String,
        required: true,
        trim: false,
        index: true,
    },
    code_challenge_method: {
        type: String,
        required: true,
        trim: true,
    },
    authorization_code: {
        type: String,
        trim: true,
    },
    access_token: {
        type: String,
        trim: false,
        index: true,
    },
    username: {
        type: String,
        trim: true,
    },
    token_type: {
        type: String,
        trim: true,
    },
    issued_at: {
        type: Number,
    },
    expires_in: {
        type: Number,
    },
    refresh_token: {
        type: String,
        trim: false,
        index: true,
    },
});

module.exports = mongoose.model('Token', schema);
