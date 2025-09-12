import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar'
import { 
  Home, 
  Search, 
  Settings, 
  BookOpen, 
  Database, 
  GitBranch, 
  Shield, 
  Users,
  Activity,
  FileText
} from 'lucide-react'
import { useLocation } from 'wouter'
import { Badge } from '@/components/ui/badge'

const menuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
    badge: null
  },
  {
    title: 'Search',
    url: '/search',
    icon: Search,
    badge: null
  },
  {
    title: 'Browse Taxonomies',
    url: '/taxonomies',
    icon: GitBranch,
    badge: null
  },
  {
    title: 'Documentation',
    url: '/docs',
    icon: BookOpen,
    badge: 'New'
  }
]

const backofficeItems = [
  {
    title: 'User Management',
    url: '/admin/users',
    icon: Users,
    badge: null
  },
  {
    title: 'System Settings',
    url: '/admin/settings',
    icon: Settings,
    badge: null
  },
  {
    title: 'Database Admin',
    url: '/admin/database',
    icon: Database,
    badge: null
  },
  {
    title: 'Security & Access',
    url: '/admin/security',
    icon: Shield,
    badge: null
  },
  {
    title: 'Audit Logs',
    url: '/admin/audit',
    icon: Activity,
    badge: null
  },
  {
    title: 'BNF Validator',
    url: '/admin/validator',
    icon: FileText,
    badge: null
  }
]

interface AppSidebarProps {
  userRole?: 'admin' | 'editor' | 'viewer'
}

export function AppSidebar({ userRole = 'viewer' }: AppSidebarProps) {
  const [location] = useLocation()
  
  return (
    <Sidebar data-testid="app-sidebar">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-primary" />
          <div>
            <h2 className="font-semibold text-sm">Taxonomic Framework</h2>
            <p className="text-xs text-muted-foreground">Platform v1.0</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}
                  >
                    <a href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Backoffice section - only shown for admins and editors */}
        {(userRole === 'admin' || userRole === 'editor') && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {backofficeItems
                  .filter(item => {
                    // Editors can't access user management or security settings
                    if (userRole === 'editor') {
                      return !['User Management', 'Security & Access'].includes(item.title)
                    }
                    return true
                  })
                  .map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild
                        isActive={location === item.url}
                        data-testid={`admin-${item.title.toLowerCase().replace(/[\s&]/g, '-')}`}
                      >
                        <a href={item.url}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>System Online</span>
          <Badge variant="outline" className="ml-auto">
            {userRole}
          </Badge>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}