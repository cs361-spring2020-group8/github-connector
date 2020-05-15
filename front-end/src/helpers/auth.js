import jwt_decode from 'jwt-decode'

export const isLoggedIn = () => {
    return localStorage.getItem('access_token') !== null;
}

export const getUserIdFromJWT = () => {
    const token = localStorage.getItem('access_token');
    const decoded = jwt_decode(token);

    return decoded.id;
}