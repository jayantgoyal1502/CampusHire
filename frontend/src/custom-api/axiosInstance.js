import axios from 'axios';

const customApi = axios.create({
  baseURL: 'http://localhost:5001/api',
});

// Axios interceptor
customApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Trigger session expired handling via context or an event
      const event = new CustomEvent('session-expired');
      window.dispatchEvent(event);
    }
    return Promise.reject(error);
  }
);

export default customApi;
