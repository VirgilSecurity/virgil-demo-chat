'use strict';

var Promise = require('bluebird');
var _ = require('lodash');
var uuid = require('uuid');
var log = require('../../providers/log');
var docClient = require('../../providers/dynamodb')('Users');
var dbUtils = require('../../utils/dynamodb')(docClient);

module.exports = {
  create: create,
  delete: deleteUser,
  get: getUser,
  search: search,
  findByName: findByName,
  setIsOnline: setIsOnline
};

function create (props) {
  return new Promise(function (resolve, reject) {
    var item = {
      id: uuid.v4(),
      username: props.username,
      dateCreated: Date.now(),
      virgilCardId: props.virgilCardId
    };

    var params = {
      Item: item
    };

    docClient.put(params, function (err, data) {
      if (err) {
        log.error(err);
        reject(err);
      } else {
        resolve(item);
      }
    })
  });
}

function deleteUser (memberId) {
  return new Promise(function (resolve, reject) {
    var params = {
      Key: {
        id: memberId
      }
    };

    docClient.delete(params, function (err, data) {
      if (err) {
        log.error(err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function search (query) {
  var params = {
    TableName: 'Users',
    IndexName: 'username-index',
    FilterExpression : '#online = :online',
    Select: 'SPECIFIC_ATTRIBUTES',
    ProjectionExpression: '#id, #uname, virgilCardId',
    ExpressionAttributeValues : {
      ':online': true
    },
    ExpressionAttributeNames: {
      '#uname': 'username',
      '#id': 'id',
      '#online': 'isOnline'
    }
  };

  if (_.isString(query) && !_.isEmpty(query)) {
    params.KeyConditionExpression = 'begins_with(#uname, :query)';
    params.ExpressionAttributeValues[':query'] = query;
    return dbUtils.queryTable(params);
  }

  return dbUtils.scanTable(params);
}

function getUser (userId) {
  return new Promise(function (resolve, reject) {
    var params = {
      Key: {
        id: userId
      }
    };

    docClient.get(params, function (err, data) {
      if (err) {
        log.error(err);
        reject(err);
      } else {
        resolve(data.Item);
      }
    });
  });
}

function findByName (username) {
  return new Promise(function (resolve, reject) {
    var params = {
      IndexName: 'username-index',
      KeyConditionExpression: '#username = :uname',
      ExpressionAttributeNames: {
        '#username': 'username'
      },
      ExpressionAttributeValues: {
        ':uname': username
      }
    };

    docClient.query(params, function (err, data) {
      if (err) {
        log.error(err);
        reject(err);
      } else {
        resolve(data.Items);
      }
    })
  });
}

function setIsOnline (userId, isOnline) {
  return new Promise(function (resolve, reject) {
    var params = {
      Key: {
        id: userId
      },
      UpdateExpression: 'set #online = :online',
      ExpressionAttributeNames: { '#online': 'isOnline' },
      ExpressionAttributeValues: { ':online': isOnline }
    };

    docClient.update(params, function  (err, data) {
      if (err) {
        log.log(err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
