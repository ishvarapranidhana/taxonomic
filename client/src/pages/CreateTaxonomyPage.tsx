import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import { useLocation } from 'wouter'
import TaxonomyTemplates, { TaxonomyTemplate } from '@/components/TaxonomyTemplates'
import BNFValidator from '@/components/BNFValidator'
import TaxonomicHierarchy, { TaxonomicNode } from '@/components/TaxonomicHierarchy'
import { useToast } from '@/hooks/use-toast'

export default function CreateTaxonomyPage() {
  const [, setLocation] = useLocation()
  const [activeTab, setActiveTab] = useState('templates')
  const [selectedTemplate, setSelectedTemplate] = useState<TaxonomyTemplate | null>(null)
  const [currentTaxonomy, setCurrentTaxonomy] = useState<TaxonomicNode | null>(null)
  const [isValid, setIsValid] = useState(false)
  const [taxonomicId, setTaxonomicId] = useState('')
  const { toast } = useToast()

  const handleTemplateSelect = (template: TaxonomyTemplate) => {
    setSelectedTemplate(template)
    // Switch to builder tab when template is selected
    setActiveTab('builder')
  }

  const handleTemplateApply = (template: TaxonomyTemplate) => {
    setSelectedTemplate(template)
    
    // Create taxonomy from template
    const newTaxonomy: TaxonomicNode = {
      id: `taxonomy-${Date.now()}`,
      domainSuffix: template.domainSuffix,
      projectId: template.projectId,
      aspectTags: template.aspectTags,
      areaHierarchies: template.areaHierarchies,
      childNodes: template.childNodes,
      timestamp: new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14),
      uuid: `uuid-${Date.now()}`,
      md5Hash: Math.random().toString(16).substring(2, 10)
    }
    
    setCurrentTaxonomy(newTaxonomy)
    setActiveTab('builder')
    
    toast({
      title: 'Template Applied',
      description: `${template.name} template has been applied. You can now customize it in the builder.`
    })
  }

  const handleValidationChange = (valid: boolean, taxonomyId: string) => {
    setIsValid(valid)
    setTaxonomicId(taxonomyId)
  }

  const handleSaveTaxonomy = () => {
    if (isValid && taxonomicId) {
      const parts = taxonomicId.split('/')
      if (parts.length >= 7) {
        const newTaxonomy: TaxonomicNode = {
          id: `taxonomy-${Date.now()}`,
          domainSuffix: parts[0],
          projectId: parts[2],
          aspectTags: parts[3].split(',').filter(tag => tag.trim()),
          areaHierarchies: parts[4].split(',').filter(area => area.trim()),
          childNodes: parts[5].split(',').filter(node => node.trim()),
          timestamp: parts[6],
          uuid: `uuid-${Date.now()}`,
          md5Hash: Math.random().toString(16).substring(2, 10)
        }
        
        setCurrentTaxonomy(newTaxonomy)
        setActiveTab('preview')
        
        toast({
          title: 'Taxonomy Created',
          description: 'Your taxonomy has been created successfully. Review it in the preview tab.'
        })
      }
    } else {
      toast({
        title: 'Validation Error',
        description: 'Please ensure all required fields are filled and valid.',
        variant: 'destructive'
      })
    }
  }

  const handleFinalSave = () => {
    if (currentTaxonomy) {
      console.log('Saving taxonomy:', currentTaxonomy)
      toast({
        title: 'Taxonomy Saved',
        description: 'Your taxonomy has been saved to the system.'
      })
      // Navigate back to taxonomies page
      setLocation('/taxonomies')
    }
  }

  return (
    <div className="p-6 space-y-6" data-testid="create-taxonomy-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setLocation('/taxonomies')}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Taxonomy</h1>
            <p className="text-muted-foreground">
              Start with a template or build from scratch using BNF-compliant structure
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentTaxonomy && (
            <Button onClick={handleFinalSave} data-testid="button-save-final">
              <Save className="w-4 h-4 mr-2" />
              Save Taxonomy
            </Button>
          )}
        </div>
      </div>

      {/* Creation Workflow */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates" data-testid="tab-templates">
            1. Choose Template
          </TabsTrigger>
          <TabsTrigger value="builder" data-testid="tab-builder">
            2. Build & Validate
          </TabsTrigger>
          <TabsTrigger value="preview" data-testid="tab-preview">
            3. Preview & Save
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Select a Template</h2>
              <p className="text-sm text-muted-foreground">
                Choose from curated templates or start with a blank taxonomy
              </p>
            </div>
            
            <TaxonomyTemplates 
              onTemplateSelect={handleTemplateSelect}
              onTemplateApply={handleTemplateApply}
            />
            
            <div className="mt-6 pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('builder')}
                data-testid="button-start-blank"
              >
                Start with Blank Taxonomy
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* BNF Builder */}
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Taxonomy Builder</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedTemplate 
                    ? `Building from: ${selectedTemplate.name}`
                    : 'Build your taxonomy using BNF-compliant structure'
                  }
                </p>
              </div>
              
              <BNFValidator 
                onValidationChange={handleValidationChange}
                initialValue={selectedTemplate ? 
                  `${selectedTemplate.domainSuffix}/004/${selectedTemplate.projectId}/${selectedTemplate.aspectTags.join(',')}/${selectedTemplate.areaHierarchies.join(',')}/${selectedTemplate.childNodes.join(',')}/20231003120000` 
                  : ''
                }
              />
              
              <div className="mt-6 flex gap-2">
                <Button 
                  onClick={handleSaveTaxonomy}
                  disabled={!isValid}
                  data-testid="button-create-taxonomy"
                >
                  Create Taxonomy
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('templates')}
                  data-testid="button-back-to-templates"
                >
                  Back to Templates
                </Button>
              </div>
            </Card>

            {/* Template Info */}
            {selectedTemplate && (
              <Card className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{selectedTemplate.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedTemplate.description}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium">Category</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {selectedTemplate.category}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Documentation</div>
                    <p className="text-sm text-muted-foreground">
                      {selectedTemplate.documentation}
                    </p>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Use Cases</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {selectedTemplate.useCases.slice(0, 3).map((useCase, index) => (
                        <li key={index}>• {useCase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          {currentTaxonomy ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Taxonomy Preview */}
              <Card className="p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">Taxonomy Preview</h2>
                  <p className="text-sm text-muted-foreground">
                    Review your taxonomy before saving
                  </p>
                </div>
                
                <TaxonomicHierarchy 
                  nodes={[currentTaxonomy]}
                  title="Created Taxonomy"
                />
              </Card>

              {/* Taxonomy Details */}
              <Card className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Taxonomy Details</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <div className="text-sm font-medium">Domain Suffix</div>
                      <code className="text-xs bg-muted px-2 py-1 rounded block mt-1">
                        {currentTaxonomy.domainSuffix}
                      </code>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Project ID</div>
                      <code className="text-xs bg-muted px-2 py-1 rounded block mt-1">
                        {currentTaxonomy.projectId}
                      </code>
                    </div>
                    <div>
                      <div className="text-sm font-medium">UUID</div>
                      <code className="text-xs bg-muted px-2 py-1 rounded block mt-1">
                        {currentTaxonomy.uuid}
                      </code>
                    </div>
                    <div>
                      <div className="text-sm font-medium">MD5 Hash</div>
                      <code className="text-xs bg-muted px-2 py-1 rounded block mt-1">
                        {currentTaxonomy.md5Hash}
                      </code>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Aspect Tags</div>
                    <div className="flex flex-wrap gap-1">
                      {currentTaxonomy.aspectTags.map(tag => (
                        <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Area Hierarchies</div>
                    <div className="flex flex-wrap gap-1">
                      {currentTaxonomy.areaHierarchies.map(area => (
                        <span key={area} className="text-xs bg-muted px-2 py-1 rounded">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Child Nodes</div>
                    <div className="flex flex-wrap gap-1">
                      {currentTaxonomy.childNodes.map(node => (
                        <span key={node} className="text-xs bg-muted px-2 py-1 rounded">
                          {node}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium mb-2">Full Taxonomic ID</div>
                    <code className="text-xs bg-muted px-2 py-1 rounded block break-all">
                      {`${currentTaxonomy.domainSuffix}/004/${currentTaxonomy.projectId}/${currentTaxonomy.aspectTags.join(',')}/${currentTaxonomy.areaHierarchies.join(',')}/${currentTaxonomy.childNodes.join(',')}/${currentTaxonomy.timestamp}`}
                    </code>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-2">
                  <Button onClick={handleFinalSave} data-testid="button-confirm-save">
                    <Save className="w-4 h-4 mr-2" />
                    Confirm & Save
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('builder')}
                    data-testid="button-edit-more"
                  >
                    Edit More
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-6 text-center">
              <div className="space-y-4">
                <Eye className="w-12 h-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">No Taxonomy Created Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Go back to the builder tab to create your taxonomy
                  </p>
                </div>
                <Button onClick={() => setActiveTab('builder')}>
                  Go to Builder
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}