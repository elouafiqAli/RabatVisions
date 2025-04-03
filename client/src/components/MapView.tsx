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
    
    // Get Mapbox token from environment variable
    const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    
    // Set access token
    mapboxgl.accessToken = mapboxToken || '';
    
    // Log token availability for debugging (not the actual token)
    console.log('Mapbox token available:', !!mapboxToken);
    
    // Create the map centered on Rabat
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-6.8326, 34.0209], // Rabat coordinates
      zoom: 12.5,
      pitch: 40, // Add some tilt for a more immersive view
      bearing: 20 // Slight rotation for better perspective
    });
    
    // Add navigation controls (zoom in/out, rotation)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
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
            <div class="h-8 w-8 ${landmark.id === selectedLandmark?.id ? 'bg-accent scale-125' : 'bg-primary'} 
              rounded-full flex items-center justify-center shadow-lg transform 
              group-hover:scale-110 transition-all duration-300 ease-in-out
              ${landmark.id === selectedLandmark?.id ? 'ring-4 ring-accent/30' : ''}">
              <i class="bx bxs-map-pin text-white text-lg"></i>
            </div>
            <div class="absolute bottom-full mb-2 bg-white px-3 py-1 rounded-lg shadow-md opacity-0 
              group-hover:opacity-100 transition-opacity duration-200">
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
