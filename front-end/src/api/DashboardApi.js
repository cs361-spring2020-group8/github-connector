import axios from 'axios';

export async function pullUserInfo(userID, token) {
  const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://githubconnector.herokuapp.com';
  return axios.get(`${url}/users/${userID}`,{ headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '  + token }
  });
}

/*

THIS HAS NOT BEEN TESTED

export async function updateUserInfo(userID, token, email, twitter, phone) {
  const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://githubconnector.herokuapp.com';
  const config = {
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '  + token }
  };
  const payload = {
    'email': email,
    'twitter': twitter,
    'phone': phone
  };

  return axios.put(`${url}/users/${userID}`, payload, config);
}
*/

