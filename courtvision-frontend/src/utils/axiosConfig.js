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
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axios.interceptors.response.use(
    (response) => {
      console.log('Axios response successful:', response.status, response.config.url);
      return response;
    },
    (error) => {
      // Handle 401 Unauthorized or 403 Forbidden responses
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.error('Authentication error:', error.response.status, error.response.data);
        console.error('Request URL was:', error.config.url);
        console.error('Request method was:', error.config.method);
        console.error('Request headers were:', JSON.stringify(error.config.headers));
        
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
        console.log('API request to:', config.url);
        console.log('With auth token:', token.substring(0, 25) + '...');
        config.headers['Authorization'] = `Bearer ${token}`;
        
        // Log the full headers for debugging
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
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      console.log('Successful response from:', response.config.url, 'Status:', response.status);
      return response;
    },
    (error) => {
      console.error('API Error response:', error.message);
      
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        console.error('URL:', error.config.url);
        
        // Handle 401 Unauthorized or 403 Forbidden responses
        if (error.response.status === 401 || error.response.status === 403) {
          console.error('Auth failure - token may be invalid or expired');
          console.error('Request headers were:', JSON.stringify(error.config.headers));
          
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
      }
      return Promise.reject(error);
    }
  );
}; 