import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Taxonomy sharing types
export const SharingType = {
  PRIVATE: 'private',
  PUBLIC: 'public', 
  USERS: 'users',
  REALMS: 'realms'
} as const;

export type SharingTypeValues = typeof SharingType[keyof typeof SharingType];

export const taxonomies = pgTable("taxonomies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  domainSuffix: text("domain_suffix").notNull(),
  projectId: text("project_id").notNull(),
  aspectTags: text("aspect_tags").array().notNull(),
  areaHierarchies: text("area_hierarchies").array().notNull(),
  childNodes: text("child_nodes").array().notNull(),
  timestamp: text("timestamp").notNull(),
  md5Hash: text("md5_hash"),
  uuid: text("uuid"),
  
  // Metadata
  title: text("title"),
  description: text("description"),
  
  // Sharing and permissions
  sharingType: text("sharing_type").notNull().default(SharingType.PRIVATE),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  sharedUsers: text("shared_users").array().default([]),
  sharedRealms: text("shared_realms").array().default([]),
  isPublic: boolean("is_public").default(false),
  
  // Hierarchical data
  parentId: varchar("parent_id").references(() => taxonomies.id),
  
  // System fields
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTaxonomySchema = createInsertSchema(taxonomies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTaxonomy = z.infer<typeof insertTaxonomySchema>;
export type Taxonomy = typeof taxonomies.$inferSelect;
