const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.get = async () => {
    const res = await User.find({}, 'name email active roles created');
    return res;
};

exports.getById = async (id) => {
    const res = await User.findById(id, 'name email active roles created');
    return res;
};

exports.create = async (data) => {
    const user = new User(data);
    await user.save();
};

exports.authenticate = async (data) => {
    const res = await User.findOne({
        email: data.email,
        password: data.password,
        active: true,
    });
    return res;
};
