'use strict';
var router = require('express').Router();

router.use(require('./messages'));
router.use(require('./virgil-cards'));
router.use(require('./virgil-config'));

module.exports = router;
