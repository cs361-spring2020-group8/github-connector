import axios from 'axios';

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://githubconnector.herokuapp.com';

export async function pullUserInfo(userID, token) {

  return axios.get(`${url}/users/${userID}`,{ headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '  + token }
  });
}

//Attempts to link Github Account
export async function linkGithubAccount(userID, token, github_username) {
  const config = {
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '  + token }
  };
  const payload = {
    'github_username': github_username
  };
  return axios.put(`${url}/users/${userID}/github_info`, payload, config);
}

// Updates Profile Information
export async function updateProfileInfo(userID, token, email, twitter, phone) {
  const config = {
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '  + token }
  };
  const payload = {
    'email':email,
    'twitter': twitter,
    'phone': phone
  };
  return axios.put(`${url}/users/${userID}`, payload, config);
}
