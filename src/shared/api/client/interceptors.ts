import axios from 'axios';

axios.interceptors.request.use((config) => {
  console.log('Исходящий Axios запрос:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });
  return config;
});

