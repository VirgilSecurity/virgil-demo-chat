'use strict';

var aws = require('aws-sdk');
var config = require('../config/index');

aws.config.update(config.db);

module.exports = function createClient (tableName) {
  return new aws.DynamoDB.DocumentClient({
    params: {
      TableName: tableName
    }
  });
};
