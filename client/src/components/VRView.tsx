import { useEffect, useRef } from "react";
import { Landmark } from "@shared/schema";

interface VRViewProps {
  landmark: Landmark;
  onExitVR: () => void;
}

export default function VRView({ landmark, onExitVR }: VRViewProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  
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
      
      // Add assets
      const assets = document.createElement('a-assets');
      
      // Add sky texture
      const skyTexture = document.createElement('img');
      skyTexture.id = 'sky-texture';
      skyTexture.src = 'https://cdn.aframe.io/360-image-gallery-boilerplate/img/sechelt.jpg';
      assets.appendChild(skyTexture);
      
      scene.appendChild(assets);
      
      // Add sky
      const sky = document.createElement('a-sky');
      sky.setAttribute('src', '#sky-texture');
      sky.setAttribute('rotation', '0 -90 0');
      scene.appendChild(sky);
      
      // Add camera with controls
      const camera = document.createElement('a-camera');
      camera.setAttribute('position', '0 1.6 0');
      camera.setAttribute('look-controls', '');
      camera.setAttribute('wasd-controls', '');
      scene.appendChild(camera);
      
      // Add ground
      const ground = document.createElement('a-plane');
      ground.setAttribute('rotation', '-90 0 0');
      ground.setAttribute('width', '100');
      ground.setAttribute('height', '100');
      ground.setAttribute('color', '#7BC8A4');
      scene.appendChild(ground);
      
      // Add a simple environment based on the landmark
      if (landmark.vrSceneConfig) {
        // Parse the JSON config
        const config = landmark.vrSceneConfig as any;
        
        // Add directional light
        const light = document.createElement('a-light');
        light.setAttribute('type', 'directional');
        light.setAttribute('position', '0 1 1');
        light.setAttribute('intensity', config.lightIntensity || 0.5);
        scene.appendChild(light);
        
        // Add ambient light
        const ambientLight = document.createElement('a-light');
        ambientLight.setAttribute('type', 'ambient');
        ambientLight.setAttribute('color', '#BBB');
        scene.appendChild(ambientLight);
      }
      
      // Add landmark name text
      const text = document.createElement('a-text');
      text.setAttribute('value', landmark.name);
      text.setAttribute('position', '0 2.5 -3');
      text.setAttribute('color', 'white');
      text.setAttribute('width', '10');
      text.setAttribute('align', 'center');
      scene.appendChild(text);
      
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
  
  return (
    <div id="vr-scene-container" className="h-full w-full relative" ref={sceneRef}>
      {/* Landmark information overlay */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg max-w-xs z-10">
        <h3 className="font-serif font-bold text-xl mb-1">{landmark.name}</h3>
        <p className="text-sm text-gray-200">{landmark.shortDescription}</p>
      </div>
      
      {/* VR navigation controls */}
      <div className="absolute bottom-6 right-6 flex flex-col space-y-3 z-10">
        <button className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all" title="Move forward">
          <i className="bx bx-up-arrow-alt text-2xl"></i>
        </button>
        <div className="flex space-x-3">
          <button className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all" title="Turn left">
            <i className="bx bx-left-arrow-alt text-2xl"></i>
          </button>
          <button className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all" title="Turn right">
            <i className="bx bx-right-arrow-alt text-2xl"></i>
          </button>
        </div>
        <button className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all" title="Move backward">
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
          <li className="flex items-center"><i className="bx bx-mouse mr-2"></i> Drag to look around</li>
          <li className="flex items-center"><i className="bx bx-walk mr-2"></i> Use arrow buttons to move</li>
          <li className="flex items-center"><i className="bx bxs-devices mr-2"></i> VR headset: Toggle VR mode</li>
        </ul>
      </div>
      
      {/* VR mode toggle */}
      <button className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-primary hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center space-x-2 z-10">
        <i className="bx bxs-devices"></i>
        <span>Enter VR Mode</span>
      </button>
    </div>
  );
}
