import axios from 'axios';
import { getBearerToken } from '../helpers/auth';

const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://githubconnector.herokuapp.com';

function getAxiosConfig() {
  return {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getBearerToken()}`,
    },
    baseURL,
  }
}

export async function fetchConnections(userId) {
  const response = await axios.get(`users/${userId}/connections`, getAxiosConfig());

  return response.data;
}

export async function getUserConnection(userId) {
  const response = await axios.get(`users/${userId}`, getAxiosConfig());

  return response.data[0];
}