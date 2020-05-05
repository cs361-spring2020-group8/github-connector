import axios from 'axios';

export async function pullUserInfo(userID, token) {
  const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://githubconnector.herokuapp.com';
  return axios.get(`${url}/users/${userID}`,{ headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '  + token }
  });
}

