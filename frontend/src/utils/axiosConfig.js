import axios from 'axios';

// Create a function to handle token expiration or authorization errors
export const setupAxiosInterceptors = (logout) => {
  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        console.log('Adding auth token to axios request to:', config.url);
        console.log('Token preview:', token.substring(0, 25) + '...');
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('Headers set:', JSON.stringify(config.headers));
      } else {
        console.warn('No authentication token found in localStorage for request to:', config.url);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  axios.interceptors.response.use(
    (response) => {
      console.log('Axios response successful:', response.status, response.config.url);
      return response;
    },
    (error) => {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || '';

      console.error('Axios response error:', status, message);

      if (
        (status === 401 || status === 403) &&
        (message.toLowerCase().includes('token') || message.toLowerCase().includes('unauthorized'))
      ) {
        console.error('Token is likely expired or invalid. Logging out...');
        if (logout) {
          logout();
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('userRole');
          const role = localStorage.getItem('userRole');
          if (role === 'admin') {
            window.location.href = '/admin/login';
          } else {
            window.location.href = '/login';
          }
        }
      }

      return Promise.reject(error);
    }
  );
};

// Create an axios instance with a base URL
export const api = axios.create({
  baseURL: 'http://13.239.65.62:8080/api',
});


// Apply the same interceptors to our instance
export const setupApiInterceptors = (logout) => {
  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        console.log('API request to:', config.url);
        console.log('With auth token:', token.substring(0, 25) + '...');
        config.headers['Authorization'] = `Bearer ${token}`;
        const headersCopy = { ...config.headers };
        if (headersCopy.Authorization) {
          headersCopy.Authorization = headersCopy.Authorization.substring(0, 20) + '...';
        }
        console.log('Request headers:', JSON.stringify(headersCopy));
      } else {
        console.warn('⚠️ No auth token found for API request to:', config.url);
        console.warn('This request will likely fail if authentication is required');
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      console.log('Successful response from:', response.config.url, 'Status:', response.status);
      return response;
    },
    (error) => {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || '';

      console.error('API Error response:', status, message);
      console.error('URL:', error.config?.url);

      if (
        (status === 401 || status === 403) &&
        (message.toLowerCase().includes('token') || message.toLowerCase().includes('unauthorized'))
      ) {
        console.error('Token is likely expired or invalid. Logging out...');
        if (logout) {
          logout();
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('userRole');
          const role = localStorage.getItem('userRole');
          if (role === 'admin') {
            window.location.href = '/admin/login';
          } else {
            window.location.href = '/login';
          }
        }
      }

      return Promise.reject(error);
    }
  );
};