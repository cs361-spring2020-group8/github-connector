const { makeDbQuery, getRowFromDb} = require('./db-helpers')

async function getUserByEmail(email) {
  const query = `SELECT password, id FROM users WHERE email = '${email}'`;
  const userData = await getRowFromDb(query);
  return userData;
}

async function getUserGitHubInfo(userID) {
  const userGitHubInfoQuery = `SELECT * FROM github_info WHERE user_id=${userID}`;
  const userGitHubData = await getRowFromDb(userGitHubInfoQuery);
  return userGitHubData;
}

async function getFullUserProfile(userID) {
  const userQuery = `SELECT * FROM users WHERE id=${userID}`;
  const userData = await getRowFromDb(userQuery);

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
  const createUserQuery = `INSERT INTO users(email, password, created_at) \
VALUES('${email}', '${hashedPassword}', CURRENT_TIMESTAMP) RETURNING *`
  const userData = await getRowFromDb(createUserQuery);
  return userData;
}

async function updateUser(userObject, userID) {
  let queryString = `UPDATE users set `
  for (let [key, value] of Object.entries(userObject)) {
    queryString += `${key} = '${value}' `
  }
  queryString += `where id = ${userID} RETURNING *`

  return await makeDbQuery(queryString);
}

module.exports = {
   getUserByEmail,
   getFullUserProfile,
   createUser,
   updateUser,
}