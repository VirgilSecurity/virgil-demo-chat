'use strict';

var Promise = require('bluebird');
var _ = require('lodash');
var uuid = require('uuid');
var docClient = require('../../providers/dynamodb')('MessagesV2');
var dbUtils = require('../../utils/dynamodb')(docClient);

module.exports = {
  create: create,
  queryByChannel: queryByChannel
};


function queryByChannel (channelId) {
  var params = {
    IndexName: 'channelId-dateCreated-index',
    KeyConditionExpression: 'channelId = :cid',
    ExpressionAttributeValues: {
      ':cid': channelId
    },
    Select: 'ALL_ATTRIBUTES',
    Limit: 50,
    ScanIndexForward: false // descending order
  };

  return dbUtils.queryTable(params);
}

function create (msg) {
  return new Promise(function (resolve, reject) {
    var item = {
      id: uuid.v4(),
      channelId: msg.channelId,
      dateCreated: Date.now(),
      author: msg.author,
      body: new Buffer(msg.body, 'base64')
    };

    var params = {
      Item: item
    };

    docClient.put(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        var result = _.assign({}, item, { body: item.body.toString('base64')});
        resolve(result);
      }
    });
  });
}
