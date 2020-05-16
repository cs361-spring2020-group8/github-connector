const { makeDbQuery, queryWithParameters } = require('./db-helpers')

async function getUserByEmail(email) {
  const query = 'SELECT password, id FROM users WHERE email = $1';
  const userData = await queryWithParameters(
    query,
    [email]
  );
  return userData;
}

async function getUserGitHubInfo(userID) {
  const query = 'SELECT * FROM github_info WHERE user_id = $1';
  const userGitHubData = await queryWithParameters(
    query,
    [userID]
  );
  return userGitHubData;
}

async function getFullUserProfile(userID) {
  const query = 'SELECT * FROM users WHERE id = $1';
  const userData = await queryWithParameters(
    query,
    [userID]
  );

  // exit early if user isn't in the database
  if(!userData) {
    return null;
  }

  //omit password from API responses
  delete userData.password;

  const userGitHubData = await getUserGitHubInfo(userID);
  userData.github_info = userGitHubData ? userGitHubData : null;
  return userData;
}

async function createUser(email, hashedPassword) {
  const query = 'INSERT INTO users ' +
    '(email, password, created_at) ' +
    'VALUES ($1, $2, CURRENT_TIMESTAMP) ' +
    'RETURNING *';

  const userData = await queryWithParameters(
    query,
    [email, hashedPassword]
  );

  return userData;
}

async function updateUser(userObject, userID) {
  // TODO: use query parameters in update request
  let queryString = `UPDATE users set `
  for (let [key, value] of Object.entries(userObject)) {
    queryString += `${key} = '${value}', `
  }
  queryString += `where id = ${userID} RETURNING *`

  // remove final comma from last key/value pair
  queryString = queryString.replace(', where', ' where');

  return await makeDbQuery(queryString);
}

module.exports = {
   getUserByEmail,
   getFullUserProfile,
   createUser,
   updateUser,
   getUserGitHubInfo,
}