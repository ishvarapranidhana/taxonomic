import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Filter, Grid, List } from 'lucide-react'
import TaxonomicHierarchy, { TaxonomicNode } from '@/components/TaxonomicHierarchy'
import ProvenanceChain, { ProvenanceEntry } from '@/components/ProvenanceChain'

// Extended mock data
const mockTaxonomies: TaxonomicNode[] = [
  {
    id: 'taxonomy-1',
    domainSuffix: 'ACME.COM',
    projectId: 'ACME-MARKETING2023',
    aspectTags: ['MARKETING', 'BRANDING'],
    areaHierarchies: ['UX', 'SOFTWARE'],
    childNodes: ['WEBSITE'],
    timestamp: '20231003070000',
    md5Hash: 'a1b2c3d4e5f6',
    uuid: 'uuid-123-456-789',
    children: [
      {
        id: 'taxonomy-1-1',
        domainSuffix: 'ACME.COM',
        projectId: 'ACME-MARKETING2023-SOCIAL',
        aspectTags: ['MARKETING', 'SOCIAL'],
        areaHierarchies: ['UX'],
        childNodes: ['FACEBOOK', 'TWITTER'],
        timestamp: '20231003080000',
        md5Hash: 'b2c3d4e5f6a1',
        uuid: 'uuid-234-567-890'
      },
      {
        id: 'taxonomy-1-2',
        domainSuffix: 'ACME.COM',
        projectId: 'ACME-MARKETING2023-EMAIL',
        aspectTags: ['MARKETING', 'EMAIL'],
        areaHierarchies: ['SOFTWARE'],
        childNodes: ['CAMPAIGNS', 'AUTOMATION'],
        timestamp: '20231003085000',
        md5Hash: 'c3d4e5f6a1b2',
        uuid: 'uuid-345-678-901'
      }
    ]
  },
  {
    id: 'taxonomy-2',
    domainSuffix: 'CATALOG.ORG',
    projectId: 'CATALOG-BIRDS',
    aspectTags: ['BIOLOGY', 'TAXONOMY'],
    areaHierarchies: ['AVIAN', 'CLASSIFICATION'],
    childNodes: ['SPECIES'],
    timestamp: '20231003090000',
    md5Hash: 'd4e5f6a1b2c3',
    uuid: 'uuid-456-789-012',
    children: [
      {
        id: 'taxonomy-2-1',
        domainSuffix: 'CATALOG.ORG',
        projectId: 'CATALOG-BIRDS-MIGRATION',
        aspectTags: ['BIOLOGY', 'BEHAVIOR'],
        areaHierarchies: ['AVIAN', 'RESEARCH'],
        childNodes: ['PATTERNS', 'ROUTES'],
        timestamp: '20231003095000',
        md5Hash: 'e5f6a1b2c3d4',
        uuid: 'uuid-567-890-123'
      }
    ]
  },
  {
    id: 'taxonomy-3',
    domainSuffix: 'MOVIEPLATFORM',
    projectId: 'MOVIE-TRANSACTIONS',
    aspectTags: ['BUSINESS', 'FINANCE'],
    areaHierarchies: ['PAYMENTS', 'ANALYTICS'],
    childNodes: ['SUBSCRIPTIONS'],
    timestamp: '20231003100000',
    md5Hash: 'f6a1b2c3d4e5',
    uuid: 'uuid-678-901-234'
  }
]

const mockProvenance: ProvenanceEntry[] = [
  {
    id: 'prov-1',
    uuid: 'uuid-123-456-789',
    actor: 'Dr. Sarah Chen',
    actorType: 'USER',
    role: 'admin',
    action: 'create',
    timestamp: '2023-10-03T07:00:00Z',
    md5Hash: 'a1b2c3d4e5f6'
  },
  {
    id: 'prov-2',
    uuid: 'uuid-234-567-890',
    actor: 'Taxonomy Agent v2.1',
    actorType: 'AGENT',
    role: 'refiner',
    action: 'update',
    timestamp: '2023-10-03T08:15:00Z',
    md5Hash: 'b2c3d4e5f6a1'
  }
]

export default function TaxonomiesPage() {
  const [selectedTaxonomy, setSelectedTaxonomy] = useState<TaxonomicNode | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [searchQuery, setSearchQuery] = useState('')

  const handleTaxonomySelect = (node: TaxonomicNode) => {
    setSelectedTaxonomy(node)
    console.log('Selected taxonomy:', node)
  }

  const filteredTaxonomies = mockTaxonomies.filter(taxonomy =>
    !searchQuery ||
    taxonomy.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    taxonomy.domainSuffix.toLowerCase().includes(searchQuery.toLowerCase()) ||
    taxonomy.aspectTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="p-6 space-y-6" data-testid="taxonomies-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Browse Taxonomies</h1>
          <p className="text-muted-foreground">
            Explore and manage hierarchical taxonomic structures
          </p>
        </div>
        <Button data-testid="button-create-taxonomy">
          <Plus className="w-4 h-4 mr-2" />
          Create Taxonomy
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search taxonomies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-taxonomies"
            />
          </div>
          <Button variant="outline" data-testid="button-filters">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              data-testid="button-list-view"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              data-testid="button-grid-view"
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Taxonomies List */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <TaxonomicHierarchy
              nodes={filteredTaxonomies}
              title="Taxonomic Hierarchies"
              onNodeSelect={handleTaxonomySelect}
            />
          </Card>
        </div>

        {/* Details Panel */}
        <div className="space-y-4">
          {selectedTaxonomy ? (
            <>
              {/* Taxonomy Details */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Taxonomy Details</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Project ID</div>
                    <div className="font-mono text-sm">{selectedTaxonomy.projectId}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Domain</div>
                    <div className="font-mono text-sm">{selectedTaxonomy.domainSuffix}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">MD5 Hash</div>
                    <div className="font-mono text-sm">{selectedTaxonomy.md5Hash}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">UUID</div>
                    <div className="font-mono text-sm">{selectedTaxonomy.uuid}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Timestamp</div>
                    <div className="font-mono text-sm">{selectedTaxonomy.timestamp}</div>
                  </div>
                </div>
              </Card>

              {/* Provenance Chain */}
              <Card className="p-6">
                <ProvenanceChain
                  entries={mockProvenance}
                  title="Provenance Chain"
                  compact
                />
              </Card>
            </>
          ) : (
            <Card className="p-6">
              <div className="text-center text-muted-foreground">
                <div className="mb-2">Select a taxonomy to view details</div>
                <div className="text-sm">Click on any taxonomy item to see its provenance chain and metadata</div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}