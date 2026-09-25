import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Osmida - Doorstep Home Services Nellore',
    short_name: 'Osmida',
    description: 'Nellore residential home help, bathroom cleaning, kitchen cleaning & dishwashing at flat ₹199/hr.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F4F8F8',
    theme_color: '#0C6266',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
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
