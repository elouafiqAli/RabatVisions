import { Landmark } from "@shared/schema";

export interface LandmarkData {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  location: string;
  openingHours: string;
  latitude: string;
  longitude: string;
  vrModelUrl?: string;
  vrSceneConfig?: {
    cameraPosition: { x: number; y: number; z: number };
    lightIntensity: number;
    environmentMap: "day" | "night" | "indoor";
  };
}

// This file contains the landmark data that will be served by the API
// The actual implementation will use the database via the storage interface
export const landmarkData: LandmarkData[] = [
  {
    id: 1,
    name: "Hassan Tower",
    slug: "hassan-tower",
    description: "The Hassan Tower is a minaret of an incomplete mosque in Rabat. Commissioned by Abu Yusuf Yaqub al-Mansur, the third Caliph of the Almohad Caliphate, the tower was intended to be the largest minaret in the world. The tower reached a height of 44 m, about half of its intended 86 m height.",
    shortDescription: "Iconic 12th-century minaret of an incomplete mosque, standing as a symbol of Rabat.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Tour_Hassan_Rabat.jpg/1280px-Tour_Hassan_Rabat.jpg",
    location: "Avenue Hassan II, Rabat",
    openingHours: "8:00 AM - 6:00 PM",
    latitude: "34.0242",
    longitude: "-6.8210",
    vrModelUrl: "/vr/hassan-tower.gltf",
    vrSceneConfig: {
      cameraPosition: { x: 0, y: 1.6, z: 5 },
      lightIntensity: 1.0,
      environmentMap: "day"
    }
  },
  {
    id: 2,
    name: "Chellah Necropolis",
    slug: "chellah",
    description: "Chellah is a medieval fortified Muslim necropolis located in the metro area of Rabat. The Phoenicians established a trading emporium at the site. Later, the site was occupied by Carthaginians, then by Romans who built their own city, Sala Colonia. The ruins of their walled town contain a forum, a triumphal arch, a decumanus maximus, a cardo, a capitoline temple, a crafts district, and a residential district.",
    shortDescription: "Ancient Roman ruins and medieval Muslim necropolis with beautiful gardens and storks nesting on the minaret.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Morocco_Africa_Flickr_Rosino_December_2005_84514010.jpg/1280px-Morocco_Africa_Flickr_Rosino_December_2005_84514010.jpg",
    location: "Avenue Al Marinyeen, Rabat",
    openingHours: "9:00 AM - 5:30 PM",
    latitude: "34.0047",
    longitude: "-6.8146",
    vrModelUrl: "/vr/chellah.gltf",
    vrSceneConfig: {
      cameraPosition: { x: 0, y: 1.6, z: 5 },
      lightIntensity: 1.0,
      environmentMap: "day"
    }
  },
  // Other landmarks would be defined here
];
