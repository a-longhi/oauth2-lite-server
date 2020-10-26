const repository = require('../repositories/client-repository');

exports.post = async (req, res) => {
    try {
        await repository.create({
            clientId: req.body.clientId,
            description: req.body.description,
            redirectUri: req.body.redirectUri,
            enabledScopes: req.body.enabledScopes,
        });

        res.status(200).send({ message: 'Client created' });
    } catch (e) {
        res.status(500).send({ error: e });
    }
};
