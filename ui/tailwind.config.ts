import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {      
      colors: {
        'primary': '#68e2fa',
        'secondary': '#EE1D52',
        'textBody': '#cecece', 
      }
    },
    fontFamily: {
      'primary-font': ['Gotham', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Roboto', 'Segoe UI', 'Ubuntu', 'Helvetica Neue', 'sans-serif']
    },  
  },
  plugins: [],
}
export default config