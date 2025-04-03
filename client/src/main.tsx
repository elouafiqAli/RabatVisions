import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Load required scripts for A-Frame and Three.js
const loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Add a link to the Boxicons stylesheet
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';
document.head.appendChild(link);

// Add font links
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap';
document.head.appendChild(fontLink);

// Add title
const title = document.createElement('title');
title.textContent = 'Discover Rabat - VR Landmarks Experience';
document.head.appendChild(title);

// Load required scripts for A-Frame and Mapbox
Promise.all([
  loadScript('https://unpkg.com/aframe@1.4.2/dist/aframe-master.min.js'),
  loadScript('https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js')
]).then(() => {
  const mapboxCss = document.createElement('link');
  mapboxCss.rel = 'stylesheet';
  mapboxCss.href = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css';
  document.head.appendChild(mapboxCss);
  
  createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}).catch(error => {
  console.error('Failed to load dependencies:', error);
});
