import axios from 'axios';

export async function signup(email, password) {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const payload = {
    email,
    password
  };

  return axios.post('http://localhost:3000/users', payload, config);
}