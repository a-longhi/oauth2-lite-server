const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const md5 = require('md5');
const TokenResponse = require('../models/token-response');
const clientRepository = require('../repositories/client-repository');
const userRepository = require('../repositories/user-repository');
const tokenRepository = require('../repositories/token-repository');
const codeService = require('../services/code-service');
const authService = require('../services/auth-service');

function generateTokenResponse(token) {
    const tokenResponse = new TokenResponse();
    tokenResponse.token_type = token.token_type;
    tokenResponse.expires_in = token.expires_in;
    tokenResponse.access_token = token.access_token;
    tokenResponse.scope = token.scope;
    tokenResponse.refresh_token = token.refresh_token;
    return tokenResponse;
}

exports.authorize = async (req, res) => {
    try {
        const responseType = req.query.response_type;
        const codeChallenge = req.query.code_challenge;
        const codeChallengeMethod = req.query.code_challenge_method;
        const clientId = req.query.client_id;
        const redirectUri = req.query.redirect_uri;
        const scope = req.query.scope;
        const state = req.query.state;

        if (responseType !== 'code') {
            res.status(501).send({ message: 'Response type unsupported' });
            return;
        }
        const client = await clientRepository.getByClientId(clientId);
        if (client === null) {
            res.status(403).send({ message: 'Client not found' });
            return;
        }
        if (client.redirectUri !== redirectUri) {
            res.status(403).send({ message: 'Redirect Uri does not match' });
            return;
        }
        if (client.enabledScopes.indexOf(scope) <= -1) {
            res.status(403).send({ message: 'This client is not enabled with this scope' });
            return;
        }

        res.redirect(302, `http://localhost:3000/oauth2/login?response_type=${responseType}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`);
    } catch (e) {
        res.status(500).send({ message: 'Problems with processing your request' });
    }
};

exports.showLogin = async (req, res) => {
    try {
        const scope = req.query.scope;
        const clientId = req.query.client_id;
        const client = await clientRepository.getByClientId(clientId);
        if (client === null) {
            res.status(403).send({ message: 'Client not found' });
            return;
        }
        const applicationName = client.description;

        const data = fs.readFileSync(path.join(`${require.main.path}/html/login.html`), 'utf8');
        res.set('content-type', 'text/html; charset=UTF-8');
        // naive templating
        res.send(data.replace('{applicationName}', applicationName).replace('{scope}', scope));
    } catch (e) {
        res.status(500).send({ message: 'Problems with processing your request: ' });
    }
};

exports.login = async (req, res) => {
    try {
        const responseType = req.body.response_type;
        const codeChallenge = req.body.code_challenge; // base64url(code_challenge)
        const codeChallengeMethod = req.body.code_challenge_method;
        const clientId = req.body.client_id;
        const redirectUri = req.body.redirect_uri;
        const scope = req.body.scope;
        const state = req.body.state;
        const email = req.body.email;
        const password = req.body.password;

        if (responseType !== 'code') {
            res.status(501).send({ message: 'Response type unsupported' });
        }
        const client = await clientRepository.getByClientId(clientId);
        if (client === null) {
            res.status(403).send({ message: 'Client not found' });
            return;
        }
        if (client.redirectUri !== redirectUri) {
            res.status(403).send({ message: 'Redirect Uri does not match' });
            return;
        }

        const user = await userRepository.authenticate({
            email: email,
            password: md5(password + global.SALT_KEY),
        });

        if (!user) {
            res.status(401).send({ error: 'User not found' });
            return;
        }

        const authorizationCode = codeService.generateCode(38);

        await tokenRepository.create({
            state,
            scope,
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod,
            authorization_code: authorizationCode,
            access_token: null,
            username: email,
            token_type: null,
            issued_at: new Date().getTime(),
            expires_in: null,
            refresh_token: null,
        });

        res.redirect(`${redirectUri}?state=${state}&code=${authorizationCode}`);
    } catch (e) {
        res.status(500).send({ message: 'Problems processing your request' });
    }
};

exports.token = async (req, res) => {
    try {
        const clientId = req.body.client_id;
        const authorizationCode = req.body.code;
        const codeVerifier = req.body.code_verifier;
        const grantType = req.body.grant_type;

        if (grantType !== 'authorization_code') {
            res.status(501).send({ message: 'Grant type unsupported' });
            return;
        }
        const client = await clientRepository.getByClientId(clientId);
        if (client === null) {
            res.status(403).send({ message: 'Client not found' });
            return;
        }
        const token = await tokenRepository.getByAuthorizationCode(authorizationCode);
        if (token === null) {
            res.status(401).send({ message: 'Authorization code not found' });
            return;
        }

        const myCodeChallenge = await crypto.createHash('sha256').update(codeVerifier).digest('base64');
        const encoded = codeService.urlEncode(myCodeChallenge);
        if (encoded !== token.code_challenge) {
            res.status(401).send({ message: 'Stored code challenge does not match with code verifier' });
            return;
        }

        const jwtToken = await authService.generateToken({
            // id: customer._id,
            username: token.username,
            scope: token.scope,
        });

        token.token_type = 'Bearer';
        token.issued_at = new Date().getTime();
        token.expires_in = 86400;
        token.access_token = jwtToken;
        token.refresh_token = codeService.generateCode(25);
        await token.save();

        const tokenResponse = generateTokenResponse(token);
        res.status(200).send(tokenResponse);
    } catch (e) {
        res.status(500).send({ message: 'Problems processing your request' });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const grantType = req.body.grant_type;
        const clientId = req.body.client_id;
        const refreshToken = req.body.refresh_token;

        if (grantType !== 'refresh_token') {
            res.status(501).send({ message: 'Grant type unsupported' });
            return;
        }
        const client = await clientRepository.getByClientId(clientId);
        if (client === null) {
            res.status(401).send({ message: 'Client not found' });
            return;
        }
        const oldToken = await tokenRepository.getByRefreshToken(refreshToken);
        if (oldToken === null) {
            res.status(401).send({ message: 'Token not found' });
            return;
        }
        let returningToken;
        if (codeService.isTokenExpired(oldToken)) {
            const jwtToken = await authService.generateToken({
                username: oldToken.username,
                scope: oldToken.scope,
            });

            const newToken = await tokenRepository.create({
                state: oldToken.state,
                scope: oldToken.scope,
                code_challenge: oldToken.code_challenge,
                code_challenge_method: oldToken.code_challenge_method,
                authorization_code: oldToken.authorization_code,
                access_token: jwtToken,
                username: oldToken.username,
                token_type: 'Bearer',
                issued_at: new Date().getTime(),
                expires_in: 86400,
                refresh_token: codeService.generateCode(25),
            });
            await tokenRepository.deleteByRefreshToken(oldToken.refresh_token);
            returningToken = newToken;
        } else {
            returningToken = oldToken;
        }

        const tokenResponse = generateTokenResponse(returningToken);
        res.status(200).send(tokenResponse);
    } catch (e) {
        res.status(500).send({ message: 'Problems with processing your request' });
    }
};
