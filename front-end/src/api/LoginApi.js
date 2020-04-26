import axios from 'axios';

export async function login(email, password) {
    // TODO: Create API client and move everything except the final call to API to this client
    const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://githubconnector.herokuapp.com';
    return axios.post(`${url}/users/login`, {
        email,
        password
    });
}