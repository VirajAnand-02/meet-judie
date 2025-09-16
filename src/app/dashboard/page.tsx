"use client"

import { useState } from "react"
import { 
  Search, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Star,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/layout/sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"

// Sample data for the chart
const chartData = [
  { month: "Jan", conversations: 45, leads: 12, conversions: 8 },
  { month: "Feb", conversations: 52, leads: 18, conversions: 11 },
  { month: "Mar", conversations: 48, leads: 15, conversions: 9 },
  { month: "Apr", conversations: 61, leads: 22, conversions: 14 },
  { month: "May", conversations: 55, leads: 19, conversions: 12 },
  { month: "Jun", conversations: 67, leads: 28, conversions: 18 },
]

// Sample card data
const cardData = [
  {
    id: 1,
    title: "Lead Generation",
    description: "Automated lead capture and qualification through intelligent conversations",
    metric: "156 leads",
    change: "+23%",
    icon: Users,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    title: "Conversation Analytics", 
    description: "Deep insights into conversation patterns and engagement metrics",
    metric: "892 chats",
    change: "+18%",
    icon: MessageSquare,
    color: "from-green-500 to-green-600"
  },
  {
    id: 3,
    title: "Performance Tracking",
    description: "Monitor AI response quality and conversation success rates",
    metric: "94.2% accuracy",
    change: "+5%",
    icon: TrendingUp,
    color: "from-purple-500 to-purple-600"
  },
  {
    id: 4,
    title: "Customer Satisfaction",
    description: "Track customer satisfaction scores and feedback trends",
    metric: "4.8/5 rating",
    change: "+12%",
    icon: Star,
    color: "from-orange-500 to-orange-600"
  },
  {
    id: 5,
    title: "Response Time",
    description: "Average response time for AI-powered conversations",
    metric: "1.2s avg",
    change: "-8%",
    icon: Clock,
    color: "from-teal-500 to-teal-600"
  },
]

// Stats data for the right side
const statsData = [
  { label: "Total Conversations", value: "1,234", change: "+12.5%", positive: true },
  { label: "Active Users", value: "89", change: "+8.2%", positive: true },
  { label: "Conversion Rate", value: "24.8%", change: "+3.1%", positive: true },
  { label: "Avg. Session Time", value: "8m 32s", change: "-2.3%", positive: false },
]

export default function DashboardPage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  
  const cardsPerView = 3
  const maxIndex = Math.max(0, cardData.length - cardsPerView)
  
  const nextCards = () => {
    setCurrentCardIndex(prev => Math.min(prev + 1, maxIndex))
  }
  
  const prevCards = () => {
    setCurrentCardIndex(prev => Math.max(prev - 1, 0))
  }

  return (
    <ProtectedRoute>
      <Sidebar>
        <div className="flex-1 overflow-auto relative">
          {/* Animated Gradient Background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse orb-1"></div>
            <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse orb-2"></div>
            <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-gradient-to-r from-teal-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse orb-1" style={{animationDelay: '-3s'}}></div>
          </div>
          
          <div className="relative p-6 lg:p-8 space-y-8">
            {/* Header */}
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600 bg-clip-text text-transparent animate-fade-in">
                Dashboard
              </h1>
              <p className="text-muted-foreground text-lg lg:text-xl animate-slide-up">
                Welcome back! Here's what's happening with your AI assistant.
              </p>
            </div>

            {/* Central Search Bar */}
            <div className="relative max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl transition-all duration-300 group-focus-within:from-blue-500/30 group-focus-within:to-purple-500/30"></div>
                <div className="relative glass-card rounded-2xl">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg rounded-2xl border-0 bg-transparent focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 shadow-none text-foreground placeholder:text-muted-foreground"
                    placeholder="Search functions, analytics, conversations..."
                    type="text"
                  />
                </div>
              </div>
            </div>

            {/* Horizontal Card Carousel */}
            <div className="space-y-4 animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Analytics Overview
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevCards}
                    disabled={currentCardIndex === 0}
                    className="h-10 w-10 rounded-xl glass border-border hover:bg-muted/50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextCards}
                    disabled={currentCardIndex >= maxIndex}
                    className="h-10 w-10 rounded-xl glass border-border hover:bg-muted/50 disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            
            <div className="relative overflow-hidden">
              <div 
                className="flex gap-6 transition-transform duration-300 ease-out"
                style={{
                  transform: `translateX(-${currentCardIndex * (100 / cardsPerView)}%)`
                }}
              >
                {cardData.map((card) => {
                  const Icon = card.icon
                  return (
                    <div 
                      key={card.id}
                      className="flex-shrink-0 w-full max-w-sm"
                    >
                      <Card className="group glass-card hover:scale-105 transition-all duration-300 cursor-pointer border-border hover:border-border/60 shadow-xl hover:shadow-2xl">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} shadow-lg`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-foreground">{card.metric}</p>
                              <p className={`text-sm font-medium ${
                                card.change.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                {card.change}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <h3 className="font-semibold text-lg mb-2 text-foreground">{card.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {card.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

            {/* Graph and Stats Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-slide-up" style={{animationDelay: '0.6s'}}>
              {/* Chart */}
              <div className="xl:col-span-2">
                <Card className="glass-card border-border shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                          Conversation Trends
                        </CardTitle>
                        <p className="text-muted-foreground mt-1">Monthly overview of conversations and conversions</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-500"></div>
                          <span className="text-muted-foreground">Conversations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"></div>
                          <span className="text-muted-foreground">Conversions</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="conversationsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="conversionsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-20" stroke="currentColor" strokeOpacity={0.1} />
                        <XAxis 
                          dataKey="month" 
                          className="text-xs"
                          tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
                          axisLine={{ stroke: 'currentColor', strokeOpacity: 0.1 }}
                        />
                        <YAxis 
                          className="text-xs"
                          tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
                          axisLine={{ stroke: 'currentColor', strokeOpacity: 0.1 }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            color: 'hsl(var(--foreground))'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="conversations"
                          stroke="#60a5fa"
                          strokeWidth={2}
                          fill="url(#conversationsGradient)"
                        />
                        <Area
                          type="monotone"
                          dataKey="conversions"
                          stroke="#34d399"
                          strokeWidth={2}
                          fill="url(#conversionsGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

              {/* Stats Panel */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Key Metrics
                </h3>
                <div className="space-y-4">
                  {statsData.map((stat, index) => (
                    <Card key={index} className="glass-card border-border hover:border-border/60 hover:shadow-xl transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                              stat.positive 
                                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                                : 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
                            }`}>
                              {stat.change}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Quick Actions Card */}
                  <Card className="glass-card border-border bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-3 text-foreground">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Report
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          View All Chats
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Export Analytics
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Sidebar>
    </ProtectedRoute>
  )
}