var Promise = require('bluebird');
var _ = require('lodash');
var uuid = require('uuid');
var docClient = require('../../providers/dynamodb');

module.exports = {
  create: function create (msg) {
    return new Promise(function (resolve, reject) {
      var item = {
        id: uuid.v4(),
        channelName: msg.channelName,
        dateCreated: Date.now(),
        author: msg.author,
        body: new Buffer(msg.body, 'base64')
      };

      var params = {
        TableName: 'Messages',
        Item: item
      };

      docClient.put(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          var result = _.assign({}, item, msg); // make sure body is sent back as base64 string
          resolve(result);
        }
      });
    });
  },

  queryByChannel: function queryByChannel (channelName) {
    return new Promise(function (resolve, reject) {
      var params = {
        TableName: 'Messages',
        IndexName: 'channelName-dateCreated-index',
        KeyConditionExpression: 'channelName = :chname',
        ExpressionAttributeValues: {
          ':chname': channelName
        },
        Select: 'ALL_ATTRIBUTES',
        Limit: 50,
        ScanIndexForward: false // descending order
      };

      docClient.query(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data.Items);
          // TODO handle the LastEveluatedKey != null
          // which means that not all matching items have been returned
        }
      });
    });
  }
};

