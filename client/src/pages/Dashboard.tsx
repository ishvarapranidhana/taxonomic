import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import TaxonomicHierarchy, { TaxonomicNode } from '@/components/TaxonomicHierarchy'
import ProvenanceChain, { ProvenanceEntry } from '@/components/ProvenanceChain'
import { GitBranch, Users, Activity, Database, Plus, Eye } from 'lucide-react'

// Mock data for demonstration
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
    md5Hash: 'c3d4e5f6a1b2',
    uuid: 'uuid-345-678-901'
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
    md5Hash: 'a1b2c3d4e5f6',
    metadata: {
      source: 'Manual entry',
      validated: true,
      approvedBy: 'system'
    }
  },
  {
    id: 'prov-2',
    uuid: 'uuid-234-567-890',
    actor: 'Taxonomy Agent v2.1',
    actorType: 'AGENT',
    role: 'refiner',
    action: 'update',
    timestamp: '2023-10-03T08:15:00Z',
    md5Hash: 'b2c3d4e5f6a1',
    metadata: {
      refinements: ['aspect_tag_optimization', 'hierarchy_validation'],
      confidence: 0.94
    }
  },
  {
    id: 'prov-3',
    uuid: 'uuid-345-678-901',
    actor: 'Mike Johnson',
    actorType: 'USER',
    role: 'editor',
    action: 'view',
    timestamp: '2023-10-03T09:30:00Z'
  }
]

export default function Dashboard() {
  const [selectedTaxonomy, setSelectedTaxonomy] = useState<TaxonomicNode | null>(null)

  const handleTaxonomySelect = (node: TaxonomicNode) => {
    setSelectedTaxonomy(node)
    console.log('Selected taxonomy:', node)
  }

  return (
    <div className="space-y-6 p-6" data-testid="dashboard-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Taxonomic Framework Dashboard</h1>
          <p className="text-muted-foreground">
            Manage hierarchical identifications, provenance tracking, and federated IDs
          </p>
        </div>
        <div className="flex gap-2">
          <Button data-testid="button-create-taxonomy">
            <Plus className="w-4 h-4 mr-2" />
            Create Taxonomy
          </Button>
          <Button variant="outline" data-testid="button-import-data">
            Import Data
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-primary" />
            <div>
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-sm text-muted-foreground">Active Taxonomies</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">23</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            <div>
              <div className="text-2xl font-bold">156</div>
              <div className="text-sm text-muted-foreground">Recent Activities</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-orange-500" />
            <div>
              <div className="text-2xl font-bold">8.7 GB</div>
              <div className="text-sm text-muted-foreground">Storage Used</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Taxonomic Hierarchy */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Taxonomies</h2>
              <Badge variant="outline">{mockTaxonomies.length} items</Badge>
            </div>
            <TaxonomicHierarchy
              nodes={mockTaxonomies}
              onNodeSelect={handleTaxonomySelect}
            />
          </Card>
        </div>

        {/* Provenance Chain */}
        <div>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Provenance Activity</h2>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                View All
              </Button>
            </div>
            <ProvenanceChain entries={mockProvenance} compact />
          </Card>
        </div>
      </div>

      {/* Selected Taxonomy Details */}
      {selectedTaxonomy && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Selected Taxonomy Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Project ID</div>
              <div className="font-mono text-sm">{selectedTaxonomy.projectId}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Domain</div>
              <div className="font-mono text-sm">{selectedTaxonomy.domainSuffix}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">MD5 Hash</div>
              <div className="font-mono text-sm">{selectedTaxonomy.md5Hash}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Timestamp</div>
              <div className="font-mono text-sm">{selectedTaxonomy.timestamp}</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}