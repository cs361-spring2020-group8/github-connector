const axios = require('axios');

const GITHUB_API_URL = 'https://api.github.com';

async function getUserProfile(username) {
  try {
    const response = await axios.get(
      `/users/${username}`,
      { baseURL: GITHUB_API_URL }
    );

    return response.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return null;
    }

    throw err;
  }
}

async function getUserRepositories(username) {
  const response = await axios.get(
    `/users/${username}/repos`,
    { baseURL: GITHUB_API_URL }
  );

  return response.data;
}

module.exports = {
  getUserProfile,
  getUserRepositories,
};
