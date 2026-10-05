import { auth } from "@/auth";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;

    const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
    const isApiAuthRoute = pathname.startsWith("/api/auth");
    const isPublicRoute = pathname === "/";

    if (isApiAuthRoute) {
        return; // allow by default
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL("/dashboard", req.nextUrl));
        }
        return;
    }

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/login", req.nextUrl));
    }
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
