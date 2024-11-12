/* eslint-disable @typescript-eslint/ban-ts-comment */
// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import { registerServiceWorker } from './serviceWorkerRegistration';


createRoot(document.getElementById('root')!).render(
  // <StrictMode >
    <App />
  // </StrictMode>,
)

// // src/main.tsx or App.tsx
// const registerSW = async () => {
//   if ('serviceWorker' in navigator) {
//     try {
//       // Unregister any existing service workers
//       const registrations = await navigator.serviceWorker.getRegistrations();
//       for (let registration of registrations) {
//         await registration.unregister();
//       }

//       // Register new service worker
//       const registration = await navigator.serviceWorker.register('/sw.js', {
//         scope: '/',
//       });

//       // Wait for the service worker to be active
//       if (registration.installing) {
//         registration.installing.addEventListener('statechange', (e) => {
//           //@ts-ignore
//           if (e.target.state === 'activated') {
//             console.log('Service worker is active');
//           }
//         });
//       }

//       // Function to clear the service worker cache
//       //@ts-ignore
//       window.clearSWCache = () => {
//         if (navigator.serviceWorker.controller) {
//           navigator.serviceWorker.controller.postMessage({
//             type: 'CLEAR_CACHE'
//           });
//         }
//       };

//     } catch (error) {
//       console.error('SW registration failed:', error);
//     }
//   }
// };

// registerSW();