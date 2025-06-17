import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  experimental_skipClerkCSP: true,
  // You can still define public routes here if needed,
  // but for now, we'll keep it simple to test the CSP fix.
  // publicRoutes: ["/", "/sign-in", "/sign-up", "/api/genkit(.*)"],
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
