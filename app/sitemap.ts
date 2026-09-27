import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: 'https://osmida.com',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://osmida.com/book',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://osmida.com/partner',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://partner.osmida.com',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://osmida.com/about',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://osmida.com/service-area',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    {
      url: 'https://osmida.com/privacy',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://osmida.com/privacy-policy',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://osmida.com/terms',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://osmida.com/cancellation',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://osmida.com/my-bookings',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];
}