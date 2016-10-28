var Promise = require('bluebird');
var channelsDal = require('./dal');
var users = require('../users');

module.exports = {
	addMember: addMember,
	removeMember: removeMember,
	getMembers: getMembers
};

function addMember (params) {
	return Promise.reject('not implemented');
}

function removeMember (params) {
	return Promise.reject('not implemented');
}

function getMembers (params) {
	return Promise.reject('not implemented');
}

function assertChannel (params) {
	return Promise.reject('not implemented');
}
