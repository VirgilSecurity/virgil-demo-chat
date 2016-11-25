'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var uuid = require('uuid');
var log = require('../../providers/log');
var docClient = require('../../providers/dynamodb')('ChannelsV2');
var dbUtils = require('../../utils/dynamodb')(docClient);

/**
 * Create new channel
 * */
function create (props) {
  return new Promise(function (resolve, reject) {
    var item = _.assign({}, props, {
      id: uuid.v4(),
      dateCreated: Date.now(),
      members: docClient.createSet([ props.ownerId ]),
      isPublic: false
    });

    var params = {
      Item: item
    };

    return docClient.put(params, function (err, data) {
      if (err) {
        log.log(err);
        reject(err);
      } else {
        resolve(item);
      }
    });
  });
}

/**
 * Add new entry to the list of channel members
 * */
function addMembers (channelId, userIds) {
  return new Promise(function (resolve, reject) {
    userIds = Array.isArray(userIds) ? userIds : [userIds];

    var params = {
      Key: {
        id: channelId
      },
      UpdateExpression: 'add #members :member',
      ExpressionAttributeNames: { '#members': 'members' },
      ExpressionAttributeValues: { ':member': docClient.createSet(userIds) }
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

/**
 * Get list of channels where the given user is a member
 * */
function queryByMember (userId) {
  var params = {
    Select: 'ALL_ATTRIBUTES',
    FilterExpression: '#isPublic = :public or contains(#members, :uid)',
    ExpressionAttributeNames: {
      '#isPublic': 'isPublic',
      '#members': 'members'
    },
    ExpressionAttributeValues: {
      ':public': true,
      ':uid': userId
    }
  };

  return dbUtils.scanTable(params);
}

/**
 * Get channel by Id
 * */
function getChannel (channelId) {
  return new Promise(function (resolve, reject) {
    var params = {
      Key: {
        id: channelId
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

/**
 * Check whether the user with given Id is channel member
 * */
function isChannelMember (channel, userId) {
  return channel.isPublic || channel.members.values.indexOf(userId) > -1;
}

module.exports = {
  create: create,
  get: getChannel,
  addMembers: addMembers,
  queryByMember: queryByMember,
  isChannelMember: isChannelMember
};
