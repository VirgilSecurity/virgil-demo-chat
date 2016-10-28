var Promise = require('bluebird');
var uuid = require('uuid');
var dynamodb = require('../../providers/dynamodb');

module.exports = {
	create: function create (params) {
		return new Promise(function (resolve, reject) {
			params.id = uuid.v4();
			params.created_at = Date.now();

			console.log(params);

			dynamodb
				.table('Messages')
				.insert(params, function (err, data) {
					if (err) {
						reject(err);
						return;
					}

					resolve(data);
				});
		});
	},

	findByChannel: function findByChannel (params) {
		return new Promise(function (resolve, reject) {
			dynamodb
				.table('Messages')
				.select(dynamodb.ALL)
				.where('channel_id').eq(params.channel_id)
				.order_by('ChannelIdIndex')
				.query(function (err, data) {
					if (err) {
						reject(err);
						return;
					}

					resolve(data);
				});
		});
	}
};
