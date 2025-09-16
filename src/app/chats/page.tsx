"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { ChatLayout } from "@/components/chat/chat-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function ChatsPage() {
  return (
    <ProtectedRoute>
      <Sidebar>
        <div className="flex-1 h-full relative overflow-hidden">
          <ChatLayout />
        </div>
      </Sidebar>
    </ProtectedRoute>
  )
}