import { useEffect, useRef, useState } from "react";
import { Landmark } from "@shared/schema";

interface VRViewProps {
  landmark: Landmark;
  onExitVR: () => void;
}

// Map of panoramic images for each landmark
const landmarkPanoramas: Record<string, string> = {
  "hassan-tower": "https://storage.googleapis.com/360-panorama-images/morocco/rabat-hassan-tower-360.jpg",
  "chellah": "https://storage.googleapis.com/360-panorama-images/morocco/rabat-chellah-360.jpg",
  "kasbah-oudaya": "https://storage.googleapis.com/360-panorama-images/morocco/rabat-kasbah-oudaya-360.jpg",
  "mohammed-v-mausoleum": "https://storage.googleapis.com/360-panorama-images/morocco/rabat-mohammed-v-mausoleum-360.jpg",
  "rabat-medina": "https://storage.googleapis.com/360-panorama-images/morocco/rabat-medina-360.jpg",
  "andalusian-gardens": "https://storage.googleapis.com/360-panorama-images/morocco/rabat-andalusian-gardens-360.jpg",
  "rabat-archaeological-museum": "https://storage.googleapis.com/360-panorama-images/morocco/rabat-archaeological-museum-360.jpg",
  "royal-palace": "https://storage.googleapis.com/360-panorama-images/morocco/rabat-royal-palace-360.jpg",
  "sale-medina": "https://storage.googleapis.com/360-panorama-images/morocco/rabat-sale-medina-360.jpg", 
  "bab-rouah": "https://storage.googleapis.com/360-panorama-images/morocco/rabat-bab-rouah-360.jpg"
};

// Fallback panorama if the specific landmark isn't available
const fallbackPanorama = "https://cdn.aframe.io/360-image-gallery-boilerplate/img/sechelt.jpg";

