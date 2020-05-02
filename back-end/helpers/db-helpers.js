// helper functions to query db and return standardized API responses
const { pool } = require('../config');
const { returnErrorWithMessage, returnGeneralError} = require('./response-helpers');

async function makeDbQuery(queryString) {
  try {
    return await pool.query(queryString)
  } catch (e) {
    throw e
  }
};

async function getRowFromDb(queryString) {
  let results;
  try {
    results = await pool.query(queryString)
  } catch (e) {
    throw e
  }
  return results.rows[0];
};

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
};

module.exports = {
   makeDbQuery,
   getRowFromDb,
   getUserByEmail,
   getFullUserProfile,
}