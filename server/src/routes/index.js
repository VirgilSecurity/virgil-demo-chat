'use strict';
var router = require('express').Router();

router.use(require('./channels'));
router.use(require('./messages'));
router.use(require('./users'));
router.use(require('./virgil-config'));

module.exports = router;
