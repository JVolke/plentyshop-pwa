import { eventHandler, setHeader } from 'h3';

export default eventHandler((event) => {
  setHeader(event, 'Content-Type', 'application/manifest+json');
  setHeader(event, 'Cache-Control', 'public, max-age=0, must-revalidate');

  return {
    name: process.env.NUXT_PUBLIC_OG_TITLE || process.env.OG_TITLE || 'Krause & Sohn Onlineshop',
    short_name: process.env.NUXT_PUBLIC_OG_TITLE || process.env.OG_TITLE || 'Krause & Sohn Onlineshop',
    description:
      process.env.NUXT_PUBLIC_META_DESCRIPTION ||
      process.env.METADESC ||
      'Kostüme, Fackeln & Deko kaufen | Krause & Sohn',
    theme_color: process.env.NUXT_PUBLIC_PRIMARY_COLOR || '#066044',
    background_color: '#ffffff',
    display: 'standalone',
    start_url: '/',
    scope: '/',
    icons: [
      {
        src: '/_nuxt-plenty/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/_nuxt-plenty/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/_nuxt-plenty/icons/icon-512x512.maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
});
