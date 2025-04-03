import { useEffect, useRef, useState } from "react";
import { Landmark } from "@shared/schema";
import LandmarkInfoCard from "./LandmarkInfoCard";

interface MapViewProps {
  landmarks: Landmark[];
  selectedLandmark: Landmark | null;
  onLandmarkClick: (slug: string) => void;
  onImmerseClick: () => void;
}

export default function MapView({ 
  landmarks, 
  selectedLandmark, 
  onLandmarkClick,
  onImmerseClick
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<{[key: string]: any}>({});
  
  // Initialize map
  useEffect(() => {
    if (!window.mapboxgl || !mapContainerRef.current) return;
    
    // Mapbox token - in production this should be in env var
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
    
    // Create the map centered on Rabat
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-6.8326, 34.0209], // Rabat coordinates
      zoom: 12
    });
    
    // Save map instance to ref
    mapRef.current = map;
    
    // Clean up on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);
  
  // Add markers for landmarks
  useEffect(() => {
    if (!mapRef.current || !landmarks.length) return;
    
    // Clear existing markers
    Object.values(markersRef.current).forEach((marker: any) => {
      marker.remove();
    });
    markersRef.current = {};
    
    // Add markers for each landmark
    landmarks.forEach((landmark) => {
      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker-container';
      
      // Create marker
      const markerHTML = `
        <div class="map-marker cursor-pointer group">
          <div class="flex flex-col items-center">
            <div class="h-6 w-6 bg-primary rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <i class="bx bxs-map-pin text-white"></i>
            </div>
            <div class="absolute bottom-full mb-2 bg-white px-3 py-1 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="text-sm font-medium whitespace-nowrap">${landmark.name}</span>
            </div>
          </div>
        </div>
      `;
      
      el.innerHTML = markerHTML;
      el.addEventListener('click', () => {
        onLandmarkClick(landmark.slug);
      });
      
      // Add marker to map
      const marker = new mapboxgl.Marker(el)
        .setLngLat([parseFloat(landmark.longitude), parseFloat(landmark.latitude)])
        .addTo(mapRef.current);
      
      // Save marker reference
      markersRef.current[landmark.slug] = marker;
    });
  }, [landmarks, onLandmarkClick]);
  
  // Center map on selected landmark
  useEffect(() => {
    if (!mapRef.current || !selectedLandmark) return;
    
    mapRef.current.flyTo({
      center: [parseFloat(selectedLandmark.longitude), parseFloat(selectedLandmark.latitude)],
      zoom: 15,
      essential: true
    });
  }, [selectedLandmark]);
  
  return (
    <>
      <div id="map-container" ref={mapContainerRef} className="h-full w-full bg-gray-100"></div>
      
      {selectedLandmark && (
        <LandmarkInfoCard 
          landmark={selectedLandmark} 
          onImmerseClick={onImmerseClick} 
        />
      )}
    </>
  );
}
