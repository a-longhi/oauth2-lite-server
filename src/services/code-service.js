function replaceAll(str, find, replace) {
    return str.split(find).join(replace);
}

exports.generateCode = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

exports.urlEncode = (data) => replaceAll(replaceAll(replaceAll(data, '/', '_'), '+', '-'), '=', '');

exports.isTokenExpired = (token) => {
    const date = new Date(token.issued_at);
    date.setSeconds(date.getSeconds() + token.expires_in);
    return date < new Date();
};
