import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {      
      colors: {
        primary: {
          DEFAULT: '#68E2FA',
          purple:'#9757D7',
          pink: '#EF466F',
          green:'#45B36B',
          backdrop: '#000000e1',
        },
        secondary:{
          DEFAULT:'#3772FF',
          pink: '#E4D7CF',
          yellow: '#FFD166',
          purple:'#CDB4DB',
        },        
      },      
    },
    fontFamily: {
      primaryfont: ['Gotham', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Roboto', 'Segoe UI', 'Ubuntu', 'Helvetica Neue', 'sans-serif'],      
    },  
  },  
  plugins: [],
}
export default config