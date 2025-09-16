"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/layout/sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { User, Calendar, Mail, Shield } from "lucide-react"

export default function ProfilePage() {
  const { data: session } = useSession()
  
  const joinDate = session?.user ? new Date().toLocaleDateString() : "Unknown"

  return (
    <ProtectedRoute>
      <Sidebar>
        <div className="flex-1 overflow-auto bg-background">
          <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-3">
                <User className="h-8 w-8" />
                Profile
              </h1>
              <p className="text-muted-foreground">
                View and manage your profile information
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Profile Info */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Your account details and personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-3xl">
                          {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-br from-primary/50 to-primary/20 rounded-2xl blur-lg opacity-50 -z-10"></div>
                    </div>
                    <div className="space-y-4 flex-1">
                      <div>
                        <h3 className="text-2xl font-semibold">
                          {session?.user?.name || "User Name"}
                        </h3>
                        <p className="text-muted-foreground">
                          {session?.user?.email || "user@example.com"}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <Button>Edit Profile</Button>
                        <Button variant="outline">Change Avatar</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Account Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Member since</span>
                    <span className="font-medium">{joinDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total chats</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Messages sent</span>
                    <span className="font-medium">248</span>
                  </div>
                </CardContent>
              </Card>

              {/* Account Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Password</p>
                      <p className="text-sm text-muted-foreground">Last updated 30 days ago</p>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Auth</p>
                      <p className="text-sm text-muted-foreground">Not enabled</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Sidebar>
    </ProtectedRoute>
  )
}