import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User authentication schema (keeping original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Landmarks schema
export const landmarks = pgTable("landmarks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  imageUrl: text("image_url").notNull(),
  location: text("location").notNull(),
  openingHours: text("opening_hours").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  vrModelUrl: text("vr_model_url"),
  vrSceneConfig: jsonb("vr_scene_config"),
});

export const insertLandmarkSchema = createInsertSchema(landmarks).omit({
  id: true,
});

export type InsertLandmark = z.infer<typeof insertLandmarkSchema>;
export type Landmark = typeof landmarks.$inferSelect;
