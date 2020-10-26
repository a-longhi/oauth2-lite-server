class TokenResponse {
    constructor() {
        this.token_type = null;
        this.expires_in = null;
        this.access_token = null;
        this.scope = null;
        this.refresh_token = null;
    }
}

module.exports = TokenResponse;
