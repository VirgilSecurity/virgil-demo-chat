var config = require('../config');
var router = require('express').Router();
var controller = require('app-controller');

router.get('/virgil-config', controller(getToken));

function getToken(params) {
    return { 
        virgil_token: config.virgil.accessToken,
        virgil_app_bundle_id: config.virgil.appBundleId,
        virgil_urls: config.virgil.options
    };
}

module.exports = router;