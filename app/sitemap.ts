import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://sociaverse.in'

    // Static Routes
    const routes = [
        '',
        '/explore',
        '/marketplace',
        '/events',
        '/community',
        '/games',
        '/socialink',
        '/features',
        '/legal',
        '/login',
        '/signup',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return [...routes]
}
