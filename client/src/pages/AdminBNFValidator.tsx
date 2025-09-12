import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import BNFValidator from '@/components/BNFValidator'
import TaxonomicHierarchy, { TaxonomicNode } from '@/components/TaxonomicHierarchy'
import { Save, Download, Upload, CheckCircle, XCircle } from 'lucide-react'

export default function AdminBNFValidator() {
  const [validatedTaxonomies, setValidatedTaxonomies] = useState<TaxonomicNode[]>([])
  const [currentTaxonomyId, setCurrentTaxonomyId] = useState('')
  const [isValid, setIsValid] = useState(false)

  const handleValidationChange = (valid: boolean, taxonomicId: string) => {
    setIsValid(valid)
    setCurrentTaxonomyId(taxonomicId)
  }

  const saveTaxonomy = () => {
    if (isValid && currentTaxonomyId) {
      const parts = currentTaxonomyId.split('/')
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
        
        setValidatedTaxonomies(prev => [...prev, newTaxonomy])
        console.log('Taxonomy saved:', newTaxonomy)
      }
    }
  }

  const exportTaxonomies = (format: 'JSON' | 'CSV' | 'BNF') => {
    console.log(`Exporting ${validatedTaxonomies.length} taxonomies as ${format}`)
    // Implement export functionality
  }

  const importTaxonomies = () => {
    console.log('Import taxonomies from file')
    // Implement import functionality
  }

  return (
    <div className="p-6 space-y-6" data-testid="admin-bnf-validator">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">BNF Validator</h1>
          <p className="text-muted-foreground">
            Validate and create BNF-compliant taxonomic identifiers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isValid ? 'default' : 'destructive'} className="flex items-center gap-1">
            {isValid ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            {isValid ? 'Valid' : 'Invalid'}
          </Badge>
        </div>
      </div>

      {/* BNF Validator */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Taxonomic ID Builder</h2>
          <p className="text-sm text-muted-foreground">
            Build and validate taxonomic IDs according to BNF grammar specifications
          </p>
        </div>
        
        <BNFValidator onValidationChange={handleValidationChange} />
        
        <div className="mt-6 flex gap-2">
          <Button 
            onClick={saveTaxonomy} 
            disabled={!isValid}
            data-testid="button-save-taxonomy"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Taxonomy
          </Button>
          <Button 
            variant="outline" 
            onClick={importTaxonomies}
            data-testid="button-import"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import from File
          </Button>
        </div>
      </Card>

      {/* Export Options */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Export Validated Taxonomies</h3>
            <p className="text-sm text-muted-foreground">
              Export all validated taxonomies in various formats
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportTaxonomies('JSON')}
              data-testid="button-export-json"
            >
              <Download className="w-3 h-3 mr-1" />
              JSON
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportTaxonomies('CSV')}
              data-testid="button-export-csv"
            >
              <Download className="w-3 h-3 mr-1" />
              CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportTaxonomies('BNF')}
              data-testid="button-export-bnf"
            >
              <Download className="w-3 h-3 mr-1" />
              BNF
            </Button>
          </div>
        </div>
      </Card>

      {/* Validated Taxonomies */}
      {validatedTaxonomies.length > 0 && (
        <Card className="p-6">
          <TaxonomicHierarchy
            nodes={validatedTaxonomies}
            title="Validated Taxonomies"
          />
        </Card>
      )}
    </div>
  )
}