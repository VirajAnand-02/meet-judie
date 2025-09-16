"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sidebar } from "@/components/layout/sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { 
  Settings, 
  User, 
  Bell, 
  Lock, 
  Link, 
  Instagram, 
  Facebook, 
  MessageCircle, 
  Linkedin,
  Check,
  X,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function SettingsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  
  // Form states
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    bio: ""
  })
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  
  // Connection states
  const [connections, setConnections] = useState({
    instagram: { connected: false, username: "" },
    facebook: { connected: false, username: "", available: false },
    whatsapp: { connected: false, username: "", available: false },
    linkedin: { connected: false, username: "", available: false }
  })

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const { user } = await response.json()
          setProfileData({
            name: user.name || "",
            email: user.email || "",
            bio: user.bio || ""
          })
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
      }
    }

    if (session?.user?.id) {
      fetchUserProfile()
    }
  }, [session?.user?.id])

  // Handle profile update
  const handleUpdateProfile = async () => {
    setIsProfileLoading(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          bio: profileData.bio
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update profile')
      }

      const result = await response.json()
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })

      // Update session data if needed
      // Note: NextAuth session will be updated on next page refresh
      
    } catch (error) {
      console.error('Profile update error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsProfileLoading(false)
    }
  }

  // Handle password change
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match.",
        variant: "destructive"
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long and contain uppercase, lowercase, and numbers.",
        variant: "destructive"
      })
      return
    }

    setIsPasswordLoading(true)
    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to change password')
      }

      toast({
        title: "Password Changed",
        description: "Your password has been changed successfully.",
      })
      
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setIsChangePasswordOpen(false)
    } catch (error) {
      console.error('Password change error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to change password. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsPasswordLoading(false)
    }
  }

  // Handle Instagram connection
  const handleInstagramConnect = async () => {
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setConnections(prev => ({
        ...prev,
        instagram: { connected: true, username: "@judie_ai_user" }
      }))
      
      toast({
        title: "Instagram Connected",
        description: "Successfully connected your Instagram account.",
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect Instagram. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Handle disconnection
  const handleDisconnect = (platform: string) => {
    setConnections(prev => ({
      ...prev,
      [platform]: { connected: false, username: "" }
    }))
    
    toast({
      title: "Disconnected",
      description: `Successfully disconnected from ${platform}.`,
    })
  }

  return (
    <ProtectedRoute>
      <Sidebar>
        <div className="flex-1 overflow-auto bg-background">
          <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-3">
                <Settings className="h-8 w-8" />
                Settings
              </h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>

            <div className="grid gap-6">
              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Settings
                  </CardTitle>
                  <CardDescription>
                    Update your profile information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us a little about yourself..."
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground">{profileData.bio.length}/500 characters</p>
                  </div>
                  <Button 
                    onClick={handleUpdateProfile} 
                    disabled={isProfileLoading}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    {isProfileLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>

              {/* Account Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Account Security
                  </CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            Change Password
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogDescription>
                              Enter your current password and choose a new one.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <Input
                                id="currentPassword"
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                placeholder="Enter current password"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newPassword">New Password</Label>
                              <Input
                                id="newPassword"
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                placeholder="Enter new password"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirm New Password</Label>
                              <Input
                                id="confirmPassword"
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                placeholder="Confirm new password"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleChangePassword} 
                              disabled={isPasswordLoading}
                              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                            >
                              {isPasswordLoading ? "Changing..." : "Change Password"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <p className="text-sm text-muted-foreground mt-2">
                        Update your password to keep your account secure
                      </p>
                    </div>
                    <div>
                      <Button variant="outline" disabled>
                        Enable Two-Factor Authentication
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        Add an extra layer of security to your account (Coming Soon)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media Connections */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    Social Media Connections
                  </CardTitle>
                  <CardDescription>
                    Connect your social media accounts to expand your reach
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-6">
                    {/* Instagram */}
                    <div className="flex items-center justify-between p-4 border rounded-lg glass-card border-border">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500/20 to-purple-500/20">
                          <Instagram className="h-6 w-6 text-pink-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">Instagram</h4>
                          <p className="text-sm text-muted-foreground">
                            {connections.instagram.connected 
                              ? `Connected as ${connections.instagram.username}` 
                              : "Connect your Instagram account"
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {connections.instagram.connected ? (
                          <>
                            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                              <Check className="h-4 w-4" />
                              <span className="text-sm font-medium">Connected</span>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDisconnect('instagram')}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button 
                            onClick={handleInstagramConnect}
                            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Facebook */}
                    <div className="flex items-center justify-between p-4 border rounded-lg glass-card border-border opacity-60">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-600/20">
                          <Facebook className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">Facebook</h4>
                          <p className="text-sm text-muted-foreground">
                            Connect your Facebook account
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Available Soon</span>
                        </div>
                        <Button variant="outline" size="sm" disabled>
                          Connect
                        </Button>
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="flex items-center justify-between p-4 border rounded-lg glass-card border-border opacity-60">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-green-600/20">
                          <MessageCircle className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">WhatsApp Business</h4>
                          <p className="text-sm text-muted-foreground">
                            Connect your WhatsApp Business account
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Available Soon</span>
                        </div>
                        <Button variant="outline" size="sm" disabled>
                          Connect
                        </Button>
                      </div>
                    </div>

                    {/* LinkedIn / Sales Navigator */}
                    <div className="flex items-center justify-between p-4 border rounded-lg glass-card border-border opacity-60">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600/20 to-blue-700/20">
                          <Linkedin className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">LinkedIn / Sales Navigator</h4>
                          <p className="text-sm text-muted-foreground">
                            Connect your LinkedIn and Sales Navigator accounts
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Available Soon</span>
                        </div>
                        <Button variant="outline" size="sm" disabled>
                          Connect
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Control how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive email updates about your account
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications in your browser
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
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