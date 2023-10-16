/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative: false,
    files: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ]
  },
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      'primary': {
        light: '#e8f0f7',
        DEFAULT: '#196aab',
        dark: '#135080',
      },
      'secondary': {
        light: '#e6f4fa',
        DEFAULT: '#008ecc',
        dark: '#006b99',
      },
    },
  },
  plugins: [],
}

