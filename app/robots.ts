import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://sociaverse.in'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/settings/', '/notifications/', '/chat/', '/create/', '/u/*/edit'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
