var log = require('../providers/log');

module.exports = function handleError(res, error, message, code) {
  log.error(error);
  res.status(code || 500).json({ "error": message });
};
