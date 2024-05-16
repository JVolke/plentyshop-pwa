import sfTypography from '@storefront-ui/typography';
import { tailwindConfig } from '@storefront-ui/vue/tailwind-config';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  presets: [tailwindConfig],
  content: ['./**/*.vue', '../../node_modules/@storefront-ui/vue/**/*.{js,mjs}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Red Hat Display"', ...defaultTheme.fontFamily.sans],
        body: ['"Red Hat Text"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          '50': '#f0f6ff',
          '100': '#e1edfd',
          '200': '#bcdafb',
          '300': '#81bdf8',
          '400': '#3d9af3',
          '500': '#147ee3',
          '600': '#075bb6',
          '700': '#074d9d',
          '800': '#0a4282',
          '900': '#0f386b',
          '950': '#0a2447',
        },
        secondary: {
          '50': '#fffde7',
          '100': '#fffcc1',
          '200': '#fff787',
          '300': '#ffea42',
          '400': '#ffd90f',
          '500': '#f1c002',
          '600': '#cf9400',
          '700': '#a56903',
          '800': '#88520b',
          '900': '#74430f',
          '950': '#442204',
        },
      },
      gridTemplateAreas: {
        'product-page': ['left-top right', 'left-bottom right'],
      },
      gridTemplateColumns: {
        'product-page': 'minmax(56%, 500px) auto',
      },
      gridTemplateRows: {
        'category-sidebar': 'min-content auto min-content',
      },
      screens: {
        '4xl': '1920px',
        '3xl': '1536px',
        '2xl': '1366px',
        xl: '1280px',
        lg: '1024px',
        md: '768px',
        sm: '640px',
        xs: '376px',
        '2xs': '360px',
      },
    },
  },
  plugins: [sfTypography, require('@savvywombat/tailwindcss-grid-areas')],
} as Config;
