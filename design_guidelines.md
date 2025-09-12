# Taxonomic Framework Platform Design Guidelines

## Design Approach
**Reference-Based Approach** - Drawing inspiration from enterprise data platforms like Notion (hierarchical organization), Linear (clean taxonomy displays), and GitHub (technical documentation interfaces) to create a professional, data-centric experience.

## Core Design Principles
- **Hierarchical Clarity**: Visual representation of taxonomic relationships through indentation, connecting lines, and nested structures
- **Technical Precision**: Clean, systematic layouts that reflect the scientific nature of taxonomic classification
- **Administrative Control**: Clear separation between backoffice management and user-facing interfaces

## Color Palette
### Light Mode
- **Primary**: 220 85% 25% (deep blue for trust and authority)
- **Secondary**: 220 15% 45% (neutral gray for data display)
- **Accent**: 160 45% 50% (muted teal for hierarchical connections)
- **Background**: 220 5% 98% (near-white with subtle cool tone)

### Dark Mode
- **Primary**: 220 75% 65% (lighter blue maintaining contrast)
- **Secondary**: 220 8% 65% (medium gray for readability)
- **Accent**: 160 35% 65% (softer teal for dark backgrounds)
- **Background**: 220 15% 8% (deep blue-black for technical feel)

## Typography
- **Primary**: Inter (clean, technical readability)
- **Monospace**: JetBrains Mono (for taxonomic IDs, hashes, and technical data)
- **Sizes**: Consistent 14px base with 16px for content, 12px for metadata

## Layout System
**Tailwind Spacing**: Primary units of 2, 4, 6, and 8 for consistent rhythm
- Headers: p-6, sections: p-4, cards: p-4, tight spacing: p-2

## Component Library

### Navigation
- **Backoffice**: Sidebar with taxonomic tree navigation, breadcrumb trails for deep hierarchies
- **User Interface**: Top navigation with search-first approach, filtered category access
- **Documentation**: Tabbed interface with live API testing panels

### Data Display
- **Taxonomic Trees**: Expandable/collapsible hierarchy with connecting lines
- **ID Cards**: Monospace display for taxonomic identifiers with copy functionality
- **Provenance Chains**: Timeline-style UUID tracking with hash verification indicators
- **Search Results**: Grid layout with taxonomic path context

### Forms & Controls
- **Taxonomy Creation**: Multi-step wizard with BNF validation feedback
- **Search Interface**: Prominent search bar with faceted filtering options
- **Admin Controls**: Toggle switches for permissions, dropdown selectors for realms

### Overlays
- **Modal Dialogs**: For detailed taxonomic information, provenance details
- **Documentation Panels**: Slide-out API reference with interactive examples

## Visual Hierarchy
- **Primary Actions**: Solid buttons with primary color
- **Secondary Actions**: Outline buttons with transparent backgrounds on images
- **Taxonomic Levels**: Visual depth through subtle shadows and indentation
- **Data Relationships**: Connecting lines and grouped card layouts

## Images
No large hero images required. Focus on:
- **Icon System**: Heroicons for UI elements, custom taxonomic symbols as placeholders
- **Data Visualizations**: Simple tree diagrams, network graphs for relationships
- **Status Indicators**: Small visual cues for validation states, provenance verification

## Specialized Features
- **Hierarchical Breadcrumbs**: Show full taxonomic path with clickable segments
- **Hash Chain Visualization**: Linear progress indicators for provenance validation
- **Multi-realm Switching**: Clean realm selector with current context display
- **Real-time Validation**: Inline feedback for BNF compliance during taxonomy creation

This design emphasizes the technical, systematic nature of taxonomic classification while maintaining usability across administrative and user-facing interfaces.