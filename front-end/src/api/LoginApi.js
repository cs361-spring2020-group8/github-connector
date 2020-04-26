import axios from 'axios';

export async function login(email, password) {
    return axios.post('http://localhost:3000/users/login', {
        email,
        password
    });
}