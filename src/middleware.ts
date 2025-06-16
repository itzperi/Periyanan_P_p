import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define routes that should be public
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/genkit(.*)', // Assuming Genkit flows are served under /api/genkit
  // Add any other specific public routes here
]);

// Define routes that should be ignored by Clerk (e.g., static assets, _next)
// The default matcher in clerkMiddleware handles most of this,
// but you can customize if needed.
// const isIgnoredRoute = createRouteMatcher(['/ignored-route(.*)']);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    return; // Allow access to public routes
  }

  // For all other routes, require authentication
  auth().protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
