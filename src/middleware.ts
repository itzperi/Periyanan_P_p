
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: [
    '/', // Allow access to the homepage
    '/new-meeting', // Allow access to the new meeting page
    '/sign-in(.*)', // Clerk sign-in routes
    '/sign-up(.*)', // Clerk sign-up routes
    '/api(.*)', // Allow API routes (if any are public)
  ]
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
