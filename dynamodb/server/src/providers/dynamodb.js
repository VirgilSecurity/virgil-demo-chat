'use strict';

var aws = require('aws-sdk');
var config = require('../config');

aws.config.update(config.db);

var dynamodb = require('aws-dynamodb')(new aws.DynamoDB());

module.exports = dynamodb;

// function makeTableClient (tableName) {
//
// 	return {
// 		'create': create,
// 		'get': getItem,
// 		'delete': deleteItem
// 	};
//
// 	function create (item) {
// 		var params = {
// 			TableName: tableName,
// 			Item: item
// 		};
//
// 		return docClient.put(params).promise();
// 	}
//
// 	function getItem (id) {
// 		var params = {
// 			TableName: tableName,
// 			Key: {
// 				id: id
// 			}
// 		};
//
// 		return docClient.get(params).promise();
// 	}
//
// 	function deleteItem (id) {
// 		var params = {
// 			TableName: tableName,
// 			Key: {
// 				id: id
// 			}
// 		};
//
// 		return docClient.delete(params).promise();
// 	}
//
// 	function find(props) {
// 		var params = {
// 			TableName: tableName,
//
// 		}
// 	}
// }

// module.exports = {
// 	channels: makeTableClient('Channels'),
// 	messages: makeTableClient('Messages')
// };
