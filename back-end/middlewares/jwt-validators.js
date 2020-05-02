const { getUserIdFromToken } = require('../helpers/jwt-helpers');
const { rejectAsUnauthorized } = require('../helpers/response-helpers');

async function validateSelfJWT (req, res, next) {
  const idFromToken =  await getUserIdFromToken(req, res);
  const userId = Number.parseInt(req.params.id, 10);
  
  if (!idFromToken || idFromToken !== userId) {
    return rejectAsUnauthorized(res);
  }

  next();
}

module.exports = {
  validateSelfJWT,
};