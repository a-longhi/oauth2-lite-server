const jwt = require('jsonwebtoken');

exports.generateToken = async (data) => jwt.sign(data, global.SALT_KEY, { expiresIn: '1d' });

exports.decodeToken = async (token) => jwt.verify(token, global.SALT_KEY);

exports.authorize = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        res.status(401).json({
            message: 'Restricted access',
        });
    } else {
        jwt.verify(token, global.SALT_KEY, (error) => {
            if (error) {
                res.status(401).json({
                    message: 'Invalid token',
                });
            } else {
                next();
            }
        });
    }
};

exports.isAdmin = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        res.status(401).json({
            message: 'Invalid token',
        });
    } else {
        jwt.verify(token, global.SALT_KEY, (error, decoded) => {
            if (error) {
                res.status(401).json({
                    message: 'Token Inválido',
                });
            } else if (decoded.roles.includes('admin')) {
                next();
            } else {
                res.status(403).json({
                    message: 'Funcionalidade restrita',
                });
            }
        });
    }
};
