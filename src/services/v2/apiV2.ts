import axios from 'axios';

const apiV2 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_V2_URL || 'http://localhost:8090',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiV2;
