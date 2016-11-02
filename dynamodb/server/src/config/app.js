module.exports = {
  port: process.env.port || 8090,
	virgilCardId: process.env.VIRGIL_APP_ID,
	privateKey: process.env.VIRGIL_APP_KEY,
	privateKeyPassword: process.env.VIRGIL_APP_KEY_PWD,
	appBundleId: process.env.VIRGIL_APP_BUNDLE_ID,
  channelAdminPrivateKey: process.env.APP_CHANNEL_ADMIN_PRIVATE_KEY
};
