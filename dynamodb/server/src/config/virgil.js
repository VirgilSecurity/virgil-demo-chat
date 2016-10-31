module.exports = {
    accessToken: process.env.VIRGIL_ACCESS_TOKEN,
    options: {
        cardsBaseUrl: process.env.VIRGIL_CARDS_URL,
        cardsReadBaseUrl: process.env.VIRGIL_CARDS_READ_URL,
        identityBaseUrl: process.env.VIRGIL_IDENTITY_URL
    }
};

