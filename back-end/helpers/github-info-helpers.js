const { queryWithParameters } = require('./db-helpers');

async function save(userId, gitHubUsername, imageURL, preferredLanguage) {
  const query = 'INSERT INTO github_info ' +
  '(user_id, github_username, profile_image_url, language) ' +
  'VALUES ($1, $2, $3, $4) ' +
  'RETURNING github_username, profile_image_url, language';

  return queryWithParameters(
    query,
    [userId, gitHubUsername, imageURL, preferredLanguage]
  );
}

module.exports = {
  save
}