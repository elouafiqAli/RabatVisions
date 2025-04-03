import { useEffect, useRef, useState } from "react";
import { Landmark } from "@shared/schema";

// Define interfaces for A-Frame position and rotation
interface AFramePosition {
  x: number;
  y: number;
  z: number;
}

interface AFrameRotation {
  x: number;
  y: number;
  z: number;
}

interface VRViewProps {
  landmark: Landmark;
  onExitVR: () => void;
}

// Landmark environment settings
const landmarkEnvironments: Record<string, {
  skyColor: string;
  groundColor: string;
  lightColor: string;
  structureColor: string;
  ambientColor: string;
}> = {
  "hassan-tower": {
    skyColor: "#87CEEB",  // Light blue
    groundColor: "#C2B280", // Sandy
    lightColor: "#FFFFDD", // Warm sunlight
    structureColor: "#D2B48C", // Tan sandstone
    ambientColor: "#FFFFFA" // Warm ambient
  },
  "chellah": {
    skyColor: "#ADD8E6", // Light blue
    groundColor: "#8B4513", // Brown soil
    lightColor: "#FFFFCC", // Warm sunlight
    structureColor: "#A0522D", // Brown ruins
    ambientColor: "#FFFFFA" // Warm ambient
  },
  "kasbah-oudaya": {
    skyColor: "#00BFFF", // Deep sky blue
    groundColor: "#DAA06D", // Tan
    lightColor: "#FFFACD", // Warm sunlight
    structureColor: "#F5F5DC", // Beige walls
    ambientColor: "#FFFAF0" // Warm ambient
  },
  "mohammed-v-mausoleum": {
    skyColor: "#385F85",  // Deep blue
    groundColor: "#D4D0C8", // Marble floor
    lightColor: "#E6E8DB", // Soft ornate lights
    structureColor: "#F5F5F5", // White marble
    ambientColor: "#FFFFC8" // Warm ambient
  },
  "rabat-medina": {
    skyColor: "#87CEEB", // Blue sky
    groundColor: "#BDB76B", // Dark khaki
    lightColor: "#FFFACD", // Warm sunlight
    structureColor: "#CD853F", // Peru (mud walls)
    ambientColor: "#FFFAFA" // White
  }
};

// Default environment
const defaultEnvironment = {
  skyColor: "#87CEEB", // Blue sky
  groundColor: "#8B7355", // Sand/soil
  lightColor: "#FFFFFF", // White light
  structureColor: "#D2B48C", // Tan sandstone
  ambientColor: "#FFFFFA" // Warm ambient
};

