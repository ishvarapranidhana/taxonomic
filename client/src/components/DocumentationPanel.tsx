import { useState } from 'react'
import { Book, Code, Play, Copy, ExternalLink, ChevronRight, ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

export interface APIEndpoint {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  description: string
  parameters?: APIParameter[]
  requestBody?: APIRequestBody
  responses: APIResponse[]
  examples: APIExample[]
}

export interface APIParameter {
  name: string
  type: string
  required: boolean
  description: string
  example?: string
}

export interface APIRequestBody {
  contentType: string
  schema: object
  example: object
}

export interface APIResponse {
  status: number
  description: string
  schema?: object
  example?: object
}

export interface APIExample {
  name: string
  description: string
  request: {
    method: string
    url: string
    headers?: Record<string, string>
    body?: object
  }
  response: {
    status: number
    headers?: Record<string, string>
    body: object
  }
}

interface DocumentationPanelProps {
  endpoints: APIEndpoint[]
  onTryAPI?: (endpoint: APIEndpoint, example: APIExample) => void
}

export default function DocumentationPanel({ endpoints, onTryAPI }: DocumentationPanelProps) {
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState('rest')
  const { toast } = useToast()

  const toggleEndpoint = (endpointId: string) => {
    const newExpanded = new Set(expandedEndpoints)
    if (newExpanded.has(endpointId)) {
      newExpanded.delete(endpointId)
    } else {
      newExpanded.add(endpointId)
    }
    setExpandedEndpoints(newExpanded)
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast({ title: 'Copied to clipboard', description: 'Code example copied successfully' })
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-500'
      case 'POST': return 'bg-blue-500'
      case 'PUT': return 'bg-yellow-500'
      case 'DELETE': return 'bg-red-500'
      case 'PATCH': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const tryAPI = (endpoint: APIEndpoint, example: APIExample) => {
    onTryAPI?.(endpoint, example)
    console.log('API test triggered:', { endpoint: endpoint.path, example: example.name })
  }

  const graphqlExample = `# GraphQL Query Example
query GetTaxonomy($id: String!) {
  taxonomy(id: $id) {
    id
    domainSuffix
    projectId
    aspectTags
    areaHierarchies
    childNodes
    timestamp
    md5Hash
    provenance {
      entries {
        uuid
        actor
        action
        timestamp
      }
    }
  }
}

# Variables
{
  "id": "ACME-MARKETING2023"
}`

  const semanticExamples = {
    rdf: `@prefix tax: <http://taxonomic.framework/ontology#> .
@prefix dc: <http://purl.org/dc/elements/1.1/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<http://taxonomic.framework/ACME.COM/004/ACME-MARKETING2023>
    a tax:TaxonomicNode ;
    tax:domainSuffix "ACME.COM" ;
    tax:projectId "ACME-MARKETING2023" ;
    tax:aspectTags "MARKETING", "BRANDING" ;
    tax:timestamp "20231003070000"^^xsd:dateTime ;
    dc:created "2023-10-03T07:00:00Z"^^xsd:dateTime .`,
    
    owl: `<?xml version="1.0"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:owl="http://www.w3.org/2002/07/owl#"
         xmlns:tax="http://taxonomic.framework/ontology#">
         
  <owl:Class rdf:about="http://taxonomic.framework/ontology#TaxonomicNode">
    <rdfs:label>Taxonomic Node</rdfs:label>
    <rdfs:comment>A node in the hierarchical taxonomy system</rdfs:comment>
  </owl:Class>
  
  <owl:DatatypeProperty rdf:about="http://taxonomic.framework/ontology#domainSuffix">
    <rdfs:domain rdf:resource="http://taxonomic.framework/ontology#TaxonomicNode"/>
    <rdfs:range rdf:resource="http://www.w3.org/2001/XMLSchema#string"/>
  </owl:DatatypeProperty>
  
</rdf:RDF>`,
    
    skos: `@prefix skos: <http://www.w3.org/2004/02/skos/core#> .
@prefix tax: <http://taxonomic.framework/concepts/> .

tax:MARKETING
    a skos:Concept ;
    skos:prefLabel "Marketing"@en ;
    skos:broader tax:BUSINESS ;
    skos:narrower tax:BRANDING, tax:ADVERTISING ;
    skos:inScheme tax:TaxonomicScheme .

tax:BRANDING
    a skos:Concept ;
    skos:prefLabel "Branding"@en ;
    skos:broader tax:MARKETING ;
    skos:inScheme tax:TaxonomicScheme .`
  }

  return (
    <div className="space-y-6" data-testid="documentation-panel">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Book className="w-5 h-5" />
          <h2 className="text-xl font-semibold">API Documentation</h2>
        </div>
        <Badge variant="outline">v1.0</Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rest" data-testid="tab-rest">REST API</TabsTrigger>
          <TabsTrigger value="graphql" data-testid="tab-graphql">GraphQL</TabsTrigger>
          <TabsTrigger value="semantic" data-testid="tab-semantic">Semantic Export</TabsTrigger>
        </TabsList>

        <TabsContent value="rest" className="space-y-4">
          {endpoints.map(endpoint => {
            const isExpanded = expandedEndpoints.has(endpoint.id)
            
            return (
              <Card key={endpoint.id} className="overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover-elevate"
                  onClick={() => toggleEndpoint(endpoint.id)}
                  data-testid={`endpoint-${endpoint.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={`${getMethodColor(endpoint.method)} text-white font-mono text-xs`}>
                        {endpoint.method}
                      </Badge>
                      <code className="font-mono text-sm">{endpoint.path}</code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="border-t">
                    {/* Parameters */}
                    {endpoint.parameters && endpoint.parameters.length > 0 && (
                      <div className="p-4 border-b">
                        <h4 className="font-medium mb-2">Parameters</h4>
                        <div className="space-y-2">
                          {endpoint.parameters.map(param => (
                            <div key={param.name} className="flex items-center gap-4 text-sm">
                              <code className="font-mono bg-muted px-2 py-1 rounded text-xs">
                                {param.name}
                              </code>
                              <Badge variant={param.required ? 'default' : 'secondary'} className="text-xs">
                                {param.type}
                              </Badge>
                              <span className="text-muted-foreground flex-1">{param.description}</span>
                              {param.required && (
                                <Badge variant="destructive" className="text-xs">Required</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Examples */}
                    <div className="p-4">
                      <h4 className="font-medium mb-3">Examples</h4>
                      {endpoint.examples.map(example => (
                        <Card key={example.name} className="mb-4">
                          <div className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-sm">{example.name}</h5>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => tryAPI(endpoint, example)}
                                  data-testid={`button-try-${endpoint.id}-${example.name}`}
                                >
                                  <Play className="w-3 h-3 mr-1" />
                                  Try it
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(JSON.stringify(example.request, null, 2))}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{example.description}</p>
                            
                            <div className="space-y-3">
                              <div>
                                <div className="text-xs font-medium mb-1">Request:</div>
                                <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                                  <code>{JSON.stringify(example.request, null, 2)}</code>
                                </pre>
                              </div>
                              
                              <div>
                                <div className="text-xs font-medium mb-1">Response:</div>
                                <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                                  <code>{JSON.stringify(example.response, null, 2)}</code>
                                </pre>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </TabsContent>
        
        <TabsContent value="graphql" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">GraphQL Query Example</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(graphqlExample)}
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
            </div>
            <pre className="bg-muted p-3 rounded text-sm overflow-x-auto font-mono">
              <code>{graphqlExample}</code>
            </pre>
          </Card>
          
          <Card className="p-4">
            <h3 className="font-medium mb-3">GraphQL Schema</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ExternalLink className="w-4 h-4" />
              <span>GraphQL Playground available at <code>/graphql</code></span>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="semantic" className="space-y-4">
          <div className="grid gap-4">
            {Object.entries(semanticExamples).map(([format, example]) => (
              <Card key={format} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{format.toUpperCase()} Export</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(example)}
                    data-testid={`button-copy-${format}`}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto font-mono">
                  <code>{example}</code>
                </pre>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}