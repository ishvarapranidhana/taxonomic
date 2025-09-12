import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

// Import pages
import Dashboard from "@/pages/Dashboard";
import SearchPage from "@/pages/SearchPage";
import TaxonomiesPage from "@/pages/TaxonomiesPage";
import CreateTaxonomyPage from "@/pages/CreateTaxonomyPage";
import DocumentationPage from "@/pages/DocumentationPage";
import AdminBNFValidator from "@/pages/AdminBNFValidator";
import NotFound from "@/pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/search" component={SearchPage} />
      <Route path="/taxonomies" component={TaxonomiesPage} />
      <Route path="/taxonomies/create" component={CreateTaxonomyPage} />
      <Route path="/docs" component={DocumentationPage} />
      <Route path="/admin/validator" component={AdminBNFValidator} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Custom sidebar width for taxonomic platform
  const style = {
    "--sidebar-width": "20rem",       // 320px for better content organization
    "--sidebar-width-icon": "4rem",   // default icon width
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="system" storageKey="taxonomic-ui-theme">
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar userRole="admin" />
              <div className="flex flex-col flex-1">
                <header className="flex items-center justify-between p-4 border-b bg-background">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <ThemeToggle />
                </header>
                <main className="flex-1 overflow-auto">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
