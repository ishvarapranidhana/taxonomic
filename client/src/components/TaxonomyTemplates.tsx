import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { BookOpen, Dna, Globe, Copy, Eye, ChevronRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { TaxonomicNode } from '@/components/TaxonomicHierarchy'

export interface TaxonomyTemplate {
  id: string
  name: string
  description: string
  category: 'library' | 'biological' | 'w3c'
  domainSuffix: string
  projectId: string
  aspectTags: string[]
  areaHierarchies: string[]
  childNodes: string[]
  example: TaxonomicNode
  documentation: string
  useCases: string[]
}

// Library Taxonomy Templates
const libraryTemplates: TaxonomyTemplate[] = [
  {
    id: 'dewey-decimal',
    name: 'Dewey Decimal Classification',
    description: 'Organize knowledge by the 10 main classes of the Dewey Decimal System',
    category: 'library',
    domainSuffix: 'LIBRARY.ORG',
    projectId: 'DDC-KNOWLEDGE',
    aspectTags: ['CLASSIFICATION', 'DEWEY'],
    areaHierarchies: ['KNOWLEDGE', 'ORGANIZATION'],
    childNodes: ['COMPUTER-SCIENCE', 'PHILOSOPHY', 'RELIGION'],
    example: {
      id: 'ddc-example',
      domainSuffix: 'LIBRARY.ORG',
      projectId: 'DDC-COMPUTER-SCIENCE',
      aspectTags: ['CLASSIFICATION', 'DEWEY', 'TECHNOLOGY'],
      areaHierarchies: ['000-099', 'COMPUTER-SCIENCE'],
      childNodes: ['PROGRAMMING', 'DATA-STRUCTURES', 'ALGORITHMS'],
      timestamp: '20231003100000',
      md5Hash: 'ddc123456789',
      uuid: 'uuid-ddc-cs-001'
    },
    documentation: 'The Dewey Decimal Classification (DDC) organizes library materials by subject in ten main classes (000-999). Each class is further subdivided for precise categorization.',
    useCases: ['Library cataloging', 'Academic research organization', 'Digital library systems', 'Knowledge management']
  },
  {
    id: 'library-congress',
    name: 'Library of Congress Classification',
    description: 'Organize materials using the Library of Congress subject classification system',
    category: 'library',
    domainSuffix: 'LOC.GOV',
    projectId: 'LCC-SUBJECT',
    aspectTags: ['CLASSIFICATION', 'LCC'],
    areaHierarchies: ['SUBJECT', 'AUTHORITY'],
    childNodes: ['LITERATURE', 'SCIENCE', 'TECHNOLOGY'],
    example: {
      id: 'lcc-example',
      domainSuffix: 'LOC.GOV',
      projectId: 'LCC-TECHNOLOGY',
      aspectTags: ['CLASSIFICATION', 'LCC', 'TECHNOLOGY'],
      areaHierarchies: ['T-TECHNOLOGY', 'ENGINEERING'],
      childNodes: ['ELECTRICAL', 'MECHANICAL', 'COMPUTER'],
      timestamp: '20231003110000',
      md5Hash: 'lcc987654321',
      uuid: 'uuid-lcc-tech-001'
    },
    documentation: 'Library of Congress Classification uses alphanumeric notation to organize materials by subject. Classes are designated by letters (A-Z) with subclasses using additional letters and numbers.',
    useCases: ['Academic library systems', 'Research collections', 'Government document organization', 'Subject authority control']
  },
  {
    id: 'marc-cataloging',
    name: 'MARC Cataloging Standard',
    description: 'Machine-readable cataloging standard for bibliographic data',
    category: 'library',
    domainSuffix: 'MARC.ORG',
    projectId: 'MARC-BIBLIOGRAPHIC',
    aspectTags: ['CATALOGING', 'MARC', 'METADATA'],
    areaHierarchies: ['BIBLIOGRAPHIC', 'RECORDS'],
    childNodes: ['TITLE', 'AUTHOR', 'SUBJECT'],
    example: {
      id: 'marc-example',
      domainSuffix: 'MARC.ORG',
      projectId: 'MARC-BOOK-RECORD',
      aspectTags: ['CATALOGING', 'MARC', 'MONOGRAPH'],
      areaHierarchies: ['BIBLIOGRAPHIC', 'BOOK'],
      childNodes: ['ISBN', 'CALL-NUMBER', 'SUBJECT-HEADING'],
      timestamp: '20231003120000',
      md5Hash: 'marc123789456',
      uuid: 'uuid-marc-book-001'
    },
    documentation: 'MARC (Machine-Readable Cataloging) is a standard format for bibliographic records. It uses numbered fields to describe various aspects of library materials.',
    useCases: ['Library automation systems', 'Bibliographic databases', 'Interlibrary loan systems', 'Catalog maintenance']
  }
]

// Biological Taxonomy Templates
const biologicalTemplates: TaxonomyTemplate[] = [
  {
    id: 'linnean-taxonomy',
    name: 'Linnaean Taxonomic Hierarchy',
    description: 'Classical biological classification from Kingdom to Species',
    category: 'biological',
    domainSuffix: 'TAXONOMY.BIO',
    projectId: 'LINNEAN-CLASSIFICATION',
    aspectTags: ['BIOLOGY', 'TAXONOMY', 'CLASSIFICATION'],
    areaHierarchies: ['KINGDOM', 'PHYLUM', 'CLASS', 'ORDER', 'FAMILY', 'GENUS', 'SPECIES'],
    childNodes: ['ANIMALIA', 'PLANTAE', 'FUNGI'],
    example: {
      id: 'linnean-example',
      domainSuffix: 'TAXONOMY.BIO',
      projectId: 'HOMO-SAPIENS',
      aspectTags: ['BIOLOGY', 'TAXONOMY', 'MAMMAL'],
      areaHierarchies: ['ANIMALIA', 'CHORDATA', 'MAMMALIA', 'PRIMATES', 'HOMINIDAE', 'HOMO'],
      childNodes: ['SAPIENS'],
      timestamp: '20231003130000',
      md5Hash: 'lin456789123',
      uuid: 'uuid-homo-sapiens-001'
    },
    documentation: 'The Linnaean system organizes living organisms in a hierarchical structure: Kingdom, Phylum, Class, Order, Family, Genus, Species. This provides a universal naming system for biological classification.',
    useCases: ['Species identification', 'Biodiversity research', 'Conservation biology', 'Evolutionary studies']
  },
  {
    id: 'phylogenetic-tree',
    name: 'Phylogenetic Classification',
    description: 'Evolutionary relationship-based taxonomic organization',
    category: 'biological',
    domainSuffix: 'PHYLO.BIO',
    projectId: 'PHYLOGENETIC-TREE',
    aspectTags: ['BIOLOGY', 'PHYLOGENY', 'EVOLUTION'],
    areaHierarchies: ['CLADE', 'BRANCH', 'NODE'],
    childNodes: ['ANCESTRAL', 'DERIVED', 'SISTER-GROUP'],
    example: {
      id: 'phylo-example',
      domainSuffix: 'PHYLO.BIO',
      projectId: 'VERTEBRATE-CLADE',
      aspectTags: ['BIOLOGY', 'PHYLOGENY', 'VERTEBRATE'],
      areaHierarchies: ['CHORDATA', 'VERTEBRATA', 'GNATHOSTOMATA'],
      childNodes: ['TETRAPODA', 'FISH', 'AGNATHA'],
      timestamp: '20231003140000',
      md5Hash: 'phy789123456',
      uuid: 'uuid-vertebrate-001'
    },
    documentation: 'Phylogenetic classification organizes organisms based on evolutionary relationships and shared ancestry, using clades to represent monophyletic groups.',
    useCases: ['Evolutionary biology', 'Comparative genomics', 'Biogeography studies', 'Conservation genetics']
  },
  {
    id: 'ecological-classification',
    name: 'Ecological Classification System',
    description: 'Organize species by ecological roles and habitat relationships',
    category: 'biological',
    domainSuffix: 'ECOLOGY.BIO',
    projectId: 'ECOLOGICAL-NICHE',
    aspectTags: ['ECOLOGY', 'HABITAT', 'NICHE'],
    areaHierarchies: ['BIOME', 'ECOSYSTEM', 'COMMUNITY'],
    childNodes: ['PRODUCER', 'CONSUMER', 'DECOMPOSER'],
    example: {
      id: 'eco-example',
      domainSuffix: 'ECOLOGY.BIO',
      projectId: 'FOREST-ECOSYSTEM',
      aspectTags: ['ECOLOGY', 'FOREST', 'TEMPERATE'],
      areaHierarchies: ['TERRESTRIAL', 'FOREST', 'DECIDUOUS'],
      childNodes: ['CANOPY', 'UNDERSTORY', 'FOREST-FLOOR'],
      timestamp: '20231003150000',
      md5Hash: 'eco123456789',
      uuid: 'uuid-forest-eco-001'
    },
    documentation: 'Ecological classification organizes organisms and environments based on ecological relationships, trophic levels, and habitat characteristics.',
    useCases: ['Ecosystem management', 'Conservation planning', 'Environmental assessment', 'Biodiversity monitoring']
  }
]

// W3C Standards Templates
const w3cTemplates: TaxonomyTemplate[] = [
  {
    id: 'semantic-web',
    name: 'Semantic Web Technologies',
    description: 'W3C standards for machine-readable web data and ontologies',
    category: 'w3c',
    domainSuffix: 'W3C.ORG',
    projectId: 'SEMANTIC-WEB',
    aspectTags: ['SEMANTIC', 'WEB', 'STANDARDS'],
    areaHierarchies: ['RDF', 'OWL', 'SPARQL'],
    childNodes: ['ONTOLOGY', 'VOCABULARY', 'LINKED-DATA'],
    example: {
      id: 'semantic-example',
      domainSuffix: 'W3C.ORG',
      projectId: 'FOAF-VOCABULARY',
      aspectTags: ['SEMANTIC', 'WEB', 'SOCIAL'],
      areaHierarchies: ['RDF', 'VOCABULARY', 'SOCIAL'],
      childNodes: ['PERSON', 'KNOWS', 'DOCUMENT'],
      timestamp: '20231003160000',
      md5Hash: 'sem456789012',
      uuid: 'uuid-foaf-vocab-001'
    },
    documentation: 'W3C Semantic Web standards enable machine-readable data through RDF, OWL ontologies, and SPARQL queries. This creates a web of linked, structured data.',
    useCases: ['Knowledge graphs', 'Data integration', 'AI/ML training data', 'Information retrieval']
  },
  {
    id: 'web-accessibility',
    name: 'Web Accessibility Guidelines',
    description: 'WCAG standards for accessible web content organization',
    category: 'w3c',
    domainSuffix: 'W3C.ORG',
    projectId: 'WCAG-GUIDELINES',
    aspectTags: ['ACCESSIBILITY', 'WCAG', 'STANDARDS'],
    areaHierarchies: ['PERCEIVABLE', 'OPERABLE', 'UNDERSTANDABLE', 'ROBUST'],
    childNodes: ['LEVEL-A', 'LEVEL-AA', 'LEVEL-AAA'],
    example: {
      id: 'wcag-example',
      domainSuffix: 'W3C.ORG',
      projectId: 'WCAG-PERCEIVABLE',
      aspectTags: ['ACCESSIBILITY', 'WCAG', 'PERCEPTION'],
      areaHierarchies: ['PERCEIVABLE', 'TEXT-ALTERNATIVES'],
      childNodes: ['ALT-TEXT', 'CAPTIONS', 'AUDIO-DESCRIPTION'],
      timestamp: '20231003170000',
      md5Hash: 'wca789012345',
      uuid: 'uuid-wcag-perc-001'
    },
    documentation: 'WCAG (Web Content Accessibility Guidelines) provides a framework for making web content accessible to people with disabilities, organized by four principles.',
    useCases: ['Web accessibility compliance', 'Inclusive design', 'Government websites', 'Universal access systems']
  },
  {
    id: 'web-components',
    name: 'Web Components Standard',
    description: 'W3C standards for reusable web interface components',
    category: 'w3c',
    domainSuffix: 'W3C.ORG',
    projectId: 'WEB-COMPONENTS',
    aspectTags: ['COMPONENTS', 'WEB', 'REUSABLE'],
    areaHierarchies: ['CUSTOM-ELEMENTS', 'SHADOW-DOM', 'TEMPLATES'],
    childNodes: ['ELEMENT', 'ATTRIBUTE', 'EVENT'],
    example: {
      id: 'webcomp-example',
      domainSuffix: 'W3C.ORG',
      projectId: 'CUSTOM-BUTTON',
      aspectTags: ['COMPONENTS', 'WEB', 'UI'],
      areaHierarchies: ['CUSTOM-ELEMENTS', 'INTERACTIVE'],
      childNodes: ['CLICK-HANDLER', 'STYLE', 'ACCESSIBILITY'],
      timestamp: '20231003180000',
      md5Hash: 'web012345678',
      uuid: 'uuid-custom-btn-001'
    },
    documentation: 'Web Components standards enable creation of reusable, encapsulated HTML elements using Custom Elements, Shadow DOM, and HTML Templates.',
    useCases: ['Component libraries', 'Design systems', 'Framework-agnostic components', 'Enterprise UI standards']
  }
]

interface TaxonomyTemplatesProps {
  onTemplateSelect?: (template: TaxonomyTemplate) => void
  onTemplateApply?: (template: TaxonomyTemplate) => void
}

export default function TaxonomyTemplates({ onTemplateSelect, onTemplateApply }: TaxonomyTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TaxonomyTemplate | null>(null)
  const [activeTab, setActiveTab] = useState('library')
  const { toast } = useToast()

  const allTemplates = [...libraryTemplates, ...biologicalTemplates, ...w3cTemplates]

  const getTemplatesByCategory = (category: string) => {
    return allTemplates.filter(template => template.category === category)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'library': return <BookOpen className="w-4 h-4" />
      case 'biological': return <Dna className="w-4 h-4" />
      case 'w3c': return <Globe className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'library': return 'bg-blue-500'
      case 'biological': return 'bg-green-500'
      case 'w3c': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const handleTemplateSelect = (template: TaxonomyTemplate) => {
    setSelectedTemplate(template)
    onTemplateSelect?.(template)
  }

  const handleTemplateApply = (template: TaxonomyTemplate) => {
    onTemplateApply?.(template)
    toast({
      title: 'Template Applied',
      description: `${template.name} template has been applied to your taxonomy.`
    })
  }

  const copyTaxonomicId = async (template: TaxonomyTemplate) => {
    const taxonomicId = `${template.domainSuffix}/004/${template.projectId}/${template.aspectTags.join(',')}/${template.areaHierarchies.join(',')}/${template.childNodes.join(',')}/20231003120000`
    await navigator.clipboard.writeText(taxonomicId)
    toast({
      title: 'Copied to clipboard',
      description: 'Template taxonomic ID copied successfully'
    })
  }

  return (
    <div className="space-y-6" data-testid="taxonomy-templates">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Taxonomy Templates</h2>
          <p className="text-muted-foreground">
            Choose from curated templates based on established classification systems
          </p>
        </div>
        <Badge variant="outline" className="font-mono">
          {allTemplates.length} templates
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="library" data-testid="tab-library-templates">
            <BookOpen className="w-4 h-4 mr-2" />
            Library Systems
          </TabsTrigger>
          <TabsTrigger value="biological" data-testid="tab-biological-templates">
            <Dna className="w-4 h-4 mr-2" />
            Biological Classification
          </TabsTrigger>
          <TabsTrigger value="w3c" data-testid="tab-w3c-templates">
            <Globe className="w-4 h-4 mr-2" />
            W3C Standards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getTemplatesByCategory('library').map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={handleTemplateSelect}
                onApply={handleTemplateApply}
                onCopyId={copyTaxonomicId}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="biological" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getTemplatesByCategory('biological').map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={handleTemplateSelect}
                onApply={handleTemplateApply}
                onCopyId={copyTaxonomicId}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="w3c" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getTemplatesByCategory('w3c').map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={handleTemplateSelect}
                onApply={handleTemplateApply}
                onCopyId={copyTaxonomicId}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Detail Dialog */}
      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getCategoryIcon(selectedTemplate.category)}
                {selectedTemplate.name}
                <Badge className={`${getCategoryColor(selectedTemplate.category)} text-white`}>
                  {selectedTemplate.category}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{selectedTemplate.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Documentation</h3>
                <p className="text-sm text-muted-foreground">{selectedTemplate.documentation}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Template Structure</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium">Domain Suffix</div>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{selectedTemplate.domainSuffix}</code>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Project ID</div>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{selectedTemplate.projectId}</code>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Aspect Tags</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedTemplate.aspectTags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Area Hierarchies</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedTemplate.areaHierarchies.map(area => (
                        <Badge key={area} variant="outline" className="text-xs">{area}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Use Cases</h3>
                <ul className="space-y-1">
                  {selectedTemplate.useCases.map((useCase, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <ChevronRight className="w-3 h-3" />
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={() => handleTemplateApply(selectedTemplate)} data-testid="button-apply-template">
                  Apply Template
                </Button>
                <Button variant="outline" onClick={() => copyTaxonomicId(selectedTemplate)}>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy ID
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Template Card Component
interface TemplateCardProps {
  template: TaxonomyTemplate
  onSelect: (template: TaxonomyTemplate) => void
  onApply: (template: TaxonomyTemplate) => void
  onCopyId: (template: TaxonomyTemplate) => void
}

function TemplateCard({ template, onSelect, onApply, onCopyId }: TemplateCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'library': return 'bg-blue-500'
      case 'biological': return 'bg-green-500'
      case 'w3c': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Card className="p-4 hover-elevate" data-testid={`template-card-${template.id}`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm">{template.name}</h3>
              <Badge className={`${getCategoryColor(template.category)} text-white text-xs`}>
                {template.category}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {template.description}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <div className="text-xs font-medium">Example Structure:</div>
            <code className="text-xs bg-muted px-2 py-1 rounded block mt-1 truncate">
              {template.domainSuffix}/004/{template.projectId}/...
            </code>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {template.aspectTags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
            {template.aspectTags.length > 3 && (
              <Badge variant="secondary" className="text-xs">+{template.aspectTags.length - 3}</Badge>
            )}
          </div>
        </div>

        <div className="flex gap-1 pt-2 border-t">
          <Button size="sm" onClick={() => onSelect(template)} data-testid={`button-view-${template.id}`}>
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button size="sm" variant="outline" onClick={() => onApply(template)} data-testid={`button-apply-${template.id}`}>
            Apply
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onCopyId(template)}>
            <Copy className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Card>
  )
}