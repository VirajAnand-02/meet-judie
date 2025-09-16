"use client"

import { useState, useEffect } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { ConversationSidebar } from "./conversation-sidebar"
import { ChatArea } from "./chat-area"
import { AiAssistantPanel } from "./ai-assistant-panel"

export function ChatLayout() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)

  // Handle ESC key to close chat window
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedConversation) {
        setSelectedConversation(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedConversation])

  const conversations = [
    {
      id: "sophia-carter",
      name: "Sophia Carter",
      lastMessage: "Hey there! How can I help you today?",
      time: "10:30 AM",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC54zdeJY64EpyfgPEVwbcxzoc5Orc0oftK9Sq7UOrBPkQAh69efgGI9l7Cvw82FBBC1OcbFOBUaVv7XpIiqFOum7zmSBBSBTmliHPEXSpTx2eE6Q19RG3ev9cWP0XliRqDLG83VcLLxtjy28FWqyI8zh70VkCeBk33YykWqhsRRiOFumKZwqRsXr2kG0ys_5RF9TsHljCo8DfKzTgOdIF4soYFJFj9G8JU0Gq35LivwlwuyQnW7yXrqt5t5cX7w8-6hpD5c7Ogtfqn",
      isActive: true
    },
    {
      id: "ethan-bennett",
      name: "Ethan Bennett",
      lastMessage: "I'm interested in your coaching services.",
      time: "9:45 AM",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYxPWwJ_ycLC7c4bPg6tXsPDfdiJ53nD05WdyMCtbI0mAphoAQLjk1HQ6k8ElN2lgyTGJaFULEPfMhUe-rt7oErPW2wJ9fBJwFAaOl6xloGp4LGsBU5AgBN261ckLfvGmHJi5gDD0TT5ooxA2vSqzKLYEgq5-7tJgmVOUQgg_MJFmEI0rI_Uzyda-pK_p2HIspv9jYLaL0EUJXMQ0kD0KdcAxu--vuVdQko96wSBsVVvwb-K77s-Nqh-1De45XEntwGpBAFMM1biiY",
      isActive: false
    },
    {
      id: "olivia-hayes",
      name: "Olivia Hayes",
      lastMessage: "Thanks for reaching out!",
      time: "Yesterday",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBJcUQGOp-iPRZ9-XzukNmQN1VtS2ScUjUlhpMRlMrW5DJNnXfILmATOtbT2wzNqTtuTO2aBtMKDxykoB9_u8xSnpjp-yNE7pa6FNM0wpSffSnc8iie5gfHDjBhE4UysaoVL6NetxJnr2ndD8fqvrOj-_neCCSuVhrEbxS6TsnpvLFqsq9uPDyrGsALuHci84uN_9IldsmJYQcC6UrcM1ZNGEuZtq2SkXWQnUWe6VD0R2XmWhWm0S7-l5CxwNT9_Vtl9YLdoegolEc",
      isActive: false
    }
  ]

  return (
    <div className="flex h-full w-full relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-teal-400/15 to-blue-600/15 rounded-full blur-3xl animate-pulse orb-1"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-r from-purple-400/15 to-pink-600/15 rounded-full blur-3xl animate-pulse orb-2"></div>
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-gradient-to-r from-emerald-400/15 to-teal-600/15 rounded-full blur-3xl animate-pulse orb-glow" style={{animationDelay: '-3s'}}></div>
      </div>

      {/* Mobile overlay for conversation sidebar */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden animate-fade-in" 
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Mobile Conversation Sidebar */}
      <div className={`
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'} 
        lg:hidden
        fixed 
        z-50 
        transition-transform duration-300 ease-in-out
        glass-modern border-r border-white/10 shadow-2xl
      `}>
        <ConversationSidebar 
          conversations={conversations}
          selectedId={selectedConversation}
          onSelectConversation={(id: string) => {
            setSelectedConversation(id)
            setShowSidebar(false) // Close sidebar on mobile after selection
          }}
        />
      </div>

      {/* Desktop Resizable Panels */}
      <div className="hidden lg:flex w-full h-full">
        <PanelGroup direction="horizontal" className="w-full h-full">
          {/* Conversation Sidebar Panel */}
          <Panel 
            id="conversation-sidebar"
            defaultSize={25}
            minSize={18}
            maxSize={40}
            className="relative"
          >
            <ConversationSidebar 
              conversations={conversations}
              selectedId={selectedConversation}
              onSelectConversation={setSelectedConversation}
            />
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-2 bg-transparent hover:bg-gradient-to-b hover:from-teal-500/20 hover:to-blue-500/20 transition-colors duration-200 relative group cursor-col-resize">
            <div className="absolute inset-y-0 left-1/2 w-0.5 bg-border/30 group-hover:bg-teal-400/60 transition-colors duration-200 -translate-x-1/2"></div>
            <div className="absolute inset-y-0 left-1/2 w-1 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-teal-400/40 to-blue-400/40 transition-opacity duration-200 -translate-x-1/2 rounded-full"></div>
          </PanelResizeHandle>

          {/* Chat Area Panel */}
          <Panel 
            id="chat-area"
            defaultSize={50}
            minSize={30}
            className="relative"
          >
            <ChatArea 
              conversation={conversations.find(c => c.id === selectedConversation)}
              onToggleSidebar={() => setShowSidebar(!showSidebar)}
            />
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-2 bg-transparent hover:bg-gradient-to-b hover:from-purple-500/20 hover:to-pink-500/20 transition-colors duration-200 relative group cursor-col-resize">
            <div className="absolute inset-y-0 left-1/2 w-0.5 bg-border/30 group-hover:bg-purple-400/60 transition-colors duration-200 -translate-x-1/2"></div>
            <div className="absolute inset-y-0 left-1/2 w-1 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-purple-400/40 to-pink-400/40 transition-opacity duration-200 -translate-x-1/2 rounded-full"></div>
          </PanelResizeHandle>

          {/* AI Assistant Panel */}
          <Panel 
            id="ai-assistant"
            defaultSize={25}
            minSize={18}
            maxSize={40}
            className="relative"
          >
            <AiAssistantPanel 
              conversation={selectedConversation ? conversations.find(c => c.id === selectedConversation) : null}
            />
          </Panel>
        </PanelGroup>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-1">
        <ChatArea 
          conversation={conversations.find(c => c.id === selectedConversation)}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
        />
      </div>
    </div>
  )
}