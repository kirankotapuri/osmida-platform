import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Osmida Nellore',
    short_name: 'Osmida',
    description: 'Pest Control, AC Service & Home Deep Cleaning in Nellore',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon.png',
        sizes: '816x816',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '816x816',
        type: 'image/png',
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
