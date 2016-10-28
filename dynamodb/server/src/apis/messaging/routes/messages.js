'use strict';
var router = require('express').Router();
var controller = require('app-controller');
var messages = require('../../../modules/messages');

router.post('/channels/:channel_id/messages', controller(messages.create));
router.get('/channels/:channel_id/messages', controller(messages.findByChannel));

module.exports = router;
