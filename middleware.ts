import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getAdminRole } from "@/lib/roles";

const isAdminPage = createRouteMatcher([
  "/dashboard(.*)",
  "/articles(.*)",
  "/categories(.*)",
  "/review(.*)",
  "/users(.*)",
]);

const isApiRoute = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminPage(req) || isApiRoute(req)) {
    // Require sign-in for all admin/api routes
    const { userId } = await auth.protect();

    // API handlers check the whitelist via requireAuth() and return JSON errors;
    // admin pages must check here, since layouts don't re-run on client navigation
    if (isAdminPage(req)) {
      const user = await (await clerkClient()).users.getUser(userId);
      const email = user.emailAddresses[0]?.emailAddress;
      if (!email || getAdminRole(email) === "none") {
        return new NextResponse("Forbidden — your email is not whitelisted.", { status: 403 });
      }
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
