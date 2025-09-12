import { useState } from 'react'
import SearchInterface, { SearchFilter, SearchResult } from '@/components/SearchInterface'

// Mock search results
const mockSearchResults: SearchResult[] = [
  {
    id: 'result-1',
    taxonomicId: 'ACME.COM/004/ACME-MARKETING2023/MARKETING,BRANDING/UX,SOFTWARE/WEBSITE/20231003070000',
    projectId: 'ACME-MARKETING2023',
    domainSuffix: 'ACME.COM',
    aspectTags: ['MARKETING', 'BRANDING'],
    timestamp: '20231003070000',
    relevanceScore: 0.95,
    md5Hash: 'a1b2c3d4e5f6'
  },
  {
    id: 'result-2',
    taxonomicId: 'CATALOG.ORG/004/CATALOG-BIRDS/BIOLOGY,TAXONOMY/AVIAN,CLASSIFICATION/SPECIES/20231003090000',
    projectId: 'CATALOG-BIRDS',
    domainSuffix: 'CATALOG.ORG',
    aspectTags: ['BIOLOGY', 'TAXONOMY'],
    timestamp: '20231003090000',
    relevanceScore: 0.87,
    md5Hash: 'c3d4e5f6a1b2'
  },
  {
    id: 'result-3',
    taxonomicId: 'MOVIEPLATFORM/004/MOVIE-TRANSACTIONS/BUSINESS,FINANCE/PAYMENTS,ANALYTICS/SUBSCRIPTIONS/20231003100000',
    projectId: 'MOVIE-TRANSACTIONS',
    domainSuffix: 'MOVIEPLATFORM',
    aspectTags: ['BUSINESS', 'FINANCE'],
    timestamp: '20231003100000',
    relevanceScore: 0.73,
    md5Hash: 'e5f6a1b2c3d4'
  }
]

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (query: string, filters: SearchFilter[]) => {
    setIsLoading(true)
    console.log('Searching for:', query, 'with filters:', filters)
    
    // Simulate API call
    setTimeout(() => {
      // Filter mock results based on search query
      const filteredResults = mockSearchResults.filter(result => {
        const matchesQuery = !query || 
          result.projectId.toLowerCase().includes(query.toLowerCase()) ||
          result.domainSuffix.toLowerCase().includes(query.toLowerCase()) ||
          result.aspectTags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        
        const matchesFilters = filters.length === 0 || filters.every(filter => {
          switch (filter.type) {
            case 'domain':
              return result.domainSuffix === filter.value
            case 'aspect':
              return result.aspectTags.includes(filter.value)
            case 'project':
              return result.projectId === filter.value
            default:
              return true
          }
        })
        
        return matchesQuery && matchesFilters
      })
      
      setSearchResults(filteredResults)
      setIsLoading(false)
    }, 1000)
  }

  const handleResultSelect = (result: SearchResult) => {
    console.log('Selected result:', result)
    // Navigate to details page or show modal
  }

  const handleExport = (format: 'RDF' | 'OWL' | 'SKOS') => {
    console.log(`Exporting search results as ${format}`)
    // Trigger download
  }

  return (
    <div className="p-6" data-testid="search-page">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Search Taxonomies</h1>
        <p className="text-muted-foreground">
          Search across taxonomic identifiers, projects, and metadata
        </p>
      </div>

      <SearchInterface
        onSearch={handleSearch}
        onResultSelect={handleResultSelect}
        onExport={handleExport}
        results={searchResults}
        isLoading={isLoading}
      />
    </div>
  )
}