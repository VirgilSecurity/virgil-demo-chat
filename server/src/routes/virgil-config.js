var config = require('../config');
var router = require('express').Router();
var jwt = require('express-jwt');

router.get('/virgil-config', jwt({ secret: process.env.JWT_SECRET }), getConfiguration);

function getConfiguration(req, res) {
  res.json({
    virgil_token: config.virgil.accessToken
  });
}

module.exports = router;
