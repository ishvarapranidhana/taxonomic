import { useState } from 'react'
import { ChevronDown, ChevronRight, Copy, Hash, Clock, Copy as CloneIcon, Share2, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface TaxonomicNode {
  id: string
  domainSuffix: string
  projectId: string
  aspectTags: string[]
  areaHierarchies: string[]
  childNodes: string[]
  timestamp: string
  md5Hash?: string
  uuid?: string
  children?: TaxonomicNode[]
  // Sharing properties
  sharingType?: string
  ownerId?: string
  sharedUsers?: string[]
  sharedRealms?: string[]
  isPublic?: boolean
}

interface TaxonomicHierarchyProps {
  nodes: TaxonomicNode[]
  title?: string
  onNodeSelect?: (node: TaxonomicNode) => void
  onNodeClone?: (node: TaxonomicNode) => void
  onNodeShare?: (node: TaxonomicNode) => void
  enableActions?: boolean
}

export default function TaxonomicHierarchy({ 
  nodes, 
  title, 
  onNodeSelect, 
  onNodeClone, 
  onNodeShare, 
  enableActions = true 
}: TaxonomicHierarchyProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const copyTaxonomicId = async (node: TaxonomicNode) => {
    const taxonomicId = `${node.domainSuffix}/004/${node.projectId}/${node.aspectTags.join(',')}/${node.areaHierarchies.join(',')}/${node.childNodes.join(',')}/${node.timestamp}`
    await navigator.clipboard.writeText(taxonomicId)
    toast({ title: 'Copied to clipboard', description: 'Taxonomic ID copied successfully' })
  }

  const handleClone = (node: TaxonomicNode, e: React.MouseEvent) => {
    e.stopPropagation()
    onNodeClone?.(node)
    toast({ title: 'Taxonomy cloned', description: `Created a copy of "${node.projectId}"` })
  }

  const handleShare = (node: TaxonomicNode, e: React.MouseEvent) => {
    e.stopPropagation()
    onNodeShare?.(node)
  }

  const getSharingBadge = (node: TaxonomicNode) => {
    if (node.isPublic) {
      return <Badge variant="outline" className="text-xs">Public</Badge>
    }
    if (node.sharingType === 'users' && node.sharedUsers?.length) {
      return <Badge variant="outline" className="text-xs">{node.sharedUsers.length} Users</Badge>
    }
    if (node.sharingType === 'realms' && node.sharedRealms?.length) {
      return <Badge variant="outline" className="text-xs">{node.sharedRealms.length} Realms</Badge>
    }
    return <Badge variant="secondary" className="text-xs">Private</Badge>
  }

  const renderNode = (node: TaxonomicNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expandedNodes.has(node.id)
    const taxonomicId = `${node.domainSuffix}/004/${node.projectId}/${node.aspectTags.join(',')}/${node.areaHierarchies.join(',')}/${node.childNodes.join(',')}/${node.timestamp}`

    return (
      <div key={node.id} className="mb-2">
        <Card className="p-4 hover-elevate" style={{ marginLeft: `${level * 24}px` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {hasChildren && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => toggleNode(node.id)}
                  data-testid={`button-expand-${node.id}`}
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
              )}
              <div className="flex-1 cursor-pointer" onClick={() => onNodeSelect?.(node)}>
                <div className="font-mono text-sm font-medium text-primary">
                  {node.projectId}
                </div>
                <div className="font-mono text-xs text-muted-foreground mt-1">
                  {taxonomicId}
                </div>
                <div className="flex gap-1 mt-2">
                  {node.aspectTags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getSharingBadge(node)}
              {node.md5Hash && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Hash className="w-3 h-3" />
                  <span className="font-mono">{node.md5Hash.substring(0, 8)}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{node.timestamp}</span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => copyTaxonomicId(node)}
                data-testid={`button-copy-${node.id}`}
              >
                <Copy className="w-3 h-3" />
              </Button>
              {enableActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      data-testid={`button-actions-${node.id}`}
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => handleClone(node, e)} data-testid={`button-clone-${node.id}`}>
                      <CloneIcon className="w-4 h-4 mr-2" />
                      Clone Taxonomy
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => handleShare(node, e)} data-testid={`button-share-${node.id}`}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </Card>
        {isExpanded && hasChildren && (
          <div className="mt-2">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4" data-testid="taxonomic-hierarchy">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Badge variant="outline" className="font-mono text-xs">
            {nodes.length} taxonomies
          </Badge>
        </div>
      )}
      <div className="space-y-2">
        {nodes.map(node => renderNode(node))}
      </div>
    </div>
  )
}