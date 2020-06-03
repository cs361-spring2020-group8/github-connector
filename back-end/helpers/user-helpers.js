const { makeDbQuery, queryWithParameters, queryWithParametersForMultipleRows } = require('./db-helpers')
const logger = require('../helpers/logger');

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

async function getUserLanguage(userID) {
  const query = 'SELECT language FROM github_info WHERE user_id = $1';
  const userProfile = await queryWithParameters(
      query,
      [userID]
  );
  if(userProfile === undefined){
    return false;
  }else {
    return userProfile.language;
  }
}

async function getRecommendations(userID) {
  const languageToMatch = await getUserLanguage(userID);
  if(languageToMatch) {
    // user_id clause so they are not recommended to connect with themself.
    // ordered randomly so that same recommendations don't happen every time.
    const query = 'SELECT id, email FROM users INNER JOIN' +
        '(SELECT user_id FROM github_info ' +
        'WHERE language=$1 AND user_id!=$2 ' +
        'ORDER BY RANDOM() ' +
        'LIMIT 5) AS matches ON ' +
        'users.id=matches.user_id';

    const listOfMatches = await queryWithParametersForMultipleRows(
        query,
        [languageToMatch, userID]
    );
    return listOfMatches;
  }else{
    return false;
  }
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

async function getFullConnectionProfile(requestedID, userID) {
  const query = 'SELECT users.* FROM users ' +
    'INNER JOIN connections ON ' +
    'users.id = connections.user1_id OR users.id = connections.user2_id ' +
    'WHERE users.id = $1 ' +
    'AND ((connections.user1_id = $1 AND connections.user2_id = $2) ' +
    'OR (connections.user1_id = $2 AND connections.user2_id = $1))' +
    'AND connections.connection_accepted = true'
  ;

  const connectionData = await queryWithParameters(query, [requestedID, userID]);

  if (!connectionData) {
    logger.warn(`Unable to find user. Ensure that a valid connection is made. User ID: ${userID}, Requested ID: ${requestedID}`)
    return null;
  }

  logger.info(`Retrieved data for id ${requestedID}`)

  delete connectionData.password;
  const connectionGithubData = await getUserGitHubInfo(requestedID);
  if (!connectionGithubData) {
    logger.warn(`No GitHub info found for the id requestedID`)
    connectionData.github_info = null;
  } else {
    connectionData.github_info = connectionGithubData;
  }

  return connectionData;
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
   getRecommendations,
   createUser,
   updateUser,
   getUserGitHubInfo,
   getFullConnectionProfile,
};