import jwt_decode from 'jwt-decode'

export const getBearerToken = () => {
    return localStorage.getItem('access_token');
}

export const isLoggedIn = () => {
    return getBearerToken() !== null;
}

export const getUserIdFromJWT = () => {
    const token = getBearerToken();
    const decoded = jwt_decode(token);

    return decoded.id;
}