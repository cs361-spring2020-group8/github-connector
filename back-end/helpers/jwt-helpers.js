const jwt = require('jsonwebtoken');
const { rejectAsUnauthorized } = require('./response-helpers');


function createJWT(id) {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET);
}

function getUserIdFromToken(req, res) {
  if (!req.headers["authorization"]) {
    rejectAsUnauthorized(res)
  }

  const bearerHeader = req.headers["authorization"];
  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];
  const token = bearerToken;

  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, data){
    if(err){
      return null;
    } else {
      return data.id;
    }
  })
}

module.exports = {
   createJWT,
   getUserIdFromToken,
}