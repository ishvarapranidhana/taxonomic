import { useState } from 'react'
import { User, Bot, Eye, Edit, Plus, Hash, Clock, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export interface ProvenanceEntry {
  id: string
  uuid: string
  actor: string
  actorType: 'USER' | 'AGENT'
  role: 'editor' | 'viewer' | 'admin' | 'refiner'
  action: 'create' | 'update' | 'view' | 'delete'
  timestamp: string
  md5Hash?: string
  metadata?: Record<string, any>
}

interface ProvenanceChainProps {
  entries: ProvenanceEntry[]
  title?: string
  compact?: boolean
}

export default function ProvenanceChain({ entries, title, compact = false }: ProvenanceChainProps) {
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set())

  const toggleEntry = (entryId: string) => {
    const newExpanded = new Set(expandedEntries)
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId)
    } else {
      newExpanded.add(entryId)
    }
    setExpandedEntries(newExpanded)
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return <Plus className="w-3 h-3" />
      case 'update': return <Edit className="w-3 h-3" />
      case 'view': return <Eye className="w-3 h-3" />
      default: return <Edit className="w-3 h-3" />
    }
  }

  const getActorIcon = (actorType: string) => {
    return actorType === 'USER' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive' as const
      case 'editor': return 'default' as const
      case 'refiner': return 'secondary' as const
      default: return 'outline' as const
    }
  }

  return (
    <div className="space-y-4" data-testid="provenance-chain">
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge variant="outline" className="font-mono text-xs">
            {entries.length} entries
          </Badge>
        </div>
      )}
      
      <div className="relative">
        {/* Timeline line */}
        {entries.length > 1 && (
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border"></div>
        )}
        
        <div className="space-y-4">
          {entries.map((entry, index) => {
            const isExpanded = expandedEntries.has(entry.id)
            const hasMetadata = entry.metadata && Object.keys(entry.metadata).length > 0
            
            return (
              <Card key={entry.id} className="relative">
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Timeline dot and actor icon */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                        {getActorIcon(entry.actorType)}
                      </div>
                      {index < entries.length - 1 && (
                        <div className="absolute top-12 left-1/2 transform -translate-x-px w-0.5 h-4 bg-border"></div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {getActionIcon(entry.action)}
                        <span className="font-medium">{entry.actor}</span>
                        <Badge variant={getRoleBadgeVariant(entry.role)} className="text-xs">
                          {entry.role}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {entry.action}d
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{entry.timestamp}</span>
                        </div>
                        {entry.md5Hash && (
                          <div className="flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            <span className="font-mono">{entry.md5Hash.substring(0, 8)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="font-mono text-xs text-muted-foreground">
                        UUID: {entry.uuid}
                      </div>
                      
                      {hasMetadata && (
                        <div className="mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleEntry(entry.id)}
                            className="p-0 h-auto text-xs"
                            data-testid={`button-expand-metadata-${entry.id}`}
                          >
                            <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            View metadata
                          </Button>
                          
                          {isExpanded && (
                            <div className="mt-2 p-2 bg-muted rounded text-xs">
                              <pre className="whitespace-pre-wrap">
                                {JSON.stringify(entry.metadata, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}