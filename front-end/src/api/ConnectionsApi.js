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
  // TODO: Backend work
  return new Promise((resolve) => {
    setTimeout(() => resolve([{
      id: '1',
      github_info: {
        profile_image_url: 'https://avatars3.githubusercontent.com/u/30938547?v=4',
        github_username: 'jonabantao',
      }
    }]), 3000); 
  });
}