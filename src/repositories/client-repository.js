const mongoose = require('mongoose');

const Client = mongoose.model('Client');

exports.create = async (data) => {
    const client = new Client(data);
    await client.save();
};

exports.getByClientId = async (clientId) => {
    const res = await Client.findOne({
        clientId,
    });
    return res;
};
