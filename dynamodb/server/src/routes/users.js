'use strict';

var _ = require('lodash');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var requireAuth = require('express-jwt');
var virgil = require('../providers/virgil');
var users = require('../modules/users');

router.post('/users/login', login);
router.post('/users/register', register);
router.get('/users/search', requireAuth({ secret: process.env.JWT_SECRET }), search);

function register (req, res) {
  virgil.createVirgilCard(req.body.card_request)
    .then(function (userCard) {
      var userInfo = {
        virgilCardId: userCard.id,
        username: userCard.identity
      };

      return users.create(userInfo);
    })
    .then(function (user) {
      var token = jwt.sign(transformResponse(user)  , process.env.JWT_SECRET);
      res.json({ token: token });
    })
    .catch(function (err) {
      res.status(400).json({ error: err.message });
    });
}

function login (req, res) {
  var username = req.body.username;
  users.findByName(username)
    .then(function (found) {
      if (!found || found.length === 0) {
        res.status(401).json({ error: 'Username is incorrect.' });
      } else {
        var user = found[found.length - 1];
        var token = jwt.sign(transformResponse(user), process.env.JWT_SECRET);
        res.json({ token: token });
      }
    })
    .catch(function (err) {
      res.status(400).json({ error: err.message });
    });
}

function search (req, res) {
  var query = req.query.query;
  users.search(query)
    .then(function (found) {
      res.json(found.map(transformResponse));
    })
    .catch(function (err) {
      res.status(400).json({ error: err.message });
    });
}

function transformResponse (user) {
  return _.pick(user, ['id', 'username', 'virgilCardId']);
}

module.exports = router;