export default function VRView({ landmark, onExitVR }: VRViewProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  
  // Get environment settings for landmark
  const getEnvironmentForLandmark = (slug: string) => {
    return landmarkEnvironments[slug] || defaultEnvironment;
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
      
      // Get environment colors for this landmark
      const env = getEnvironmentForLandmark(landmark.slug);
      
      // Create the scene element
      const scene = document.createElement('a-scene');
      scene.setAttribute('embedded', '');
      scene.setAttribute('vr-mode-ui', 'enabled: true');
      scene.setAttribute('loading-screen', 'dotsColor: #10b981; backgroundColor: #111');
      
      // Add assets
      const assets = document.createElement('a-assets');
      scene.appendChild(assets);
      
      // Add environment
      // Sky
      const sky = document.createElement('a-sky');
      sky.setAttribute('color', env.skyColor);
      scene.appendChild(sky);
      
      // Ground - large circular plane
      const ground = document.createElement('a-plane');
      ground.setAttribute('position', '0 0 0');
      ground.setAttribute('rotation', '-90 0 0');
      ground.setAttribute('width', '100');
      ground.setAttribute('height', '100');
      ground.setAttribute('color', env.groundColor);
      scene.appendChild(ground);
      
      // Ambient light
      const ambientLight = document.createElement('a-light');
      ambientLight.setAttribute('type', 'ambient');
      ambientLight.setAttribute('color', env.ambientColor);
      ambientLight.setAttribute('intensity', '0.5');
      scene.appendChild(ambientLight);
      
      // Directional light (sun/main light)
      const directionalLight = document.createElement('a-light');
      directionalLight.setAttribute('type', 'directional');
      directionalLight.setAttribute('color', env.lightColor);
      directionalLight.setAttribute('intensity', '0.8');
      directionalLight.setAttribute('position', '-1 1 1');
      scene.appendChild(directionalLight);
      
      // Add camera with controls
      const cameraRig = document.createElement('a-entity');
      cameraRig.setAttribute('position', '0 1.6 5'); // Start a bit back to see the monument
      
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
      
      // Create 3D representation of the landmark
      const createLandmarkModel = () => {
        const landmarkEntity = document.createElement('a-entity');
        landmarkEntity.setAttribute('position', '0 0 0');
        
        if (landmark.slug === 'hassan-tower') {
          // Create Hassan Tower - tall minaret structure
          const tower = document.createElement('a-box');
          tower.setAttribute('position', '0 10 0');
          tower.setAttribute('width', '8');
          tower.setAttribute('depth', '8');
          tower.setAttribute('height', '20');
          tower.setAttribute('color', env.structureColor);
          
          // Tower details - windows and decorative elements
          const createWindow = (x: number, y: number, z: number) => {
            const window = document.createElement('a-box');
            window.setAttribute('position', `${x} ${y} ${z}`);
            window.setAttribute('width', '1.2');
            window.setAttribute('height', '2');
            window.setAttribute('depth', '0.5');
            window.setAttribute('color', '#2F4F4F');
            return window;
          };
          
          // Add windows on each side
          tower.appendChild(createWindow(0, 15, 4.1));
          tower.appendChild(createWindow(0, 10, 4.1));
          tower.appendChild(createWindow(4.1, 15, 0));
          tower.appendChild(createWindow(4.1, 10, 0));
          tower.appendChild(createWindow(0, 15, -4.1));
          tower.appendChild(createWindow(0, 10, -4.1));
          tower.appendChild(createWindow(-4.1, 15, 0));
          tower.appendChild(createWindow(-4.1, 10, 0));
          
          // Top decorative element
          const top = document.createElement('a-box');
          top.setAttribute('position', '0 20.5 0');
          top.setAttribute('width', '10');
          top.setAttribute('depth', '10');
          top.setAttribute('height', '1');
          top.setAttribute('color', '#C8A780');
          tower.appendChild(top);
          
          // Add columns around for the incomplete mosque
          for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const x = Math.sin(angle) * 15;
            const z = Math.cos(angle) * 15;
            
            const column = document.createElement('a-cylinder');
            column.setAttribute('position', `${x} 3 ${z}`);
            column.setAttribute('radius', '1');
            column.setAttribute('height', '6');
            column.setAttribute('color', env.structureColor);
            landmarkEntity.appendChild(column);
            
            // Column capital
            const capital = document.createElement('a-box');
            capital.setAttribute('position', `${x} 6.25 ${z}`);
            capital.setAttribute('width', '2.5');
            capital.setAttribute('depth', '2.5');
            capital.setAttribute('height', '0.5');
            capital.setAttribute('color', '#E8DFD8');
            landmarkEntity.appendChild(capital);
          }
          
          landmarkEntity.appendChild(tower);
        } 
        else if (landmark.slug === 'chellah') {
          // Create Chellah - ruins with walls and minaret
          
          // Main ruins area - an irregular wall structure
          const createWall = (
            x: number, y: number, z: number, 
            width: number, height: number, depth: number,
            rotationY: number
          ) => {
            const wall = document.createElement('a-box');
            wall.setAttribute('position', `${x} ${y} ${z}`);
            wall.setAttribute('width', `${width}`);
            wall.setAttribute('height', `${height}`);
            wall.setAttribute('depth', `${depth}`);
            wall.setAttribute('rotation', `0 ${rotationY} 0`);
            wall.setAttribute('color', env.structureColor);
            return wall;
          };
          
          // Outer walls
          landmarkEntity.appendChild(createWall(-10, 2, 0, 20, 4, 1, 0));
          landmarkEntity.appendChild(createWall(10, 2, 0, 20, 4, 1, 0));
          landmarkEntity.appendChild(createWall(0, 2, 10, 20, 4, 1, 90));
          landmarkEntity.appendChild(createWall(0, 2, -10, 20, 4, 1, 90));
          
          // Minaret - typical of Islamic architecture
          const minaret = document.createElement('a-cylinder');
          minaret.setAttribute('position', '5 8 5');
          minaret.setAttribute('radius', '1.5');
          minaret.setAttribute('height', '16');
          minaret.setAttribute('color', '#B8A88A');
          landmarkEntity.appendChild(minaret);
          
          // Top of minaret
          const minaretTop = document.createElement('a-cone');
          minaretTop.setAttribute('position', '5 16.5 5');
          minaretTop.setAttribute('radius-bottom', '2');
          minaretTop.setAttribute('radius-top', '0.5');
          minaretTop.setAttribute('height', '3');
          minaretTop.setAttribute('color', '#D4C9B8');
          landmarkEntity.appendChild(minaretTop);
          
          // Roman-style columns (ruins)
          for (let i = 0; i < 5; i++) {
            const column = document.createElement('a-cylinder');
            column.setAttribute('position', `${-8 + i * 4} 2 -5`);
            column.setAttribute('radius', '0.6');
            column.setAttribute('height', '4');
            column.setAttribute('color', '#D6CDC3');
            landmarkEntity.appendChild(column);
          }
          
          // Add some vegetation (stylized)
          for (let i = 0; i < 15; i++) {
            const x = Math.random() * 25 - 12.5;
            const z = Math.random() * 25 - 12.5;
            
            // Don't place trees on walls
            if (Math.abs(x) > 9 || Math.abs(z) > 9) {
              const tree = document.createElement('a-entity');
              tree.setAttribute('position', `${x} 0 ${z}`);
              
              // Tree trunk
              const trunk = document.createElement('a-cylinder');
              trunk.setAttribute('position', '0 1.5 0');
              trunk.setAttribute('radius', '0.3');
              trunk.setAttribute('height', '3');
              trunk.setAttribute('color', '#8B4513');
              tree.appendChild(trunk);
              
              // Tree foliage
              const foliage = document.createElement('a-sphere');
              foliage.setAttribute('position', '0 3.5 0');
              foliage.setAttribute('radius', '1.5');
              foliage.setAttribute('color', '#228B22');
              tree.appendChild(foliage);
              
              landmarkEntity.appendChild(tree);
            }
          }
        }
        else if (landmark.slug === 'kasbah-oudaya') {
          // Create Kasbah of the Udayas - fortress with blue-white buildings
          
          // Main fortress wall
          const mainWall = document.createElement('a-box');
          mainWall.setAttribute('position', '0 4 0');
          mainWall.setAttribute('width', '25');
          mainWall.setAttribute('depth', '25');
          mainWall.setAttribute('height', '8');
          mainWall.setAttribute('color', env.structureColor);
          
          // Hollow out the center (using a slightly smaller inverted box)
          const inner = document.createElement('a-box');
          inner.setAttribute('position', '0 4 0');
          inner.setAttribute('width', '21');
          inner.setAttribute('depth', '21');
          inner.setAttribute('height', '10'); // Taller to ensure it cuts through
          inner.setAttribute('color', 'black');
          inner.setAttribute('opacity', '0');
          inner.setAttribute('material', 'side: back');
          mainWall.appendChild(inner);
          
          landmarkEntity.appendChild(mainWall);
          
          // Main entrance gate
          const gate = document.createElement('a-box');
          gate.setAttribute('position', '0 4 12.6');
          gate.setAttribute('width', '6');
          gate.setAttribute('height', '8');
          gate.setAttribute('depth', '1');
          gate.setAttribute('color', '#4682B4'); // The famous blue gate
          landmarkEntity.appendChild(gate);
          
          // Gate arch
          const arch = document.createElement('a-entity');
          arch.setAttribute('position', '0 7.5 12.6');
          arch.setAttribute('geometry', 'primitive: torus; radius: 3; radiusTubular: 1; arc: 180');
          arch.setAttribute('rotation', '0 0 180');
          arch.setAttribute('scale', '1 0.35 1');
          arch.setAttribute('color', '#4682B4');
          landmarkEntity.appendChild(arch);
          
          // Towers at corners
          const createTower = (x: number, z: number) => {
            const tower = document.createElement('a-cylinder');
            tower.setAttribute('position', `${x} 5 ${z}`);
            tower.setAttribute('radius', '3');
            tower.setAttribute('height', '10');
            tower.setAttribute('color', env.structureColor);
            landmarkEntity.appendChild(tower);
            
            // Tower top
            const towerTop = document.createElement('a-cone');
            towerTop.setAttribute('position', `${x} 10 ${z}`);
            towerTop.setAttribute('radius-bottom', '3.5');
            towerTop.setAttribute('radius-top', '0');
            towerTop.setAttribute('height', '3');
            towerTop.setAttribute('color', '#C8A780');
            landmarkEntity.appendChild(towerTop);
          };
          
          // Four corner towers
          createTower(12.5, 12.5);
          createTower(-12.5, 12.5);
          createTower(12.5, -12.5);
          createTower(-12.5, -12.5);
          
          // Inside buildings (blue & white houses)
          for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) {
              // Skip some positions to create streets
              if ((i === 0 && j !== 0) || (j === 0 && i !== 0)) continue;
              
              const house = document.createElement('a-box');
              house.setAttribute('position', `${i * 4} 2 ${j * 4}`);
              house.setAttribute('width', '3');
              house.setAttribute('depth', '3');
              house.setAttribute('height', '4');
              
              // Alternate between white and blue buildings
              const color = (i + j) % 2 === 0 ? '#F5F5F5' : '#4682B4';
              house.setAttribute('color', color);
              
              landmarkEntity.appendChild(house);
            }
          }
        }
        else if (landmark.slug === 'mohammed-v-mausoleum') {
          // Create Mohammed V Mausoleum - ornate mausoleum
          
          // Base platform
          const base = document.createElement('a-box');
          base.setAttribute('position', '0 1 0');
          base.setAttribute('width', '20');
          base.setAttribute('depth', '20');
          base.setAttribute('height', '2');
          base.setAttribute('color', '#F5F5F5'); // White marble
          landmarkEntity.appendChild(base);
          
          // Main building structure
          const mainBuilding = document.createElement('a-box');
          mainBuilding.setAttribute('position', '0 6 0');
          mainBuilding.setAttribute('width', '15');
          mainBuilding.setAttribute('depth', '15');
          mainBuilding.setAttribute('height', '10');
          mainBuilding.setAttribute('color', env.structureColor);
          landmarkEntity.appendChild(mainBuilding);
          
          // Dome
          const dome = document.createElement('a-sphere');
          dome.setAttribute('position', '0 13 0');
          dome.setAttribute('radius', '7');
          dome.setAttribute('theta-start', '0');
          dome.setAttribute('theta-length', '90');
          dome.setAttribute('color', '#006400'); // Traditional green dome
          landmarkEntity.appendChild(dome);
          
          // Decorative elements - arches on each side
          const createArch = (x: number, z: number, rotation: number) => {
            const arch = document.createElement('a-entity');
            arch.setAttribute('position', `${x} 6 ${z}`);
            arch.setAttribute('rotation', `0 ${rotation} 0`);
            
            // Arch shape
            const archShape = document.createElement('a-entity');
            archShape.setAttribute('geometry', 'primitive: torus; radius: 3; radiusTubular: 0.6; arc: 180');
            archShape.setAttribute('rotation', '0 0 180');
            archShape.setAttribute('scale', '1 0.6 0.3');
            archShape.setAttribute('position', '0 3 0');
            archShape.setAttribute('color', '#D4AF37'); // Gold
            arch.appendChild(archShape);
            
            return arch;
          };
          
          // Four arches, one on each side
          landmarkEntity.appendChild(createArch(0, 7.6, 0));
          landmarkEntity.appendChild(createArch(0, -7.6, 180));
          landmarkEntity.appendChild(createArch(7.6, 0, 270));
          landmarkEntity.appendChild(createArch(-7.6, 0, 90));
          
          // Decorative columns at corners
          const createColumn = (x: number, z: number) => {
            const column = document.createElement('a-cylinder');
            column.setAttribute('position', `${x} 6 ${z}`);
            column.setAttribute('radius', '1');
            column.setAttribute('height', '10');
            column.setAttribute('color', '#F5F5F5'); // White columns
            
            // Column capital
            const capital = document.createElement('a-box');
            capital.setAttribute('position', '0 5.25 0');
            capital.setAttribute('width', '2.5');
            capital.setAttribute('depth', '2.5');
            capital.setAttribute('height', '0.5');
            capital.setAttribute('color', '#D4AF37'); // Gold
            column.appendChild(capital);
            
            return column;
          };
          
          // Four corner columns
          landmarkEntity.appendChild(createColumn(6, 6));
          landmarkEntity.appendChild(createColumn(-6, 6));
          landmarkEntity.appendChild(createColumn(6, -6));
          landmarkEntity.appendChild(createColumn(-6, -6));
        }
        else if (landmark.slug === 'rabat-medina') {
          // Create Rabat Medina - maze of narrow streets and shops
          const createMedinaBuilding = (x: number, z: number, size: number, height: number, color: string) => {
            const building = document.createElement('a-box');
            building.setAttribute('position', `${x} ${height/2} ${z}`);
            building.setAttribute('width', `${size}`);
            building.setAttribute('depth', `${size}`);
            building.setAttribute('height', `${height}`);
            building.setAttribute('color', color);
            return building;
          };
          
          // Create a grid of buildings of different heights and slightly different colors
          const colors = ['#D2B48C', '#C8A98C', '#BF9D7E', '#E6C2A0', '#D4B996'];
          const buildingBlocks = [];
          const streetMap = [
            [1, 1, 1, 0, 1, 1, 1],
            [1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [0, 0, 1, 1, 1, 0, 0],
            [1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1]
          ];
          
          for (let i = 0; i < streetMap.length; i++) {
            for (let j = 0; j < streetMap[i].length; j++) {
              if (streetMap[i][j] === 1) {
                // Calculate position
                const x = (i - 3) * 6; // Center the grid
                const z = (j - 3) * 6;
                
                // Randomize building properties
                const colorIndex = Math.floor(Math.random() * colors.length);
                const height = 3 + Math.random() * 3; // Height between 3-6 units
                
                buildingBlocks.push(createMedinaBuilding(x, z, 5, height, colors[colorIndex]));
              }
            }
          }
          
          // Add all buildings to the entity
          buildingBlocks.forEach(block => landmarkEntity.appendChild(block));
          
          // Add a central market space
          const marketCanopy = document.createElement('a-entity');
          marketCanopy.setAttribute('position', '0 3 0');
          
          // Canopy poles
          for (let i = -1; i <= 1; i += 2) {
            for (let j = -1; j <= 1; j += 2) {
              const pole = document.createElement('a-cylinder');
              pole.setAttribute('position', `${i * 2} 0 ${j * 2}`);
              pole.setAttribute('radius', '0.2');
              pole.setAttribute('height', '3');
              pole.setAttribute('color', '#8B4513');
              marketCanopy.appendChild(pole);
            }
          }
          
          // Canopy top
          const canopyTop = document.createElement('a-box');
          canopyTop.setAttribute('position', '0 1.6 0');
          canopyTop.setAttribute('width', '5');
          canopyTop.setAttribute('depth', '5');
          canopyTop.setAttribute('height', '0.2');
          canopyTop.setAttribute('color', '#A52A2A');
          marketCanopy.appendChild(canopyTop);
          
          // Market stalls
          for (let i = -1; i <= 1; i += 1) {
            if (i === 0) continue; // Skip center
            
            const stall = document.createElement('a-box');
            stall.setAttribute('position', `${i * 1.5} 0.5 0`);
            stall.setAttribute('width', '1');
            stall.setAttribute('depth', '2');
            stall.setAttribute('height', '1');
            stall.setAttribute('color', '#DEB887');
            marketCanopy.appendChild(stall);
          }
          
          landmarkEntity.appendChild(marketCanopy);
        }
        else {
          // Generic landmark representation for other places
          // Central monument/building
          const monument = document.createElement('a-box');
          monument.setAttribute('position', '0 5 0');
          monument.setAttribute('width', '8');
          monument.setAttribute('depth', '8');
          monument.setAttribute('height', '10');
          monument.setAttribute('color', env.structureColor);
          landmarkEntity.appendChild(monument);
          
          // Top feature (dome or spire)
          const top = document.createElement('a-sphere');
          top.setAttribute('position', '0 11 0');
          top.setAttribute('radius', '4');
          top.setAttribute('theta-start', '0');
          top.setAttribute('theta-length', '90');
          top.setAttribute('color', env.structureColor);
          landmarkEntity.appendChild(top);
          
          // Surrounding elements
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x = Math.sin(angle) * 12;
            const z = Math.cos(angle) * 12;
            
            const element = document.createElement('a-box');
            element.setAttribute('position', `${x} 2 ${z}`);
            element.setAttribute('width', '3');
            element.setAttribute('depth', '3');
            element.setAttribute('height', '4');
            element.setAttribute('color', env.structureColor);
            element.setAttribute('rotation', `0 ${(angle * 180) / Math.PI} 0`);
            landmarkEntity.appendChild(element);
          }
        }
        
        return landmarkEntity;
      };
      
      // Add the 3D landmark model
      scene.appendChild(createLandmarkModel());
      
      // Add hotspots for points of interest
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
        addHotspot('0 2 15', 'Entrance');
        addHotspot('0 10 0', 'Tower');
        addHotspot('15 2 0', 'Column Ruins');
      } else if (landmark.slug === 'chellah') {
        addHotspot('5 2 5', 'Minaret');
        addHotspot('-8 2 -5', 'Roman Columns');
        addHotspot('0 2 -10', 'Ancient Walls');
      } else if (landmark.slug === 'kasbah-oudaya') {
        addHotspot('0 2 12', 'Blue Gate');
        addHotspot('12.5 2 12.5', 'Corner Tower');
        addHotspot('0 2 0', 'Medina Houses');
      } else {
        // Generic hotspots for other landmarks
        addHotspot('0 2 10', 'Main Entrance');
        addHotspot('10 2 0', 'East Wing');
        addHotspot('0 2 -10', 'Garden View');
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
          let position: AFramePosition;
          let rotation: AFrameRotation;
          
          // Parse position if it's a string
          if (typeof posAttr === 'string') {
            const [x, y, z] = posAttr.split(' ').map(Number);
            position = { x, y, z };
          } else {
            position = posAttr as AFramePosition;
          }
          
          // Parse rotation if it's a string
          if (typeof rotAttr === 'string') {
            const [x, y, z] = rotAttr.split(' ').map(Number);
            rotation = { x, y, z };
          } else {
            rotation = rotAttr as AFrameRotation;
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
          let position: AFramePosition;
          let rotation: AFrameRotation;
          
          // Parse position if it's a string
          if (typeof posAttr === 'string') {
            const [x, y, z] = posAttr.split(' ').map(Number);
            position = { x, y, z };
          } else {
            position = posAttr as AFramePosition;
          }
          
          // Parse rotation if it's a string
          if (typeof rotAttr === 'string') {
            const [x, y, z] = rotAttr.split(' ').map(Number);
            rotation = { x, y, z };
          } else {
            rotation = rotAttr as AFrameRotation;
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
