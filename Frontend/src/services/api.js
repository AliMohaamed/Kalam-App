import axios from 'axios';

// Create a new axios instance with a base URL
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend API base URL
});

// --- Axios Interceptor ---
// This function will run before every single request is sent.
apiClient.interceptors.request.use(
  (config) => {
    // 1. Get the token from localStorage
    const token = localStorage.getItem('kalam_token');

    // 2. If the token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default apiClient;