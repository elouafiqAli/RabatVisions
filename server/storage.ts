import { landmarks, type Landmark, type InsertLandmark, users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Landmark methods
  getLandmarks(): Promise<Landmark[]>;
  getLandmarkBySlug(slug: string): Promise<Landmark | undefined>;
  createLandmark(landmark: InsertLandmark): Promise<Landmark>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private landmarksMap: Map<number, Landmark>;
  currentUserId: number;
  currentLandmarkId: number;

  constructor() {
    this.users = new Map();
    this.landmarksMap = new Map();
    this.currentUserId = 1;
    this.currentLandmarkId = 1;
    
    // Initialize with default landmarks
    this.initDefaultLandmarks();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getLandmarks(): Promise<Landmark[]> {
    return Array.from(this.landmarksMap.values());
  }

  async getLandmarkBySlug(slug: string): Promise<Landmark | undefined> {
    return Array.from(this.landmarksMap.values()).find(
      (landmark) => landmark.slug === slug,
    );
  }

  async createLandmark(insertLandmark: InsertLandmark): Promise<Landmark> {
    const id = this.currentLandmarkId++;
    const landmark: Landmark = { ...insertLandmark, id };
    this.landmarksMap.set(id, landmark);
    return landmark;
  }

  private initDefaultLandmarks() {
    const defaultLandmarks: InsertLandmark[] = [
      {
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
      {
        name: "Kasbah of the Udayas",
        slug: "kasbah-oudaya",
        description: "The Kasbah of the Udayas is a kasbah in Rabat. It was built during the reign of the Almohads. The edifice was originally built in the 12th century and renovated multiple times after that. The kasbah was listed as a UNESCO World Heritage Site in 2012.",
        shortDescription: "Ancient fortress with blue and white painted streets, Andalusian Gardens, and amazing views of the ocean.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Rabat_Kasbah_des_Oudaias.jpg/1280px-Rabat_Kasbah_des_Oudaias.jpg",
        location: "Rue El Marsa, Rabat",
        openingHours: "8:00 AM - 6:00 PM",
        latitude: "34.0346",
        longitude: "-6.8363",
        vrModelUrl: "/vr/kasbah-oudaya.gltf",
        vrSceneConfig: {
          cameraPosition: { x: 0, y: 1.6, z: 5 },
          lightIntensity: 1.0,
          environmentMap: "day"
        }
      },
      {
        name: "Mohammed V Mausoleum",
        slug: "mohammed-v-mausoleum",
        description: "The Mausoleum of Mohammed V is a historical building located opposite the Hassan Tower on the Yacoub al-Mansour esplanade in Rabat. It contains the tombs of the Moroccan king Mohammed V and his sons, King Hassan II and Prince Abdallah. The building is considered a masterpiece of modern Alaouite dynasty architecture, with its white silhouette, topped by a typical green tiled roof.",
        shortDescription: "Ornate mausoleum of King Mohammed V with beautiful Moroccan craftsmanship and Royal Guards.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/MohammedVMausoleum.jpg/1280px-MohammedVMausoleum.jpg",
        location: "Boulevard Abi Regreg, Rabat",
        openingHours: "9:00 AM - 6:00 PM",
        latitude: "34.0245",
        longitude: "-6.8213",
        vrModelUrl: "/vr/mohammed-v-mausoleum.gltf",
        vrSceneConfig: {
          cameraPosition: { x: 0, y: 1.6, z: 5 },
          lightIntensity: 0.8,
          environmentMap: "indoor"
        }
      },
      {
        name: "Rabat Medina",
        slug: "rabat-medina",
        description: "The Rabat Medina, or old city, is a charming area filled with narrow, maze-like streets lined with shops selling traditional Moroccan goods. Unlike some other Moroccan medinas, Rabat's is relatively uncrowded and relaxed, making it a pleasant place to explore. The medina is surrounded by 17th-century Andalusian walls and contains the Great Mosque, various souks, and traditional residential areas.",
        shortDescription: "Historic walled old city with markets, traditional shops, and authentic Moroccan atmosphere.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Medina_of_Rabat_-_Morocco.jpg/1280px-Medina_of_Rabat_-_Morocco.jpg",
        location: "Medina, Rabat",
        openingHours: "Open 24 hours",
        latitude: "34.0253",
        longitude: "-6.8407",
        vrModelUrl: "/vr/rabat-medina.gltf",
        vrSceneConfig: {
          cameraPosition: { x: 0, y: 1.6, z: 0 },
          lightIntensity: 1.0,
          environmentMap: "day"
        }
      },
      {
        name: "Andalusian Gardens",
        slug: "andalusian-gardens",
        description: "The Andalusian Gardens are located inside the Kasbah of the Udayas. These lush gardens were created by the French during the colonial period but designed in a traditional Andalusian style with fountains, orange trees, colorful flowers, and decorative tiled paths. The gardens offer a peaceful retreat from the bustling city and beautiful views of the Bou Regreg River.",
        shortDescription: "Peaceful garden with fountains, exotic plants, and Spanish-Moorish design within the Kasbah.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Rabat_Kasbah_Andalusian_Gardens.jpg/1280px-Rabat_Kasbah_Andalusian_Gardens.jpg",
        location: "Inside Kasbah of the Udayas, Rabat",
        openingHours: "8:00 AM - 6:00 PM",
        latitude: "34.0339",
        longitude: "-6.8367",
        vrModelUrl: "/vr/andalusian-gardens.gltf",
        vrSceneConfig: {
          cameraPosition: { x: 0, y: 1.6, z: 5 },
          lightIntensity: 1.0,
          environmentMap: "day"
        }
      },
      {
        name: "Rabat Archaeological Museum",
        slug: "rabat-archaeological-museum",
        description: "The Rabat Archaeological Museum is one of the most important museums in Morocco. It houses an extensive collection of archaeological artifacts from various prehistoric and historic periods of Morocco's history. The collections include items from Volubilis, Banasa, and Thamusida, as well as finds from archaeological research in Rabat. The museum is particularly known for its fine collection of bronzes and marble sculptures from the Roman era.",
        shortDescription: "Important museum with pre-Roman and Roman artifacts including the famous Volubilis bronzes.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Mus%C3%A9e_arch%C3%A9ologique_de_Rabat_01.jpg/1280px-Mus%C3%A9e_arch%C3%A9ologique_de_Rabat_01.jpg",
        location: "Rue Brihi, Rabat",
        openingHours: "10:00 AM - 5:00 PM, Closed on Tuesdays",
        latitude: "34.0098",
        longitude: "-6.8364",
        vrModelUrl: "/vr/rabat-archaeological-museum.gltf",
        vrSceneConfig: {
          cameraPosition: { x: 0, y: 1.6, z: 5 },
          lightIntensity: 0.7,
          environmentMap: "indoor"
        }
      },
      {
        name: "Royal Palace of Rabat",
        slug: "royal-palace",
        description: "The Royal Palace of Rabat, or Dar al-Makhzen, is the official residence of the King of Morocco. While the palace itself is not open to the public, visitors can admire its impressive entrance and watch the Royal Guard. The palace complex includes a mosque, a college, and extensive gardens. The palace was built in 1864 and has been expanded and renovated over the years. Its architecture combines traditional Moroccan elements with modern features.",
        shortDescription: "Official residence of the King with impressive facades, Royal Guards, and beautiful surroundings.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Palais_Royal_Rabat.jpg/1280px-Palais_Royal_Rabat.jpg",
        location: "Avenue Mohammed V, Rabat",
        openingHours: "External viewing only",
        latitude: "34.0147",
        longitude: "-6.8303",
        vrModelUrl: "/vr/royal-palace.gltf",
        vrSceneConfig: {
          cameraPosition: { x: 0, y: 1.6, z: 10 },
          lightIntensity: 1.0,
          environmentMap: "day"
        }
      },
      {
        name: "Salé Medina",
        slug: "sale-medina",
        description: "The Salé Medina is located in Rabat's sister city of Salé, just across the Bou Regreg River. This traditional walled medina is less visited by tourists than Rabat's medina, offering a more authentic experience. It features the Great Mosque of Salé (built in the 12th century), the Medersa (14th-century Islamic school), traditional souks, and the Bab Mrisa, a monumental gate facing the river.",
        shortDescription: "Traditional walled old city across the river from Rabat with authentic markets and historic architecture.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Bab_Mrisa_Sale.jpg/1280px-Bab_Mrisa_Sale.jpg",
        location: "Salé, Rabat-Salé-Kénitra",
        openingHours: "Open 24 hours",
        latitude: "34.0378",
        longitude: "-6.8165",
        vrModelUrl: "/vr/sale-medina.gltf",
        vrSceneConfig: {
          cameraPosition: { x: 0, y: 1.6, z: 5 },
          lightIntensity: 1.0,
          environmentMap: "day"
        }
      },
      {
        name: "Bab Rouah",
        slug: "bab-rouah",
        description: "Bab Rouah, which means 'Gate of the Winds', is one of the most beautiful monumental gates of Rabat's city walls. Built in the 12th century during the Almohad era, it is considered a masterpiece of Almohad architecture. Today, the interior of the gate houses an art gallery where temporary exhibitions are often held. The gate is characterized by its horseshoe arches and intricate decorative carvings.",
        shortDescription: "Imposing 12th-century city gate with beautiful Almohad architecture, now functioning as an art gallery.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Bab_Rouah.jpg/1280px-Bab_Rouah.jpg",
        location: "Avenue Al Marinyeen, Rabat",
        openingHours: "9:00 AM - 5:00 PM, Closed on Mondays",
        latitude: "34.0122",
        longitude: "-6.8365",
        vrModelUrl: "/vr/bab-rouah.gltf",
        vrSceneConfig: {
          cameraPosition: { x: 0, y: 1.6, z: 5 },
          lightIntensity: 1.0,
          environmentMap: "day"
        }
      }
    ];

    defaultLandmarks.forEach(landmark => {
      this.createLandmark(landmark);
    });
  }
}

export const storage = new MemStorage();
