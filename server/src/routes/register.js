var express = require('express');
var controller = require('app-controller');
var virgil = require('../providers/virgil');
var router = express.Router();

router.post('/register', controller(virgil.registerVirgilCard));

module.exports = router;
