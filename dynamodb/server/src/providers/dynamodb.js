'use strict';

var aws = require('aws-sdk');
var config = require('../config');

aws.config.update(config.db);

module.exports = new aws.DynamoDB.DocumentClient();