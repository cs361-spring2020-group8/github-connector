const { makeDbQuery, queryWithParameters, queryWithParametersForMultipleRows } = require('./db-helpers')

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

async function getPartialConnections(userID, maxNumber) {
  const query = 'SELECT user1_id as id, github_username FROM connections INNER JOIN ' +
      'github_info ON connections.user1_id=github_info.user_id ' +
      'WHERE user2_id=$1 ' +
      'AND recommendation_accepted=true ' +
      'AND connection_accepted IS NULL' +
      ' LIMIT $2';

    const partialConnections = await queryWithParametersForMultipleRows(
        query,
        [userID, maxNumber]
    );
    return partialConnections;
}

async function getNewRecommendations(userID, maxNumber) {
  const languageToMatch = await getUserLanguage(userID);

  // handle users who have a github profile, but do not have
  // a specified language
  if(languageToMatch === null) {
    const query = 'SELECT users.id as id, github_username FROM users INNER JOIN ' +
        'github_info ON github_info.user_id=users.id ' +
        'WHERE language is NULL AND user_id!=$1 ' +
        'ORDER BY RANDOM() ' +
        'LIMIT $2';

    const listOfMatches = await queryWithParametersForMultipleRows(
        query,
        [userID, maxNumber]
    );
    return listOfMatches;
  } else if(languageToMatch) {
    //user_id clause so they are not recommended to connect with themself.
    //ordered randomly so that same recommendations don't happen every time.
    const query = 'SELECT users.id as id, github_username FROM users INNER JOIN ' +
        'github_info ON github_info.user_id=users.id ' +
        'WHERE language=$1 AND user_id!=$2 ' +
        'ORDER BY RANDOM() ' +
        'LIMIT $3';

    const listOfMatches = await queryWithParametersForMultipleRows(
        query,
        [languageToMatch, userID, maxNumber]
    );
    return listOfMatches;
  }else{
    return false;
  }
}

async function connectionInDb(user1, user2) {
  const query = 'SELECT * FROM connections ' +
      'WHERE user1_id=$1 and user2_id=$2 ' +
      'OR user2_id=$1 and user1_id=$2'

    const inDatabase = await queryWithParameters(
        query,
        [user1, user2]
    );

    return inDatabase;
}

// reference; https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function getRecommendations(userID, maxNumber) {
  let recommendations = await getPartialConnections(userID, maxNumber);
  let recommendationIds = recommendations.map(rec => rec.id)

  // prevent an infinite loop of retries
  const RETRY_ATTEMPTS = 3
  let attempts = 0

  while(recommendations.length < maxNumber && attempts < RETRY_ATTEMPTS) {
    const newRecommendations = await getNewRecommendations(userID, maxNumber);

    if(newRecommendations) {
      await asyncForEach(newRecommendations, async (rec) => {
        const inDb = await connectionInDb(userID, rec.id)
        if(!inDb && !recommendationIds.includes(rec.id)) {
          recommendationIds.push(rec.id)
          recommendations.push(rec)
        }
      })
    }

    attempts += 1;
  }

  if(recommendations.length > maxNumber){
    return recommendations.slice(0, maxNumber)
  }
  return recommendations
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

async function hasPendingConnection(selfID, matchID) {
  const query = 'SELECT * FROM connections ' +
      'WHERE user1_id=$1 and user2_id=$2 ' +
      'AND recommendation_accepted = TRUE'

    const inDatabase = await queryWithParameters(
        query,
        [matchID, selfID]
    );

    return inDatabase;
}

async function updateConnectionStatus(selfID, matchID, status) {
  const pendingConnection = await hasPendingConnection(selfID, matchID)
  if (pendingConnection) {
    // if the matching user has already accepted
    // record the final connection status
    const query = 'UPDATE connections SET ' +
      'connection_accepted = $3 ' +
      'WHERE user1_id=$1 and user2_id=$2 '

    const connectionStatus = await queryWithParameters(
      query,
      [matchID, selfID, status]
    );
    return connectionStatus;
  } else {
    // if this match has not been recorded yet,
    // track this user's acceptance/rejection of the recommendation
    const query = 'INSERT INTO connections ' +
      '(user1_id, user2_id, recommendation_accepted) ' +
      'VALUES ($1, $2, $3) ' +
      'RETURNING *';
    const connectionStatus = await queryWithParameters(
      query,
      [selfID, matchID, status]
    );
    return connectionStatus;
  }
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
   updateConnectionStatus,
}