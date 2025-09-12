# Taxonomic Framework Platform

## Overview

This project is a comprehensive platform for managing hierarchical taxonomic identification systems. It implements the **Taxonomic Framework** as described in the technical report - a unified system for hierarchical identification, retrieval, AI prompting, and federated provenance tracking. 

The platform provides BNF-compliant validation for taxonomic IDs, hierarchical visualization, provenance tracking with UUID-based metadata and MD5 hash chains, and comprehensive search capabilities. It's designed to serve enterprise needs for consistent asset identification across APIs, documents, databases, and AI prompts while ensuring reproducibility and auditability.

The system supports multiple taxonomic templates including library science (Dewey Decimal Classification), biological classification systems, and W3C standards, with formal mappings to RDF/OWL/SKOS for semantic interoperability.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
**React-based SPA with TypeScript**: Built using Vite for development and bundling, with React Router (Wouter) for client-side routing. The UI follows a component-driven architecture with a comprehensive design system based on shadcn/ui and Radix UI primitives.

**Component Library**: Extensive UI component library including specialized components for taxonomic hierarchy visualization, BNF validation, provenance chain tracking, search interfaces, and documentation panels. Components are designed with accessibility in mind using Radix UI primitives.

**Styling System**: Tailwind CSS with custom design tokens following the technical platform design guidelines. Includes light/dark theme support with CSS custom properties and a sophisticated color palette optimized for hierarchical data display.

**State Management**: TanStack Query for server state management, React hooks for local component state, and context providers for global UI state (theme, sidebar).

### Backend Architecture
**Express.js REST API**: Node.js backend using Express with TypeScript. Currently implements a minimal API structure with placeholder routes, designed for extensibility.

**Modular Storage Interface**: Abstract storage interface (IStorage) with initial in-memory implementation, designed to be easily replaced with database-backed storage for taxonomic data, user management, and provenance tracking.

**Database Integration Ready**: Configured for PostgreSQL with Drizzle ORM, including migration support and connection pooling via Neon serverless.

### Data Storage Solutions
**PostgreSQL Database**: Configured with Drizzle ORM for type-safe database operations. Schema includes user management tables with extensibility for taxonomic data models.

**Schema Design**: Currently includes basic user authentication schema, with plans to extend for taxonomic hierarchies, provenance chains, and metadata storage.

**Migration System**: Drizzle Kit configured for database schema management and migrations.

### Authentication and Authorization
**Session-based Authentication**: Prepared infrastructure for user authentication using the storage interface pattern.

**Role-based Access Control**: UI components support role-based rendering (admin, editor, viewer) for different taxonomic management capabilities.

### Key Architectural Features
**BNF Grammar Validation**: Client-side validation for taxonomic ID syntax according to the defined BNF grammar, with real-time feedback and component-level validation.

**Hierarchical Data Visualization**: Specialized React components for rendering taxonomic trees with expand/collapse functionality, provenance tracking, and hierarchical navigation.

**Template System**: Pre-defined taxonomic templates for different domains (library science, biological classification, W3C standards) with customizable application.

**Search and Discovery**: Advanced search interface with faceted filtering, relevance scoring, and export capabilities for different semantic formats (RDF, OWL, SKOS).

**Provenance Tracking**: UUID-based federated provenance with MD5 hash chains for audit trails and collaborative workflow tracking.

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with TypeScript support
- **Express.js**: Backend web framework for Node.js
- **Vite**: Build tool and development server with fast HMR

### Database and ORM
- **@neondatabase/serverless**: Serverless PostgreSQL client for Neon database
- **drizzle-orm**: Type-safe ORM for PostgreSQL with schema management
- **drizzle-kit**: Database migration and schema management tool

### UI Component Libraries
- **@radix-ui/***: Comprehensive collection of accessible UI primitives (accordion, dialog, dropdown-menu, navigation-menu, etc.)
- **@tanstack/react-query**: Server state management and data fetching
- **wouter**: Lightweight React router
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating component variants
- **lucide-react**: Icon library with taxonomic and scientific icons

### Form and Validation
- **react-hook-form**: Form state management and validation
- **@hookform/resolvers**: Form validation resolvers
- **zod**: TypeScript-first schema validation
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation

### Development and Build Tools
- **typescript**: Type checking and compilation
- **esbuild**: Fast JavaScript/TypeScript bundler for server builds
- **postcss**: CSS processing with autoprefixer
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling for Replit environment

### Specialized Libraries
- **cmdk**: Command palette and search interface components
- **date-fns**: Date manipulation and formatting utilities
- **clsx**: Conditional CSS class composition
- **@types/memoizee**: TypeScript definitions for memoization utilities

The platform is designed as a cloud-architected solution with serverless database connectivity, optimized for both development in Replit and production deployment scenarios.