import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'dots': 'url(https://static.milanote.com/image-4cc3496fd809.png)'
      },
      colors: {
        'dark-jungle-green': '#222222'
      },
      gridTemplateColumns: {
        'boards-gallery': 'repeat(auto-fill, minmax(100px, 1fr))'
      },
      gridAutoRows: {
        'boards-gallery': '60px'
      },
      fontFamily: {
        'khula': ['Khula']
      }
    },
  },
  plugins: [],
}
export default config
