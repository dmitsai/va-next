import axios from 'axios';

export const httpClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_REST_URL,
    validateStatus: status => status >= 200 && status <= 302,
});