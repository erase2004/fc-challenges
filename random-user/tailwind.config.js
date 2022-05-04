const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx,pug}'
  ],
  theme: {
    colors: {
      ...colors,
      'primary': '#6558f5',
      'secondary': '#c1bcfb',
      'substrate': '#dfe6ed'
    },
    extend: {
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ]
}
