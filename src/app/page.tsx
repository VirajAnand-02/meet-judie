"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { Sparkles, MessageCircle, Users, Zap, Loader2 } from "lucide-react"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (status === "authenticated") {
    return null // Will redirect, so show nothing
  }
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container max-w-7xl px-4 py-20 md:py-32 mx-auto">
        <div className="flex flex-col items-center text-center space-y-10 animate-fade-in">
          <div className="space-y-8 max-w-5xl">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Meet{" "}
                <span className="relative">
                  <span className="gradient-text">Judie</span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-lg -z-10"></div>
                </span>
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full"></div>
            </div>
            <p className="mx-auto max-w-[800px] text-xl text-muted-foreground md:text-2xl leading-relaxed">
              Your AI-powered coaching companion. Get personalized guidance, 
              smart conversation assistance, and unlock your potential with intelligent insights.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button 
              size="lg" 
              className="button-modern bg-primary hover:bg-primary/90 px-10 py-4 text-lg font-medium shadow-modern-lg hover:shadow-xl transition-all duration-300" 
              asChild
            >
              <Link href="/signin">
                Get Started
                <div className="ml-2 h-5 w-5 rounded-full bg-white/20"></div>
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-10 py-4 text-lg font-medium border-2 hover:bg-primary/5 transition-all duration-300" 
              asChild
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container max-w-7xl px-4 py-20 md:py-32 mx-auto">
        <div className="text-center space-y-8 mb-20 animate-slide-up">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Why Choose <span className="gradient-text">Judie?</span>
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full"></div>
          </div>
          <p className="mx-auto max-w-[700px] text-muted-foreground text-xl leading-relaxed">
            Discover the power of AI-assisted conversations and personalized coaching
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="group card-modern flex flex-col items-center text-center space-y-8 p-8 rounded-2xl hover:scale-105 transition-all duration-500">
            <div className="relative">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">AI-Powered Insights</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get intelligent suggestions and conversation analysis powered by advanced AI
              </p>
            </div>
          </div>
          
          <div className="group card-modern flex flex-col items-center text-center space-y-8 p-8 rounded-2xl hover:scale-105 transition-all duration-500">
            <div className="relative">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                <MessageCircle className="h-10 w-10 text-primary" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Smart Conversations</h3>
              <p className="text-muted-foreground leading-relaxed">
                Enhanced messaging with real-time suggestions and context-aware responses
              </p>
            </div>
          </div>
          
          <div className="group card-modern flex flex-col items-center text-center space-y-8 p-8 rounded-2xl hover:scale-105 transition-all duration-500">
            <div className="relative">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Personal Coaching</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive personalized coaching and guidance tailored to your goals
              </p>
            </div>
          </div>
          
          <div className="group card-modern flex flex-col items-center text-center space-y-8 p-8 rounded-2xl hover:scale-105 transition-all duration-500">
            <div className="relative">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                <Zap className="h-10 w-10 text-primary" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Quick responses and instant insights to keep your conversations flowing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container max-w-7xl px-4 py-20 md:py-32 mx-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl blur-3xl"></div>
          <div className="relative flex flex-col items-center text-center space-y-10 glass rounded-3xl border-2 p-12 md:p-20 shadow-modern-lg">
            <div className="space-y-8 max-w-3xl">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Ready to Transform Your{" "}
                  <span className="gradient-text">Conversations?</span>
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full"></div>
              </div>
              <p className="text-muted-foreground text-xl leading-relaxed">
                Join thousands of users who are already experiencing the power of AI-assisted communication
              </p>
            </div>
            
            <div className="pt-4">
              <Button 
                size="lg" 
                className="button-modern bg-primary hover:bg-primary/90 px-12 py-5 text-xl font-medium shadow-modern-lg hover:shadow-2xl transition-all duration-300" 
                asChild
              >
                <Link href="/signin">
                  Get Started Today
                  <div className="ml-3 h-6 w-6 rounded-full bg-white/20"></div>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}
