import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {

    const { userId } = await auth(); // Get user id, null if not authenticated

    if (userId && req.url == "/") { // Redirect signed in users to feed page if they try to access home page
        return NextResponse.redirect(new URL("/feed", req.nextUrl));
    }
    
    if (!isPublicRoute(req)) { // Protect all non-public routes
        await auth.protect()
    }

    return NextResponse.next(); 

});

export const config = {
  
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],

};
