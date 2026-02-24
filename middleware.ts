import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Skip static files/images that the matcher might miss (e.g. nested assets or paths containing a dot)
    if (
        path.startsWith('/_next/') ||
        path.startsWith('/api/') ||
        path.includes('.')
    ) {
        return NextResponse.next();
    }

    // Check if maintenance mode is enabled
    const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

    if (isMaintenanceMode) {
        if (path !== '/maintenance') {
            return NextResponse.redirect(new URL('/maintenance', request.url));
        }
        return NextResponse.next();
    }

    // If maintenance mode is false, but trying to access /maintenance, redirect to home
    if (!isMaintenanceMode && path === '/maintenance') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Check if waitlist mode is enabled
    const isWaitlistMode = process.env.NEXT_PUBLIC_WAITLIST_MODE === 'true';

    if (isWaitlistMode) {
        // Allowed paths during waitlist mode
        const allowedPaths = ['/', '/join-waitlist', '/features', '/team'];

        // Check if the current path is allowed
        const isAllowed = allowedPaths.includes(path);

        if (!isAllowed) {
            // Rewrite to a non-existent route to safely trigger the Next.js `not-found.tsx` page
            return NextResponse.rewrite(new URL('/404', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
