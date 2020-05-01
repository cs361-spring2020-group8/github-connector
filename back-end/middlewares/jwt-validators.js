const { getUserIdFromToken } = require('../helpers/jwt-helpers');
const { rejectAsUnauthorized } = require('../helpers/response-helpers');

function validateSelfJWT (req, res, next) {
  if (!getUserIdFromToken(req, res)) {
    return rejectAsUnauthorized(res);
  }

  next();
}

module.exports = {
  validateSelfJWT,
};