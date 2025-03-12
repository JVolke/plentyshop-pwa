export const appConfiguration = {
  head: {
    viewport: 'minimum-scale=1, initial-scale=1, width=device-width',
    htmlAttrs: {
      lang: process.env.DEFAULTLANGUAGE ?? 'de',
    },
    meta: [
      { name: 'shop-name', content: process.env.STORENAME || 'Krause & Sohn Onlineshop' },
      { name: 'description', content: process.env.METADESC || 'Onlineshop der Firma Krause & Sohn' },
      { name: 'keywords', content: process.env.METAKEYWORDS || 'Krause & sohn, Onlineshop, PWA' },
      { name: 'theme-color', content: '#e14000' },
      { property: 'og:title', content: process.env.OGTITLE || 'Krause & Sohn Onlineshop\'' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: process.env.OGIMAGE || '' },
      { property: 'og:url', content: process.env.API_ENDPOINT },
    ],
    link: [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/favicon.ico' },
    ],
    title: process.env.STORENAME || 'Krause & Sohn Onlineshop',
  },
};
