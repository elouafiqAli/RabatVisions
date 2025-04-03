// Type definitions for external libraries

// Mapbox GL
declare namespace mapboxgl {
  let accessToken: string;
  
  export class Map {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    remove(): void;
    flyTo(options: any): void;
    getZoom(): number;
    getCenter(): { lng: number; lat: number };
    addControl(control: any, position?: string): void;
  }
  
  export class Marker {
    constructor(element?: HTMLElement);
    setLngLat(lngLat: [number, number]): this;
    addTo(map: Map): this;
    remove(): this;
    getElement(): HTMLElement;
  }
  
  export class Popup {
    constructor(options?: any);
    setLngLat(lngLat: [number, number]): this;
    setHTML(html: string): this;
    addTo(map: Map): this;
    remove(): this;
  }
  
  export class NavigationControl {
    constructor(options?: any);
  }
}

// Extend Window interface
interface Window {
  mapboxgl: typeof mapboxgl;
  AFRAME: any;
}

// A-Frame position/rotation type
interface AFramePosition {
  x: number;
  y: number;
  z: number;
}

// A-Frame attributes
interface AFrameAttributes {
  position: AFramePosition | string;
  rotation?: AFramePosition | string;
  scale?: AFramePosition | string;
  [key: string]: any;
}