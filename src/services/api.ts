import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

/*
  * Checks every request from the app to the API before it is sent;
  * if a token is available, it sets the header with the "Authorization: Bearer <token>".
*/
api.interceptors.request.use(
  (config) => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && storedToken !== "undefined") {
      try {
        const tokenObj = JSON.parse(storedToken);
        if (config.headers) {
          config.headers['Authorization'] = `Bearer ${tokenObj.AccessToken}`;
        }
      } catch (error) {
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/*  
  * Response interceptor: Checks the server response and, if it finds "Invalid or expired token",
  * automatically retrieves the refreshToken and calls the refreshToken endpoint responsible for 
  * returning a new valid token. It then re-sends the failed request, making the session expiration 
  * completely imperceptible to the user.
*/
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.data &&
      error.response.data.msg === 'Invalid or expired token' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (
        storedToken && storedToken !== "undefined" &&
        storedUser && storedUser !== "undefined"
      ) {
        try {
          const tokenObj = JSON.parse(storedToken);
          const refreshToken = tokenObj.RefreshToken;
          const userObj = JSON.parse(storedUser);
          const username = userObj.username;

          const refreshResponse = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/refresh-token`,
            { username, refreshToken }
          );

          if (refreshResponse && refreshResponse.data && refreshResponse.data.AccessToken) {
            const newTokenObj = refreshResponse.data;
            localStorage.setItem('token', JSON.stringify(newTokenObj));
            api.defaults.headers.common['Authorization'] = `Bearer ${newTokenObj.AccessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newTokenObj.AccessToken}`;
            return api(originalRequest);
          } else {
            return Promise.reject(refreshResponse.data);
          }
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
