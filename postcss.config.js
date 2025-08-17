export default {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    'postcss-import': {},
    'postcss-nesting': {},
    ...(process.env.NODE_ENV === 'production' ? {
      'cssnano': {
        preset: 'default',
      },
    } : {}),
  },
}