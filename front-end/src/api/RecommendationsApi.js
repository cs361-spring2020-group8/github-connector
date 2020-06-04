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

export async function fetchRecommendedUsers(userId) {
  const response = await axios.get(`/users/${userId}/recommendations`, getAxiosConfig());

  return response.data;
}

export async function acceptOrRejectRecommendation(selfId, matchId, accept) {
  const payload = {
    'id': matchId,
    'accepted': accept,
  };
  return await axios.put(`/users/${selfId}/recommendations`, payload, getAxiosConfig());
}