/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#080c15',
          card: '#0f172a',
          surface: '#131e36',
          panel: 'rgba(15, 23, 42, 0.75)',
          border: '#1e293b',
          borderLight: '#334155',
          neonGreen: '#00ff87',
          neonCyan: '#00f2fe',
          neonBlue: '#3b82f6',
          neonPurple: '#a855f7',
          muted: '#94a3b8',
          text: '#f8fafc',
          danger: '#ff3366',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -4px rgba(0, 242, 254, 0.35)',
        'glow-green': '0 0 25px -4px rgba(0, 255, 135, 0.35)',
        'cyber-border': '0 0 10px rgba(0, 242, 254, 0.15)',
      },
    },
  },
  plugins: [],
};
