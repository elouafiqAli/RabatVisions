import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Get all landmarks
  app.get("/api/landmarks", async (req, res) => {
    try {
      const landmarks = await storage.getLandmarks();
      res.json(landmarks);
    } catch (error) {
      console.error("Error fetching landmarks:", error);
      res.status(500).json({ message: "Failed to fetch landmarks" });
    }
  });

  // Get landmark by slug
  app.get("/api/landmarks/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const landmark = await storage.getLandmarkBySlug(slug);
      
      if (!landmark) {
        return res.status(404).json({ message: "Landmark not found" });
      }
      
      res.json(landmark);
    } catch (error) {
      console.error("Error fetching landmark:", error);
      res.status(500).json({ message: "Failed to fetch landmark" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
