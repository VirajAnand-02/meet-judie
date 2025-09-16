import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="container max-w-6xl px-4 py-16 md:py-24 mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              About <span className="text-[var(--primary-color)]">Judie</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl leading-relaxed">
              Empowering meaningful conversations through artificial intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 text-left mt-20">
            <div className="space-y-6 p-8 bg-card border rounded-xl shadow-sm">
              <h2 className="text-2xl md:text-3xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                At Judie AI, we believe that meaningful conversations have the power to transform lives. 
                Our mission is to enhance human communication by providing intelligent, context-aware assistance 
                that helps you express yourself more effectively and build stronger relationships.
              </p>
            </div>

            <div className="space-y-6 p-8 bg-card border rounded-xl shadow-sm">
              <h2 className="text-2xl md:text-3xl font-bold">How It Works</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Judie analyzes your conversations in real-time, offering personalized suggestions, 
                coaching insights, and intelligent responses. Whether you're a professional coach, 
                business leader, or anyone looking to improve their communication skills, 
                Judie adapts to your unique style and goals.
              </p>
            </div>
          </div>

          <div className="mt-16 pt-8">
            <Button size="lg" className="bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 px-8 py-3 text-base" asChild>
              <Link href="/chats">Try Judie Now</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}