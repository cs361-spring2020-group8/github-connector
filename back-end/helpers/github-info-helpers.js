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

function findPreferredLanguage(repositories = []) {
  // Initial object starts out with null: -1 to be used during comparison 
  const languageCount = repositories.reduce(_countLanguageInRepos, { null: -1 });

  return _findTopCountedLanguage(languageCount);
}

function _countLanguageInRepos(total, repo) {
  const topLanguageInRepo = repo['language'];

  if (topLanguageInRepo) {
    total[topLanguageInRepo] = (total[topLanguageInRepo] || 0) + 1;
  }

  return total;
}

function _findTopCountedLanguage(languageCount) {
  return Object.keys(languageCount)
    .reduce(
      (prev, next) => languageCount[next] > languageCount[prev] ? next : prev,
      null
    );
}

module.exports = {
  save,
  findPreferredLanguage,
}