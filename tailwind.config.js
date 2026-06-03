/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        monthly: { DEFAULT: '#BA7517', bg: '#FAEEDA', text: '#633806', border: '#E8C88A' },
        jeonse:  { DEFAULT: '#185FA5', bg: '#E6F1FB', text: '#0C447C', border: '#A8C8E8' },
        sale:    { DEFAULT: '#534AB7', bg: '#EEEDFE', text: '#3C3489', border: '#B8B4E8' },
        danger:  { DEFAULT: '#E24B4A', bg: '#FCEBEB', text: '#791F1F', border: '#F5BABA' },
        success: { DEFAULT: '#639922', bg: '#EAF3DE', text: '#27500A', border: '#B0D48A' },
      },
      maxWidth: { mobile: '480px' },
    },
  },
  plugins: [],
}
