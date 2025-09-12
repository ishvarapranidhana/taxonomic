import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ValidationResult {
  isValid: boolean
  component: 'domainSuffix' | 'projectSubpart' | 'projectId' | 'aspectTags' | 'areaHierarchies' | 'childNodes' | 'timestamp' | 'overall'
  message: string
  severity: 'error' | 'warning' | 'info'
}

interface BNFValidatorProps {
  onValidationChange?: (isValid: boolean, taxonomicId: string) => void
  initialValue?: string
}

export default function BNFValidator({ onValidationChange, initialValue = '' }: BNFValidatorProps) {
  const [domainSuffix, setDomainSuffix] = useState('')
  const [projectSubpart, setProjectSubpart] = useState('004')
  const [projectId, setProjectId] = useState('')
  const [aspectTags, setAspectTags] = useState('')
  const [areaHierarchies, setAreaHierarchies] = useState('')
  const [childNodes, setChildNodes] = useState('')
  const [timestamp, setTimestamp] = useState('')
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([])

  // BNF validation patterns
  const patterns = {
    domainSuffix: /^[a-zA-Z0-9.-]+$/,
    projectSubpart: /^[0-9]{1,3}$/,
    projectId: /^[A-Z0-9-]{1,32}$/,
    aspectTags: /^[A-Z0-9-]+(\s*,\s*[A-Z0-9-]+)*$/,
    areaHierarchies: /^[A-Z0-9-]+(\s*,\s*[A-Z0-9-]+)*$/,
    childNodes: /^[A-Z0-9-]+(\s*,\s*[A-Z0-9-]+)*$/,
    timestamp: /^\d{14}$/
  }

  const validateComponent = (
    component: keyof typeof patterns,
    value: string,
    required: boolean = true
  ): ValidationResult => {
    if (!value && required) {
      return {
        isValid: false,
        component,
        message: `${component} is required`,
        severity: 'error'
      }
    }
    
    if (!value && !required) {
      return {
        isValid: true,
        component,
        message: `${component} is optional`,
        severity: 'info'
      }
    }

    const isValid = patterns[component].test(value)
    return {
      isValid,
      component,
      message: isValid 
        ? `${component} format is valid`
        : `${component} format is invalid. Expected pattern: ${getPatternDescription(component)}`,
      severity: isValid ? 'info' : 'error'
    }
  }

  const getPatternDescription = (component: keyof typeof patterns): string => {
    switch (component) {
      case 'domainSuffix': return 'letters, numbers, dots, hyphens'
      case 'projectSubpart': return '1-3 digits'
      case 'projectId': return '1-32 uppercase letters, numbers, hyphens'
      case 'aspectTags': return 'uppercase letters, numbers, hyphens, comma-separated'
      case 'areaHierarchies': return 'uppercase letters, numbers, hyphens, comma-separated'
      case 'childNodes': return 'uppercase letters, numbers, hyphens, comma-separated'
      case 'timestamp': return 'YYYYMMDDhhmmss (14 digits)'
      default: return 'see BNF specification'
    }
  }

  const generateCurrentTimestamp = () => {
    const now = new Date()
    const timestamp = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0')
    setTimestamp(timestamp)
  }

  useEffect(() => {
    if (initialValue) {
      // Parse existing taxonomic ID
      const parts = initialValue.split('/')
      if (parts.length >= 7) {
        setDomainSuffix(parts[0] || '')
        setProjectSubpart(parts[1] || '004')
        setProjectId(parts[2] || '')
        setAspectTags(parts[3] || '')
        setAreaHierarchies(parts[4] || '')
        setChildNodes(parts[5] || '')
        setTimestamp(parts[6] || '')
      }
    }
  }, [initialValue])

  useEffect(() => {
    const results: ValidationResult[] = [
      validateComponent('domainSuffix', domainSuffix),
      validateComponent('projectSubpart', projectSubpart),
      validateComponent('projectId', projectId),
      validateComponent('aspectTags', aspectTags),
      validateComponent('areaHierarchies', areaHierarchies),
      validateComponent('childNodes', childNodes),
      validateComponent('timestamp', timestamp)
    ]

    const allValid = results.every(r => r.isValid)
    const taxonomicId = `${domainSuffix}/${projectSubpart}/${projectId}/${aspectTags}/${areaHierarchies}/${childNodes}/${timestamp}`

    results.push({
      isValid: allValid,
      component: 'overall',
      message: allValid ? 'Taxonomic ID is BNF-compliant' : 'Taxonomic ID has validation errors',
      severity: allValid ? 'info' : 'error'
    })

    setValidationResults(results)
    onValidationChange?.(allValid, taxonomicId)
  }, [domainSuffix, projectSubpart, projectId, aspectTags, areaHierarchies, childNodes, timestamp, onValidationChange])

  const getValidationIcon = (result: ValidationResult) => {
    if (result.severity === 'error') return <XCircle className="w-4 h-4 text-destructive" />
    if (result.severity === 'warning') return <AlertCircle className="w-4 h-4 text-yellow-500" />
    return <CheckCircle className="w-4 h-4 text-green-500" />
  }

  const taxonomicId = `${domainSuffix}/${projectSubpart}/${projectId}/${aspectTags}/${areaHierarchies}/${childNodes}/${timestamp}`
  const overallResult = validationResults.find(r => r.component === 'overall')

  return (
    <div className="space-y-6" data-testid="bnf-validator">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Domain Suffix */}
        <div className="space-y-2">
          <Label htmlFor="domain-suffix">Domain Suffix</Label>
          <Input
            id="domain-suffix"
            value={domainSuffix}
            onChange={(e) => setDomainSuffix(e.target.value)}
            placeholder="ACME.COM"
            data-testid="input-domain-suffix"
          />
        </div>

        {/* Project Subpart */}
        <div className="space-y-2">
          <Label htmlFor="project-subpart">Project Subpart</Label>
          <Input
            id="project-subpart"
            value={projectSubpart}
            onChange={(e) => setProjectSubpart(e.target.value)}
            placeholder="004"
            data-testid="input-project-subpart"
          />
        </div>

        {/* Project ID */}
        <div className="space-y-2">
          <Label htmlFor="project-id">Project ID</Label>
          <Input
            id="project-id"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value.toUpperCase())}
            placeholder="ACME-MARKETING2023"
            data-testid="input-project-id"
          />
        </div>

        {/* Aspect Tags */}
        <div className="space-y-2">
          <Label htmlFor="aspect-tags">Aspect Tags</Label>
          <Input
            id="aspect-tags"
            value={aspectTags}
            onChange={(e) => setAspectTags(e.target.value.toUpperCase())}
            placeholder="MARKETING,BRANDING"
            data-testid="input-aspect-tags"
          />
        </div>

        {/* Area Hierarchies */}
        <div className="space-y-2">
          <Label htmlFor="area-hierarchies">Area Hierarchies</Label>
          <Input
            id="area-hierarchies"
            value={areaHierarchies}
            onChange={(e) => setAreaHierarchies(e.target.value.toUpperCase())}
            placeholder="UX,SOFTWARE"
            data-testid="input-area-hierarchies"
          />
        </div>

        {/* Child Nodes */}
        <div className="space-y-2">
          <Label htmlFor="child-nodes">Child Nodes</Label>
          <Input
            id="child-nodes"
            value={childNodes}
            onChange={(e) => setChildNodes(e.target.value.toUpperCase())}
            placeholder="WEBSITE"
            data-testid="input-child-nodes"
          />
        </div>

        {/* Timestamp */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="timestamp">Timestamp</Label>
            <button
              onClick={generateCurrentTimestamp}
              className="text-xs text-primary hover:underline"
              data-testid="button-generate-timestamp"
            >
              Use current time
            </button>
          </div>
          <Input
            id="timestamp"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            placeholder="20231003070000"
            data-testid="input-timestamp"
          />
        </div>
      </div>

      {/* Generated Taxonomic ID */}
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Generated Taxonomic ID</Label>
            {overallResult && (
              <Badge variant={overallResult.isValid ? 'default' : 'destructive'}>
                {overallResult.isValid ? 'Valid' : 'Invalid'}
              </Badge>
            )}
          </div>
          <div className="font-mono text-sm bg-muted p-3 rounded break-all">
            {taxonomicId}
          </div>
        </div>
      </Card>

      {/* Validation Results */}
      <div className="space-y-2">
        <h4 className="font-medium">Validation Results</h4>
        {validationResults
          .filter(r => r.component !== 'overall')
          .map(result => (
            <Alert 
              key={result.component} 
              className={result.severity === 'error' ? 'border-destructive' : ''}
            >
              {getValidationIcon(result)}
              <AlertDescription className="ml-2">
                <span className="font-medium capitalize">{result.component}:</span> {result.message}
              </AlertDescription>
            </Alert>
          ))}
      </div>

      {/* BNF Reference */}
      <Card className="p-4">
        <h4 className="font-medium mb-2">BNF Reference</h4>
        <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
{`<taxonomy> ::= <domain-suffix> '/' <project-subpart> '/' <project-id> '/' <aspect-tags> '/' <area-hierarchies> '/' <child-nodes> '/' <timestamp>

<domain-suffix> ::= [a-zA-Z0-9.-]+
<project-subpart> ::= [0-9]{1,3}
<project-id> ::= [A-Z0-9-]{1,32}
<aspect-tags> ::= [A-Z0-9-]+ (',' [A-Z0-9-]+)*
<area-hierarchies> ::= [A-Z0-9-]+ (',' [A-Z0-9-]+)*
<child-nodes> ::= [A-Z0-9-]+ (',' [A-Z0-9-]+)*
<timestamp> ::= YYYYMMDDhhmmss`}
        </pre>
      </Card>
    </div>
  )
}