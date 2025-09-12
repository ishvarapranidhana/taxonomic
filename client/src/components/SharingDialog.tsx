import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Plus, Users, Globe, Lock, Building } from 'lucide-react'
import { TaxonomicNode } from './TaxonomicHierarchy'
import { useToast } from '@/hooks/use-toast'

interface SharingDialogProps {
  node: TaxonomicNode | null
  isOpen: boolean
  onClose: () => void
  onSave: (node: TaxonomicNode, sharingSettings: SharingSettings) => void
}

export interface SharingSettings {
  sharingType: 'private' | 'public' | 'users' | 'realms'
  isPublic: boolean
  sharedUsers: string[]
  sharedRealms: string[]
  description?: string
}

export default function SharingDialog({ node, isOpen, onClose, onSave }: SharingDialogProps) {
  const [sharingType, setSharingType] = useState<SharingSettings['sharingType']>('private')
  const [isPublic, setIsPublic] = useState(false)
  const [sharedUsers, setSharedUsers] = useState<string[]>([])
  const [sharedRealms, setSharedRealms] = useState<string[]>([])
  const [newUser, setNewUser] = useState('')
  const [newRealm, setNewRealm] = useState('')
  const [description, setDescription] = useState('')
  const { toast } = useToast()

  // Reset form when node changes
  useEffect(() => {
    if (node) {
      setSharingType(node.sharingType as SharingSettings['sharingType'] || 'private')
      setIsPublic(node.isPublic || false)
      setSharedUsers(node.sharedUsers || [])
      setSharedRealms(node.sharedRealms || [])
      setDescription('')
    }
  }, [node])

  const handleAddUser = () => {
    if (newUser.trim() && !sharedUsers.includes(newUser.trim())) {
      setSharedUsers([...sharedUsers, newUser.trim()])
      setNewUser('')
    }
  }

  const handleRemoveUser = (userToRemove: string) => {
    setSharedUsers(sharedUsers.filter(user => user !== userToRemove))
  }

  const handleAddRealm = () => {
    if (newRealm.trim() && !sharedRealms.includes(newRealm.trim())) {
      setSharedRealms([...sharedRealms, newRealm.trim()])
      setNewRealm('')
    }
  }

  const handleRemoveRealm = (realmToRemove: string) => {
    setSharedRealms(sharedRealms.filter(realm => realm !== realmToRemove))
  }

  const handleSave = () => {
    if (!node) return

    const settings: SharingSettings = {
      sharingType,
      isPublic,
      sharedUsers,
      sharedRealms,
      description: description.trim() || undefined
    }

    onSave(node, settings)
    toast({ 
      title: 'Sharing settings updated', 
      description: `Sharing settings for "${node.projectId}" have been updated.` 
    })
    onClose()
  }

  const getSharingIcon = (type: string) => {
    switch (type) {
      case 'public': return <Globe className="w-4 h-4" />
      case 'users': return <Users className="w-4 h-4" />
      case 'realms': return <Building className="w-4 h-4" />
      default: return <Lock className="w-4 h-4" />
    }
  }

  if (!node) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Share Taxonomy: {node.projectId}
          </DialogTitle>
          <DialogDescription>
            Configure who can access this taxonomy and how it's shared across the system.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={sharingType} onValueChange={(value) => setSharingType(value as SharingSettings['sharingType'])}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="private" className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Private
            </TabsTrigger>
            <TabsTrigger value="public" className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              Public
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              Users
            </TabsTrigger>
            <TabsTrigger value="realms" className="flex items-center gap-1">
              <Building className="w-3 h-3" />
              Realms
            </TabsTrigger>
          </TabsList>

          <TabsContent value="private" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="font-medium mb-2">Private Taxonomy</h3>
              <p className="text-sm">Only you can access this taxonomy. It won't be visible to other users.</p>
            </div>
          </TabsContent>

          <TabsContent value="public" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="public-switch">Make taxonomy publicly available</Label>
                  <p className="text-xs text-muted-foreground">
                    All users in the system can view and use this taxonomy
                  </p>
                </div>
                <Switch 
                  id="public-switch"
                  checked={isPublic} 
                  onCheckedChange={setIsPublic}
                  data-testid="switch-public"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Public Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe this taxonomy and its intended use..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  data-testid="textarea-description"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Shared Users</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Add specific users who can access this taxonomy
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter username or email"
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddUser()}
                    data-testid="input-add-user"
                  />
                  <Button onClick={handleAddUser} data-testid="button-add-user">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {sharedUsers.length > 0 && (
                <div className="space-y-2">
                  <Label>Shared with:</Label>
                  <div className="flex flex-wrap gap-2">
                    {sharedUsers.map((user) => (
                      <Badge key={user} variant="secondary" className="flex items-center gap-1">
                        {user}
                        <button
                          onClick={() => handleRemoveUser(user)}
                          className="ml-1 hover:text-destructive"
                          data-testid={`button-remove-user-${user}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="realms" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Shared Realms</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Add organizational realms that can access this taxonomy
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter realm name"
                    value={newRealm}
                    onChange={(e) => setNewRealm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddRealm()}
                    data-testid="input-add-realm"
                  />
                  <Button onClick={handleAddRealm} data-testid="button-add-realm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {sharedRealms.length > 0 && (
                <div className="space-y-2">
                  <Label>Shared with:</Label>
                  <div className="flex flex-wrap gap-2">
                    {sharedRealms.map((realm) => (
                      <Badge key={realm} variant="secondary" className="flex items-center gap-1">
                        {realm}
                        <button
                          onClick={() => handleRemoveRealm(realm)}
                          className="ml-1 hover:text-destructive"
                          data-testid={`button-remove-realm-${realm}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} data-testid="button-cancel">
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save-sharing">
            Save Sharing Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}