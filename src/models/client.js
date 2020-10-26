const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
    clientId: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    redirectUri: {
        type: String,
        required: true,
        trim: true,
    },
    enabledScopes: {
        type: [String],
    },
});

module.exports = mongoose.model('Client', schema);
