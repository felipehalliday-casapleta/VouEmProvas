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
  LogOut
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function NavHeader() {
  const [location, setLocation] = useLocation()

  const navItems = [
    { path: "/hoje", label: "Hoje", icon: Calendar },
    { path: "/antes", label: "Antes", icon: ChevronLeft },
    { path: "/depois", label: "Depois", icon: ChevronRight },
    { path: "/videos", label: "Vídeos", icon: Video },
    { path: "/minigames", label: "MiniGames", icon: Gamepad2 },
    { path: "/status", label: "Status", icon: Activity },
  ]

  const currentTab = navItems.find(item => location === item.path)?.path || "/hoje"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex items-center gap-3">
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
                    FH
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Felipe Halliday</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem data-testid="menu-item-signout">
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
