"use client"

import { Search, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Conversation {
  id: string
  name: string
  lastMessage: string
  time: string
  avatar: string
  isActive?: boolean
}

interface ConversationSidebarProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelectConversation: (id: string) => void
}

export function ConversationSidebar({ 
  conversations, 
  selectedId, 
  onSelectConversation 
}: ConversationSidebarProps) {
  return (
    <div className="flex w-full flex-col relative h-full">
      {/* Header with search and filters */}
      <div className="flex flex-col gap-6 p-4 md:p-6 border-b border-white/10 flex-shrink-0">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-xl blur-xl transition-all duration-300 group-focus-within:from-teal-500/30 group-focus-within:to-blue-500/30"></div>
          <div className="relative glass-card rounded-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-teal-400 transition-colors" />
            <Input
              className="pl-12 h-12 rounded-xl border-0 bg-transparent focus:ring-2 focus:ring-teal-400/50 transition-all duration-200 shadow-none text-foreground placeholder:text-muted-foreground"
              placeholder="Search conversations"
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="rounded-xl bg-gradient-to-r from-teal-500/20 to-blue-500/20 text-teal-300 hover:from-teal-500/30 hover:to-blue-500/30 text-sm px-4 py-2 font-medium shadow-lg border border-teal-400/30 backdrop-blur-sm transition-all duration-200"
            >
              All
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="rounded-xl text-sm px-4 py-2 font-medium hover:bg-muted/80 transition-all duration-200 text-muted-foreground hover:text-foreground border border-border/50"
            >
              Unread
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm font-medium hover:bg-muted/50 rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground"
          >
            Requests
          </Button>
        </div>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 min-h-0">
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                "group relative flex cursor-pointer items-center gap-4 rounded-xl p-4 transition-all duration-200 hover:bg-white/10 hover:shadow-lg backdrop-blur-sm",
                selectedId === conversation.id && 
                "bg-gradient-to-r from-teal-500/20 to-blue-500/20 border border-teal-400/30 shadow-lg ring-1 ring-teal-400/20 backdrop-blur-sm"
              )}
              onClick={() => onSelectConversation(conversation.id)}
            >
              {/* Active indicator */}
              {selectedId === conversation.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-teal-400 to-blue-400 rounded-r-full shadow-lg"></div>
              )}
              
              <div className="relative flex-shrink-0">
                <Avatar className="h-12 w-12 md:h-14 md:w-14 ring-2 ring-border shadow-lg">
                  <AvatarImage src={conversation.avatar} alt={conversation.name} />
                  <AvatarFallback className="bg-gradient-to-br from-teal-500/20 to-blue-500/20 text-teal-600 dark:text-teal-300 font-semibold border border-teal-400/30">
                    {conversation.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {conversation.isActive && (
                  <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background bg-emerald-500 shadow-lg"></span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-foreground truncate text-sm md:text-base">
                    {conversation.name}
                  </p>
                  <p className="text-xs text-muted-foreground flex-shrink-0 ml-3 font-medium">
                    {conversation.time}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground truncate leading-relaxed">
                  {conversation.lastMessage}
                </p>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-muted/80 text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}