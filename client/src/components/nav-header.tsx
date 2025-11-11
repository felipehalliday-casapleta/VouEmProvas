import { Link, useLocation } from "wouter"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  Gamepad2, 
  Activity,
  Search,
  User,
  LogOut,
  Menu
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

export function NavHeader() {
  const [location, setLocation] = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  
  const handleLogout = async () => {
    await logout()
    setLocation('/login')
  }
  
  const userInitials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || 'U'

  const navItems = [
    { path: "/hoje", label: "Hoje", icon: Calendar },
    { path: "/antes", label: "Antes", icon: ChevronLeft },
    { path: "/depois", label: "Depois", icon: ChevronRight },
    { path: "/videos", label: "Vídeos", icon: Video },
    { path: "/minigames", label: "MiniGames", icon: Gamepad2 },
    { path: "/status", label: "Status", icon: Activity },
  ]

  const currentTab = navItems.find(item => location === item.path)?.path || "/hoje"

  const handleNavigation = (path: string) => {
    setLocation(path)
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex items-center gap-3">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location === item.path
                  return (
                    <Button
                      key={item.path}
                      variant={isActive ? "secondary" : "ghost"}
                      className="justify-start gap-3 h-12"
                      onClick={() => handleNavigation(item.path)}
                      data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-base">{item.label}</span>
                    </Button>
                  )
                })}
                <div className="border-t my-2" />
                <Button
                  variant="ghost"
                  className="justify-start gap-3 h-12"
                  onClick={() => handleNavigation("/busca")}
                  data-testid="mobile-nav-busca"
                >
                  <Search className="h-5 w-5" />
                  <span className="text-base">Busca</span>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">VP</span>
            </div>
            <h1 className="text-lg font-semibold hidden sm:block">VOU EM PROVAS</h1>
          </div>
        </div>

        <div className="hidden md:flex flex-1 justify-center">
          <Tabs value={currentTab} className="w-auto">
            <TabsList className="h-10">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <TabsTrigger
                    key={item.path}
                    value={item.path}
                    onClick={() => setLocation(item.path)}
                    className="gap-2"
                    data-testid={`tab-${item.label.toLowerCase()}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/busca")}
            className="hidden md:flex"
            data-testid="button-search"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-user-menu">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name || user?.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} data-testid="menu-item-signout">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
