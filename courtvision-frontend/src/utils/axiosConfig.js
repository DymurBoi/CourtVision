import axios from 'axios';

// Create a function to handle token expiration or authorization errors
export const setupAxiosInterceptors = (logout) => {
  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle 401 Unauthorized or 403 Forbidden responses
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('Authentication error:', error.response.data);
        
        // Logout user and redirect to login
        if (logout) {
          logout();
        } else {
          // If logout function is not available, clear localStorage manually
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('userRole');
          
          // Redirect to login based on user role
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
  baseURL: 'http://localhost:8080/api',
});

// Apply the same interceptors to our instance
export const setupApiInterceptors = (logout) => {
  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle 401 Unauthorized or 403 Forbidden responses
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Logout user
        if (logout) {
          logout();
        } else {
          // If logout function is not available, clear localStorage manually
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('userRole');
          
          // Redirect to login
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