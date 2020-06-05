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

export async function getUserConnection(userId) {
  // TODO: Backend work
  return new Promise((resolve) => {
    setTimeout(() => resolve({
      "id": 1,
      "created_at": "2020-05-31T22:32:32.985Z",
      "twitter": "faketwitter",
      "phone": "555-555-5555",
      "email": "test12345@gmail.com",
      "github_info": {
        "id": 1,
        "user_id": 1,
        "github_username": "jonabantao",
        "profile_image_url": "https://avatars3.githubusercontent.com/u/30938547?v=4",
        "language": "JavaScript"
      }
    }), 3000);
  });
}