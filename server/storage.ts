import { type User, type InsertUser, type Taxonomy, type InsertTaxonomy } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Taxonomy operations
  getTaxonomy(id: string): Promise<Taxonomy | undefined>;
  getTaxonomies(ownerId?: string): Promise<Taxonomy[]>;
  getPublicTaxonomies(): Promise<Taxonomy[]>;
  createTaxonomy(taxonomy: InsertTaxonomy): Promise<Taxonomy>;
  updateTaxonomy(id: string, updates: Partial<Taxonomy>): Promise<Taxonomy | undefined>;
  deleteTaxonomy(id: string): Promise<boolean>;
  cloneTaxonomy(id: string, newOwnerId: string): Promise<Taxonomy | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private taxonomies: Map<string, Taxonomy>;

  constructor() {
    this.users = new Map();
    this.taxonomies = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Taxonomy operations
  async getTaxonomy(id: string): Promise<Taxonomy | undefined> {
    return this.taxonomies.get(id);
  }

  async getTaxonomies(ownerId?: string): Promise<Taxonomy[]> {
    const allTaxonomies = Array.from(this.taxonomies.values());
    if (ownerId) {
      return allTaxonomies.filter(taxonomy => taxonomy.ownerId === ownerId);
    }
    return allTaxonomies;
  }

  async getPublicTaxonomies(): Promise<Taxonomy[]> {
    return Array.from(this.taxonomies.values()).filter(taxonomy => 
      taxonomy.isPublic || taxonomy.sharingType === 'public'
    );
  }

  async createTaxonomy(insertTaxonomy: InsertTaxonomy): Promise<Taxonomy> {
    const id = randomUUID();
    const now = new Date();
    const taxonomy: Taxonomy = { 
      ...insertTaxonomy,
      id,
      // Ensure nullable fields are properly cast
      md5Hash: insertTaxonomy.md5Hash ?? null,
      uuid: insertTaxonomy.uuid ?? null,
      title: insertTaxonomy.title ?? null,
      description: insertTaxonomy.description ?? null,
      parentId: insertTaxonomy.parentId ?? null,
      createdAt: now,
      updatedAt: now
    };
    this.taxonomies.set(id, taxonomy);
    return taxonomy;
  }

  async updateTaxonomy(id: string, updates: Partial<Taxonomy>): Promise<Taxonomy | undefined> {
    const existing = this.taxonomies.get(id);
    if (!existing) return undefined;
    
    const updated: Taxonomy = { 
      ...existing, 
      ...updates, 
      id: existing.id, // Preserve ID
      createdAt: existing.createdAt, // Preserve creation date
      updatedAt: new Date() 
    };
    this.taxonomies.set(id, updated);
    return updated;
  }

  async deleteTaxonomy(id: string): Promise<boolean> {
    return this.taxonomies.delete(id);
  }

  async cloneTaxonomy(id: string, newOwnerId: string): Promise<Taxonomy | undefined> {
    const original = this.taxonomies.get(id);
    if (!original) return undefined;

    // Create clone with new ID and owner, reset sharing to private
    const cloneId = randomUUID();
    const now = new Date();
    const clone: Taxonomy = {
      ...original,
      id: cloneId,
      ownerId: newOwnerId,
      sharingType: 'private',
      isPublic: false,
      sharedUsers: [],
      sharedRealms: [],
      // Generate new timestamp for the clone
      timestamp: now.getFullYear().toString() + 
                (now.getMonth() + 1).toString().padStart(2, '0') + 
                now.getDate().toString().padStart(2, '0') + 
                now.getHours().toString().padStart(2, '0') + 
                now.getMinutes().toString().padStart(2, '0') + 
                now.getSeconds().toString().padStart(2, '0'),
      createdAt: now,
      updatedAt: now
    };

    this.taxonomies.set(cloneId, clone);
    return clone;
  }
}

export const storage = new MemStorage();
