import { useState } from 'react'
import { Search, Filter, X, Download, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export interface SearchFilter {
  id: string
  label: string
  value: string
  type: 'domain' | 'aspect' | 'area' | 'timestamp' | 'project'
}

export interface SearchResult {
  id: string
  taxonomicId: string
  projectId: string
  domainSuffix: string
  aspectTags: string[]
  timestamp: string
  relevanceScore?: number
  md5Hash?: string
}

interface SearchInterfaceProps {
  onSearch?: (query: string, filters: SearchFilter[]) => void
  onResultSelect?: (result: SearchResult) => void
  onExport?: (format: 'RDF' | 'OWL' | 'SKOS') => void
  results?: SearchResult[]
  isLoading?: boolean
}

export default function SearchInterface({ 
  onSearch, 
  onResultSelect, 
  onExport,
  results = [],
  isLoading = false 
}: SearchInterfaceProps) {
  const [query, setQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<SearchFilter[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = () => {
    onSearch?.(query, activeFilters)
    console.log('Search triggered:', { query, filters: activeFilters })
  }

  const addFilter = (type: SearchFilter['type'], value: string, label: string) => {
    const newFilter: SearchFilter = {
      id: `${type}-${Date.now()}`,
      type,
      value,
      label
    }
    setActiveFilters([...activeFilters, newFilter])
  }

  const removeFilter = (filterId: string) => {
    setActiveFilters(activeFilters.filter(f => f.id !== filterId))
  }

  const exportData = (format: 'RDF' | 'OWL' | 'SKOS') => {
    onExport?.(format)
    console.log(`Export triggered: ${format}`)
  }

  return (
    <div className="space-y-6" data-testid="search-interface">
      {/* Search Header */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="search"
                placeholder="Search taxonomies, IDs, projects..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                data-testid="input-search"
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading} data-testid="button-search">
              Search
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              data-testid="button-filters"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <Select onValueChange={(value) => addFilter('domain', value, `Domain: ${value}`)}>
                <SelectTrigger data-testid="select-domain">
                  <SelectValue placeholder="Filter by domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACME.COM">ACME.COM</SelectItem>
                  <SelectItem value="CATALOG.ORG">CATALOG.ORG</SelectItem>
                  <SelectItem value="MOVIEPLATFORM">MOVIEPLATFORM</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => addFilter('aspect', value, `Aspect: ${value}`)}>
                <SelectTrigger data-testid="select-aspect">
                  <SelectValue placeholder="Filter by aspect" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MARKETING">MARKETING</SelectItem>
                  <SelectItem value="UX">UX</SelectItem>
                  <SelectItem value="SOFTWARE">SOFTWARE</SelectItem>
                  <SelectItem value="BRANDING">BRANDING</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => addFilter('project', value, `Project: ${value}`)}>
                <SelectTrigger data-testid="select-project">
                  <SelectValue placeholder="Filter by project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACME-MARKETING2023">ACME Marketing 2023</SelectItem>
                  <SelectItem value="CATALOG-BIRDS">Catalog Birds</SelectItem>
                  <SelectItem value="MOVIE-TRANSACTIONS">Movie Transactions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(filter => (
                <Badge 
                  key={filter.id} 
                  variant="secondary" 
                  className="flex items-center gap-1"
                >
                  {filter.label}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeFilter(filter.id)}
                  />
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveFilters([])}
                className="h-6 px-2 text-xs"
                data-testid="button-clear-filters"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Export Options */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Export Semantic Data</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportData('RDF')}
              data-testid="button-export-rdf"
            >
              <Download className="w-3 h-3 mr-1" />
              RDF
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportData('OWL')}
              data-testid="button-export-owl"
            >
              <Download className="w-3 h-3 mr-1" />
              OWL
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportData('SKOS')}
              data-testid="button-export-skos"
            >
              <Download className="w-3 h-3 mr-1" />
              SKOS
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Search Results</h3>
            <Badge variant="outline">{results.length} results</Badge>
          </div>
          
          <div className="space-y-2">
            {results.map(result => (
              <Card 
                key={result.id} 
                className="p-4 hover-elevate cursor-pointer"
                onClick={() => onResultSelect?.(result)}
                data-testid={`result-${result.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-mono text-sm font-medium text-primary mb-1">
                      {result.projectId}
                    </div>
                    <div className="font-mono text-xs text-muted-foreground mb-2">
                      {result.taxonomicId}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {result.aspectTags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.relevanceScore && (
                      <Badge variant="outline" className="text-xs">
                        {Math.round(result.relevanceScore * 100)}%
                      </Badge>
                    )}
                    <Button size="icon" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card className="p-8">
          <div className="text-center text-muted-foreground">
            <div className="animate-pulse">Searching taxonomic data...</div>
          </div>
        </Card>
      )}
    </div>
  )
}