import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Only the authenticated product surfaces require a session. The marketing
// site, auth pages and public APIs stay open.
const isProtectedRoute = createRouteMatcher(["/app(.*)", "/admin(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) {
      return redirectToSignIn({ returnBackUrl: request.url });
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes and Clerk's auto-proxy path
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
