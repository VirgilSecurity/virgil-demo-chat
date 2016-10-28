var Promise = require('bluebird');
var _ = require('lodash');
var dynamodb = require('../../providers/dynamodb');

module.exports = {
	addMember: _.noop,
	query: _.noop,
	create: _.noop,
	findByName: _.noop
};
