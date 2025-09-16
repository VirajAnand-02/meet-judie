"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-border/50 supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/50 to-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
            <span className="hidden font-bold text-xl sm:inline-block gradient-text">Judie AI</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-base font-medium">
          <Link 
            href="/" 
            className="relative px-3 py-2 rounded-lg transition-all duration-300 hover:text-primary hover:bg-primary/5"
          >
            Home
          </Link>
          <Link 
            href="/chats" 
            className="relative px-3 py-2 rounded-lg transition-all duration-300 hover:text-primary hover:bg-primary/5"
          >
            Chats
          </Link>
          <Link 
            href="/about" 
            className="relative px-3 py-2 rounded-lg transition-all duration-300 hover:text-primary hover:bg-primary/5"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button 
            className="hidden sm:inline-flex button-modern bg-primary hover:bg-primary/90 px-6 py-2.5 font-medium shadow-modern hover:shadow-lg transition-all duration-300" 
            asChild
          >
            <Link href="/chats">
              Get Started
              <div className="ml-2 h-4 w-4 rounded-full bg-white/20"></div>
            </Link>
          </Button>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass border-t border-border/50">
          <nav className="container py-6 space-y-1">
            <Link 
              href="/" 
              className="block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 hover:text-primary hover:bg-primary/5"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/chats" 
              className="block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 hover:text-primary hover:bg-primary/5"
              onClick={() => setIsMenuOpen(false)}
            >
              Chats
            </Link>
            <Link 
              href="/about" 
              className="block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 hover:text-primary hover:bg-primary/5"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-4">
              <Button className="w-full button-modern bg-primary hover:bg-primary/90 py-3 font-medium shadow-modern" asChild>
                <Link href="/chats" onClick={() => setIsMenuOpen(false)}>
                  Get Started
                  <div className="ml-2 h-4 w-4 rounded-full bg-white/20"></div>
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}