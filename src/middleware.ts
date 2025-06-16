import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: [
    "/",
    "/new-meeting", // Assuming this should also be accessible or handled post-login
    "/meeting/(.*)", // Allow access to specific meeting pages
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/user-profile(.*)",
    "/api/(.*)" // Assuming API routes should be generally accessible or handle their own auth
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
