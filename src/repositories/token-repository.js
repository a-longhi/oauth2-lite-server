const mongoose = require('mongoose');

const Token = mongoose.model('Token');

exports.create = async (data) => {
    const token = new Token(data);
    await token.save();
    return token;
};

exports.getByAuthorizationCode = async (authorizationCode) => {
    const res = await Token.findOne({
        authorization_code: authorizationCode,
    });
    return res;
};

exports.getByRefreshToken = async (refreshToken) => {
    const res = await Token.findOne({
        refresh_token: refreshToken,
    });
    return res;
};

exports.deleteByRefreshToken = async (refreshToken) => {
    await Token.deleteOne({
        refresh_token: refreshToken,
    });
};
