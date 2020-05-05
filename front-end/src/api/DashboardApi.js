import axios from 'axios';

export async function pullUserInfo(userID, token) {
  const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://githubconnector.herokuapp.com';
  return axios.get(`${url}/users/${userID}`,{ headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '  + token }
  });
}

/* Couldn't get all of them to be updated at once so I parsed them out individually

export async function updateProfileInformation(userID, token, email, twitter, phone) {
  const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://githubconnector.herokuapp.com';
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
}*/
export async function updateEmailInformation(userID, token, email) {
  const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://githubconnector.herokuapp.com';
  const config = {
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '  + token }
  };
  const payload = {
    'email':email
  };
  return axios.put(`${url}/users/${userID}`, payload, config);
}
export async function updateTwitterInformation(userID, token, twitter) {
  const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://githubconnector.herokuapp.com';
  const config = {
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '  + token }
  };
  const payload = {
    'twitter': twitter
  };
  return axios.put(`${url}/users/${userID}`, payload, config);
}
export async function updatePhoneInformation(userID, token, phone) {
  const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://githubconnector.herokuapp.com';
  const config = {
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '  + token }
  };
  const payload = {
    'phone': phone
  };
  return axios.put(`${url}/users/${userID}`, payload, config);
}