// src/utils/axiosInterceptor.ts
import axios from 'axios';

const axiosInterceptor = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// axiosInterceptor.interceptors.request.use(
//   (config) => {
//     if (config.url?.includes('api.aladhan.com')) {
//       // Modify the config to avoid CORS issues
//       config.headers['x-requested-with'] = 'XMLHttpRequest';
//       config.withCredentials = false;
//       config.headers['Accept'] = 'application/json';
      
//       // Add timestamp to prevent caching
//       const timestamp = new Date().getTime();
//       config.url = `${config.url}${config.url.includes('?') ? '&' : '?'}_t=${timestamp}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInterceptor.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (!navigator.onLine) {
//       console.error('No internet connection');
//     }
    
//     // If the error is CORS-related, try a fallback approach
//     if (error.response && error.response.status === 500) {
//       const originalRequest = error.config;
      
//       // Try the request again without the service worker
//       try {
//         const response = await fetch(originalRequest.url, {
//           method: 'GET',
//           headers: {
//             'Accept': 'application/json'
//           }
//         });
//         const data = await response.json();
//         return { data, status: response.status };
//       } catch (fetchError) {
//         return Promise.reject(fetchError);
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

export default axiosInterceptor;