export default function VRView({ landmark, onExitVR }: VRViewProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  
  // Get panorama for the current landmark or use fallback
  const getPanoramaForLandmark = (slug: string) => {
    return landmarkPanoramas[slug] || fallbackPanorama;
  };
  
  // Initialize A-Frame scene when component mounts
  useEffect(() => {
    if (!window.AFRAME) {
      console.error("A-Frame not loaded");
      return;
    }
    
    // Create A-Frame scene
    const setupVRScene = () => {
      if (!sceneRef.current) return;
      
      // Clear any existing scene
      sceneRef.current.innerHTML = '';
      
      // Create the scene element
      const scene = document.createElement('a-scene');
      scene.setAttribute('embedded', '');
      scene.setAttribute('vr-mode-ui', 'enabled: true');
      scene.setAttribute('loading-screen', 'dotsColor: #10b981; backgroundColor: #111');
      
      // Add assets
      const assets = document.createElement('a-assets');
      
      // Add sky texture
      const skyTexture = document.createElement('img');
      skyTexture.id = 'sky-texture';
      skyTexture.setAttribute('crossorigin', 'anonymous');
      skyTexture.src = getPanoramaForLandmark(landmark.slug);
      assets.appendChild(skyTexture);
      
      // Add info-panel texture (black semi-transparent background for text)
      const panelTexture = document.createElement('img');
      panelTexture.id = 'info-panel';
      panelTexture.setAttribute('crossorigin', 'anonymous');
      panelTexture.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAKJJHazjwAAAABJRU5ErkJggg==';
      assets.appendChild(panelTexture);
      
      scene.appendChild(assets);
      
      // Add sky
      const sky = document.createElement('a-sky');
      sky.setAttribute('src', '#sky-texture');
      sky.setAttribute('rotation', '0 -90 0');
      scene.appendChild(sky);
      
      // Add camera with controls
      const cameraRig = document.createElement('a-entity');
      cameraRig.setAttribute('position', '0 1.6 0');
      
      const camera = document.createElement('a-camera');
      camera.setAttribute('look-controls', 'reverseMouseDrag: true');
      camera.setAttribute('wasd-controls', '');
      cameraRig.appendChild(camera);
      
      // Add info panel that follows the camera
      const infoPanel = document.createElement('a-entity');
      infoPanel.setAttribute('geometry', 'primitive: plane; width: 1.5; height: 0.6');
      infoPanel.setAttribute('material', 'color: #000; opacity: 0.7');
      infoPanel.setAttribute('position', '0 0 -2');
      infoPanel.setAttribute('text', `value: ${landmark.name}\n${landmark.shortDescription}; color: white; align: center; width: 1.4`);
      camera.appendChild(infoPanel);
      
      scene.appendChild(cameraRig);
      
      // Add hotspots based on landmark (simulating points of interest)
      const addHotspot = (position: string, title: string) => {
        const hotspot = document.createElement('a-entity');
        hotspot.setAttribute('position', position);
        
        // Point of interest marker (pulsing sphere)
        const marker = document.createElement('a-sphere');
        marker.setAttribute('color', '#10b981');
        marker.setAttribute('radius', '0.25');
        marker.setAttribute('animation', 'property: scale; to: 1.2 1.2 1.2; dir: alternate; dur: 1000; loop: true');
        hotspot.appendChild(marker);
        
        // Text label
        const label = document.createElement('a-text');
        label.setAttribute('value', title);
        label.setAttribute('align', 'center');
        label.setAttribute('position', '0 0.5 0');
        label.setAttribute('scale', '0.5 0.5 0.5');
        label.setAttribute('color', 'white');
        label.setAttribute('side', 'double');
        hotspot.appendChild(label);
        
        scene.appendChild(hotspot);
      };
      
      // Add landmark-specific hotspots
      if (landmark.slug === 'hassan-tower') {
        addHotspot('3 0 -5', 'Main Tower');
        addHotspot('-5 0 -3', 'Entrance');
        addHotspot('5 0 2', 'Historic Pillars');
      } else if (landmark.slug === 'chellah') {
        addHotspot('4 0 -4', 'Roman Ruins');
        addHotspot('-4 0 -4', 'Minaret');
        addHotspot('0 0 5', 'Gardens');
      } else if (landmark.slug === 'kasbah-oudaya') {
        addHotspot('5 0 0', 'Blue Gate');
        addHotspot('-3 0 -4', 'Andalusian Garden');
        addHotspot('2 0 5', 'Ocean View');
      } else {
        // Generic hotspots for other landmarks
        addHotspot('4 0 -3', 'Point of Interest');
        addHotspot('-4 0 -2', 'Historical Feature');
        addHotspot('0 0 5', 'Scenic View');
      }
      
      // Append scene to container
      sceneRef.current.appendChild(scene);
    };
    
    setupVRScene();
    
    // Clean up on unmount
    return () => {
      if (sceneRef.current) {
        sceneRef.current.innerHTML = '';
      }
    };
  }, [landmark]);
  
  // Manual controls for mouse look
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown) return;
    
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    
    setRotation(prev => ({
      x: prev.x - deltaY * 0.5, // Vertical look (limited)
      y: prev.y - deltaX * 0.5  // Horizontal rotation
    }));
    
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    
    // Apply rotation to A-Frame camera
    if (sceneRef.current) {
      const camera = sceneRef.current.querySelector('a-camera');
      if (camera) {
        camera.setAttribute('rotation', `${rotation.x} ${rotation.y} 0`);
      }
    }
  };
  
  const handleMouseUp = () => {
    setIsMouseDown(false);
  };
  
  // Navigation controls - these would move the camera in the scene
  const moveForward = () => {
    if (sceneRef.current) {
      const cameraRig = sceneRef.current.querySelector('a-entity');
      if (cameraRig) {
        // Get position and rotation as objects or strings
        const posAttr = cameraRig.getAttribute('position');
        const rotAttr = cameraRig.querySelector('a-camera')?.getAttribute('rotation');
        
        if (posAttr && rotAttr) {
          // Parse the attributes which could be objects or strings
          let position = posAttr;
          let rotation = rotAttr;
          
          // Parse position if it's a string
          if (typeof position === 'string') {
            const [x, y, z] = position.split(' ').map(Number);
            position = { x, y, z };
          }
          
          // Parse rotation if it's a string
          if (typeof rotation === 'string') {
            const [x, y, z] = rotation.split(' ').map(Number);
            rotation = { x, y, z };
          }
          
          // Calculate movement based on camera direction
          const rotY = rotation.y || 0;
          const radians = (rotY * Math.PI) / 180;
          const posX = position.x || 0;
          const posY = position.y || 0;
          const posZ = position.z || 0;
          
          const x = posX - Math.sin(radians) * 0.5;
          const z = posZ - Math.cos(radians) * 0.5;
          
          cameraRig.setAttribute('position', `${x} ${posY} ${z}`);
        }
      }
    }
  };
  
  const moveBackward = () => {
    if (sceneRef.current) {
      const cameraRig = sceneRef.current.querySelector('a-entity');
      if (cameraRig) {
        // Get position and rotation as objects or strings
        const posAttr = cameraRig.getAttribute('position');
        const rotAttr = cameraRig.querySelector('a-camera')?.getAttribute('rotation');
        
        if (posAttr && rotAttr) {
          // Parse the attributes which could be objects or strings
          let position = posAttr;
          let rotation = rotAttr;
          
          // Parse position if it's a string
          if (typeof position === 'string') {
            const [x, y, z] = position.split(' ').map(Number);
            position = { x, y, z };
          }
          
          // Parse rotation if it's a string
          if (typeof rotation === 'string') {
            const [x, y, z] = rotation.split(' ').map(Number);
            rotation = { x, y, z };
          }
          
          // Calculate movement based on camera direction
          const rotY = rotation.y || 0;
          const radians = (rotY * Math.PI) / 180;
          const posX = position.x || 0;
          const posY = position.y || 0;
          const posZ = position.z || 0;
          
          const x = posX + Math.sin(radians) * 0.5;
          const z = posZ + Math.cos(radians) * 0.5;
          
          cameraRig.setAttribute('position', `${x} ${posY} ${z}`);
        }
      }
    }
  };
  
  const turnLeft = () => {
    // Update React state for tracking rotation
    const newRotation = { ...rotation, y: rotation.y + 15 };
    setRotation(newRotation);
    
    // Update A-Frame camera
    if (sceneRef.current) {
      const camera = sceneRef.current.querySelector('a-camera');
      if (camera) {
        camera.setAttribute('rotation', `${newRotation.x} ${newRotation.y} 0`);
      }
    }
  };
  
  const turnRight = () => {
    // Update React state for tracking rotation
    const newRotation = { ...rotation, y: rotation.y - 15 };
    setRotation(newRotation);
    
    // Update A-Frame camera
    if (sceneRef.current) {
      const camera = sceneRef.current.querySelector('a-camera');
      if (camera) {
        camera.setAttribute('rotation', `${newRotation.x} ${newRotation.y} 0`);
      }
    }
  };
  
  return (
    <div 
      id="vr-scene-container" 
      className="h-full w-full relative cursor-grab active:cursor-grabbing" 
      ref={sceneRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Landmark information overlay */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg max-w-xs z-10">
        <h3 className="font-serif font-bold text-xl mb-1">{landmark.name}</h3>
        <p className="text-sm text-gray-200">{landmark.shortDescription}</p>
      </div>
      
      {/* VR navigation controls */}
      <div className="absolute bottom-6 right-6 flex flex-col space-y-3 z-10">
        <button 
          className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all" 
          title="Move forward"
          onClick={moveForward}
        >
          <i className="bx bx-up-arrow-alt text-2xl"></i>
        </button>
        <div className="flex space-x-3">
          <button 
            className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all" 
            title="Turn left"
            onClick={turnLeft}
          >
            <i className="bx bx-left-arrow-alt text-2xl"></i>
          </button>
          <button 
            className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all" 
            title="Turn right"
            onClick={turnRight}
          >
            <i className="bx bx-right-arrow-alt text-2xl"></i>
          </button>
        </div>
        <button 
          className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all" 
          title="Move backward"
          onClick={moveBackward}
        >
          <i className="bx bx-down-arrow-alt text-2xl"></i>
        </button>
      </div>
      
      {/* Exit VR button */}
      <button 
        className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-all flex items-center z-10"
        onClick={onExitVR}
      >
        <i className="bx bx-x text-xl mr-1"></i>
        <span>Exit VR</span>
      </button>
      
      {/* VR Instructions */}
      <div className="absolute bottom-6 left-6 bg-black bg-opacity-50 text-white p-3 rounded-lg z-10">
        <h4 className="font-medium mb-1">Navigation Controls</h4>
        <ul className="text-sm space-y-1">
          <li className="flex items-center"><i className="bx bx-mouse mr-2"></i> Click and drag to look around</li>
          <li className="flex items-center"><i className="bx bx-walk mr-2"></i> Use arrow buttons to move</li>
          <li className="flex items-center"><i className="bx bx-target-lock mr-2"></i> Explore hotspots (green markers)</li>
        </ul>
      </div>
    </div>
  );
}
