"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  User, 
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Chats",
    href: "/chats",
    icon: MessageSquare,
  },
  {
    name: "Settings", 
    href: "/settings",
    icon: Settings,
  },
]

const secondaryNavigation = [
  {
    name: "Profile",
    href: "/profile", 
    icon: User,
  },
  {
    name: "Help",
    href: "/help",
    icon: HelpCircle,
  },
]

interface SidebarProps {
  children: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load collapse state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed')
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true')
    }
    setIsHydrated(true) // Mark as hydrated after loading localStorage
  }, [])

  // Save collapse state to localStorage whenever it changes
  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', newState.toString())
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/signin' })
  }

  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse orb-glow"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse orb-glow" style={{animationDelay: '-2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-gradient-to-r from-teal-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse orb-glow" style={{animationDelay: '-4s'}}></div>
      </div>
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex lg:flex-col glass-modern border-r border-white/10 transition-all duration-300 relative z-10 shadow-2xl",
        !isHydrated && "lg:w-64", // Default width during hydration
        isHydrated && (isCollapsed ? "lg:w-20" : "lg:w-64")
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={cn(
            "flex items-center border-b border-white/10 transition-all duration-300",
            !isHydrated && "gap-3 p-6", // Default layout during hydration
            isHydrated && (isCollapsed ? "justify-center p-4" : "gap-3 p-6")
          )}>
            <div className="relative flex-shrink-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-xl blur-lg opacity-50 -z-10"></div>
            </div>
            {(!isHydrated || !isCollapsed) && (
              <div className="min-w-0">
                <h1 className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Judie AI</h1>
                <p className="text-xs text-gray-300">AI Assistant</p>
              </div>
            )}
          </div>

          {/* Collapse Toggle Button */}
          <div className={cn(
            "border-b border-white/10 transition-all duration-300",
            !isHydrated && "p-4", // Default during hydration
            isHydrated && (isCollapsed ? "p-2" : "p-4")
          )}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className={cn(
                "transition-all duration-200 hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                !isHydrated && "w-full justify-start gap-3 h-10 px-4", // Default during hydration
                isHydrated && (isCollapsed ? "w-full h-12" : "w-full justify-start gap-3 h-10 px-4")
              )}
            >
              {(!isHydrated || !isCollapsed) ? (
                <>
                  <ChevronLeft className="h-5 w-5" />
                  {(!isHydrated || !isCollapsed) && <span className="text-sm font-medium">Collapse</span>}
                </>
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className={cn(
            "flex-1 space-y-2 transition-all duration-300",
            !isHydrated && "p-4", // Default during hydration
            isHydrated && (isCollapsed ? "p-2" : "p-4")
          )}>
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-xl text-sm font-medium transition-all duration-200 relative",
                    isActive
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-400/30 shadow-lg backdrop-blur-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    !isHydrated && "gap-3 px-4 py-3", // Default during hydration
                    isHydrated && (isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3")
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-colors flex-shrink-0",
                    isActive ? "text-blue-300" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  {(!isHydrated || !isCollapsed) && (
                    <>
                      <span className="min-w-0 truncate">{item.name}</span>
                      {isActive && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-blue-400 flex-shrink-0 shadow-sm"></div>
                      )}
                    </>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isHydrated && isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-background/95 backdrop-blur-md text-foreground border border-border rounded-lg shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                      {item.name}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-background/95 border-l border-t border-border rotate-45"></div>
                    </div>
                  )}
                </Link>
              )
            })}
            
            <div className={cn(
              "border-t border-white/10 transition-all duration-300",
              isCollapsed ? "mt-4 pt-4" : "pt-4 mt-4"
            )}>
              {secondaryNavigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center rounded-xl text-sm font-medium transition-all duration-200 relative",
                      isActive
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-400/30 shadow-lg backdrop-blur-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      isCollapsed ? "justify-center p-3 mt-2" : "gap-3 px-4 py-3 mt-2"
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5 transition-colors flex-shrink-0",
                      isActive ? "text-purple-300" : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    {!isCollapsed && <span className="min-w-0 truncate">{item.name}</span>}
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-background/95 backdrop-blur-md text-foreground border border-border rounded-lg shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                        {item.name}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-background/95 border-l border-t border-border rotate-45"></div>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className={cn(
            "border-t border-white/10 space-y-3 transition-all duration-300",
            isCollapsed ? "p-2" : "p-4"
          )}>
            <div className={cn(
              "flex items-center transition-all duration-200",
              isCollapsed ? "justify-center" : "justify-between"
            )}>
              {!isCollapsed && <span className="text-sm text-muted-foreground">Theme</span>}
              <ThemeToggle />
            </div>
            <Button
              variant="ghost"
              className={cn(
                "group text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 relative",
                isCollapsed ? "w-full h-12 p-0" : "w-full justify-start gap-3"
              )}
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>Sign Out</span>}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-background/95 backdrop-blur-md text-foreground border border-border rounded-lg shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  Sign Out
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-background/95 border-l border-t border-border rotate-45"></div>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(true)}
          className="glass-card border-border shadow-xl text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-64 glass-modern border-r border-white/10 shadow-2xl z-50 lg:hidden animate-slide-in-left">
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">J</span>
                  </div>
                  <h1 className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Judie AI</h1>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-400/30 shadow-lg backdrop-blur-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <Icon className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-blue-300" : "text-muted-foreground group-hover:text-foreground"
                      )} />
                      {item.name}
                    </Link>
                  )
                })}
                
                <div className="pt-4 mt-4 border-t border-white/10">
                  {secondaryNavigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-400/30 shadow-lg backdrop-blur-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <Icon className={cn(
                          "h-5 w-5 transition-colors",
                          isActive ? "text-purple-300" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  )
}