const express = require('express');

const router = express.Router();
const controller = require('../controllers/oauth2-controller');

router.get('/authorize', controller.authorize);
router.post('/login', controller.login);
router.post('/token', controller.token);
router.post('/refresh', controller.refreshToken);

module.exports = router;
