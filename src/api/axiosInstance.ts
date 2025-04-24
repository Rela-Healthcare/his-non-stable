import axios from 'axios';

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    Referer: 'http://localhost:3000/',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
  },
});

export default apiInstance;
