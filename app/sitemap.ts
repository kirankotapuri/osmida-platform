import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastMod = new Date('2026-09-27');
  return [
    {
      url: 'https://osmida.com',
      lastModified: lastMod,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://osmida.com/book',
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://osmida.com/partner',
      lastModified: lastMod,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://partner.osmida.com',
      lastModified: lastMod,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://osmida.com/about',
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://osmida.com/service-area',
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    {
      url: 'https://osmida.com/privacy',
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://osmida.com/privacy-policy',
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://osmida.com/terms',
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://osmida.com/cancellation',
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://osmida.com/my-bookings',
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];
}