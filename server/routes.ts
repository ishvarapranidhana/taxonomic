import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaxonomySchema } from "@shared/schema";
import { z } from "zod";

// Update schema for taxonomy updates (excludes server-managed fields)
const updateTaxonomySchema = z.object({
  domainSuffix: z.string().optional(),
  projectId: z.string().optional(),
  aspectTags: z.array(z.string()).optional(),
  areaHierarchies: z.array(z.string()).optional(),
  childNodes: z.array(z.string()).optional(),
  timestamp: z.string().optional(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  sharingType: z.enum(['private', 'public', 'users', 'realms']).optional(),
  isPublic: z.boolean().optional(),
  sharedUsers: z.array(z.string()).optional(),
  sharedRealms: z.array(z.string()).optional(),
  parentId: z.string().nullable().optional()
  // Exclude: id, ownerId, createdAt, updatedAt, md5Hash, uuid (server-managed)
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Taxonomy routes
  // GET /api/taxonomies - Get all taxonomies (with optional owner filter)
  app.get("/api/taxonomies", async (req, res) => {
    try {
      const ownerId = req.query.ownerId as string;
      const taxonomies = await storage.getTaxonomies(ownerId);
      res.json(taxonomies);
    } catch (error) {
      console.error("Error fetching taxonomies:", error);
      res.status(500).json({ error: "Failed to fetch taxonomies" });
    }
  });

  // GET /api/taxonomies/public - Get public taxonomies
  app.get("/api/taxonomies/public", async (req, res) => {
    try {
      const taxonomies = await storage.getPublicTaxonomies();
      res.json(taxonomies);
    } catch (error) {
      console.error("Error fetching public taxonomies:", error);
      res.status(500).json({ error: "Failed to fetch public taxonomies" });
    }
  });

  // GET /api/taxonomies/:id - Get specific taxonomy
  app.get("/api/taxonomies/:id", async (req, res) => {
    try {
      const taxonomy = await storage.getTaxonomy(req.params.id);
      if (!taxonomy) {
        return res.status(404).json({ error: "Taxonomy not found" });
      }
      res.json(taxonomy);
    } catch (error) {
      console.error("Error fetching taxonomy:", error);
      res.status(500).json({ error: "Failed to fetch taxonomy" });
    }
  });

  // POST /api/taxonomies - Create new taxonomy
  app.post("/api/taxonomies", async (req, res) => {
    try {
      const validatedData = insertTaxonomySchema.parse(req.body);
      const taxonomy = await storage.createTaxonomy(validatedData);
      res.status(201).json(taxonomy);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error creating taxonomy:", error);
      res.status(500).json({ error: "Failed to create taxonomy" });
    }
  });

  // PUT /api/taxonomies/:id - Update taxonomy
  app.put("/api/taxonomies/:id", async (req, res) => {
    try {
      // Validate request body with schema that excludes server-managed fields
      const validatedData = updateTaxonomySchema.parse(req.body);
      
      // TODO: Add authorization check - verify ownership or sharing permissions
      // For now, using stub user
      const currentUserId = req.headers['x-user-id'] as string || 'current-user';
      
      const taxonomy = await storage.updateTaxonomy(req.params.id, validatedData);
      if (!taxonomy) {
        return res.status(404).json({ error: "Taxonomy not found" });
      }
      res.json(taxonomy);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error updating taxonomy:", error);
      res.status(500).json({ error: "Failed to update taxonomy" });
    }
  });

  // DELETE /api/taxonomies/:id - Delete taxonomy
  app.delete("/api/taxonomies/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTaxonomy(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Taxonomy not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting taxonomy:", error);
      res.status(500).json({ error: "Failed to delete taxonomy" });
    }
  });

  // POST /api/taxonomies/:id/clone - Clone taxonomy
  app.post("/api/taxonomies/:id/clone", async (req, res) => {
    try {
      // Get current user from headers (stub implementation)
      const currentUserId = req.headers['x-user-id'] as string || 'current-user';
      const newOwnerId = req.body.newOwnerId || currentUserId;
      
      // TODO: Add authorization check - verify access to original taxonomy
      
      const clonedTaxonomy = await storage.cloneTaxonomy(req.params.id, newOwnerId);
      if (!clonedTaxonomy) {
        return res.status(404).json({ error: "Taxonomy not found" });
      }
      res.status(201).json(clonedTaxonomy);
    } catch (error) {
      console.error("Error cloning taxonomy:", error);
      res.status(500).json({ error: "Failed to clone taxonomy" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
