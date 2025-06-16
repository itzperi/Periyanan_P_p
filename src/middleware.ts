import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  // Add any routes here that you want to protect
  // '/dashboard(.*)',
  // '/settings(.*)',
]);

// Define public routes. These routes will be accessible without authentication.
const publicRoutes = [
  "/", // Make the homepage public
  "/new-meeting(.*)", // Allow access to new meeting creation
  "/meeting/(.*)", // Allow access to specific meeting pages
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/user-profile(.*)",
  "/api/genkit/(.*)", // Example for Genkit API routes if they need to be public
  // Add any other public routes, e.g., marketing pages, API endpoints for webhooks
];

export default clerkMiddleware((auth, req) => {
  if (publicRoutes.some(path => new RegExp(`^${path.replace('(.*)', '.*')}$`).test(req.nextUrl.pathname))) {
    return; // Do not protect public routes
  }
  if (isProtectedRoute(req)) {
    auth().protect(); // Protect specific routes
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
