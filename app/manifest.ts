import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MediHelp - Unified Healthcare',
    short_name: 'MediHelp',
    description: 'A unified healthcare platform for patients and doctors.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#175ada',
    icons: [
      {
        src: '/favicon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
