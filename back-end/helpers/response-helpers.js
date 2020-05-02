
function rejectAsUnauthorized(res) {
  return res.status(403).send('Unauthorized.');
}

function returnGeneralError(res) {
  return res.status(500).send('An error occurred');
}

function returnErrorWithMessage(res, error) {
  return res.status(500).send('An error occurred');
}

function returnNotFound(res, error = 'Not Found') {
  return res.status(404).send(error);
}

module.exports = {
   rejectAsUnauthorized,
   returnGeneralError,
   returnErrorWithMessage,
   returnNotFound,
}