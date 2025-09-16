import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token
    
    // Protected routes
    const protectedRoutes = ["/dashboard", "/chats", "/settings", "/profile"]
    
    // Check if current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    )
    
    // If it's a protected route and no token, redirect to signin
    if (isProtectedRoute && !token) {
      const signInUrl = new URL("/signin", req.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }
    
    // If user is authenticated and tries to access auth pages, redirect to dashboard
    if (token && (pathname === "/signin" || pathname === "/signup")) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Always allow access to public routes
        if (pathname === "/" || 
            pathname === "/signin" || 
            pathname === "/signup" ||
            pathname.startsWith("/api/auth") ||
            pathname.startsWith("/_next") ||
            pathname.startsWith("/favicon.ico")) {
          return true
        }
        
        // For protected routes, check if user has token
        const protectedRoutes = ["/dashboard", "/chats", "/settings", "/profile"]
        const isProtectedRoute = protectedRoutes.some(route => 
          pathname.startsWith(route)
        )
        
        if (isProtectedRoute) {
          return !!token
        }
        
        // Allow all other routes
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and images
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}