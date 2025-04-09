export const categories = [
  {
    key: 'legal',
    subcategories: [
      {
        key: 'termsAndConditions',
        link: paths.termsAndConditions,
      },
      {
        key: 'cancellationRights',
        link: paths.cancellationRights,
      },
      {
        key: 'legalDisclosure',
        link: paths.legalDisclosure,
      },
      {
        key: 'privacyPolicy',
        link: paths.privacyPolicy,
      },
      {
        key: 'cancellationForm',
        link: paths.cancellationForm,
      },
      {
        key: 'batteryInfo',
        link: "/info/batteriehinweis",
      },
      {
        key: 'paymentInfo',
        link: "/webshop/zahlungsarten",
      },
      {
        key: 'shippingInfo',
        link: "/webshop/versand",
      },
      {
        key: 'faqInfo',
        link: "/bestellvorgang/hilfe-und-haeufige-fragen",
      },
      {
        key: 'cookiesInfo',
        link: "/cookie",
      },
    ],
  },
  {
    key: 'additional',
    subcategories: [
      {
      key: 'sizesInfo',
      link: "/kostuem-groessen"
      },
      {
        key: 'retoureInfo',
        link: "/info/ruecksendungen-retouren"
      },
      {
        key: 'couponsInfo',
        link: "/info/gutscheine"
      },
      {
        key: 'winInfo',
        link: "/gewinnspiel"
      },
    ],
  },
  {
    key: 'contact',
    subcategories: [
      {
        key: 'contact',
        link: '/contact',
      },
    ],
  },
];
