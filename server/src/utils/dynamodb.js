var Promise = require('bluebird');
var _ = require('lodash');

/**
 * Recursively scan the table to get all items for given params
 * */
module.exports = function (docClient) {
  return {
    scanTable: _.partial(traverseTable, 'scan'),
    queryTable: _.partial(traverseTable, 'query')
  };

  function traverseTable (method, params) {
    return new Promise(function (resolve, reject) {
      var results = [];

      function traverse (lastKey) {
        params.ExclusiveStartKey = lastKey;

        docClient[method](params, function (err, data) {
          if (err) {
            reject(err);
          } else {
            results = results.concat(data.Items);
            if (data.LastEvaluatedKey) {
              traverse(data.LastEvaluatedKey);
            } else {
              resolve(results);
            }
          }
        });
      }

      traverse(null);
    });
  }
};
