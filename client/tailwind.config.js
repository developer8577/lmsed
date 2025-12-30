export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'course-details-heading-small': ['26px', '36px'],
        'course-details-heading-large': ['36px', '44px'],
        'home-heading-small': ['28px', '34px'],
        'home-heading-large': ['48px', '56px'],
        'default': ['15px', '21px']
      },
      gridTemplateColumns: {
        'auto': 'repeat(auto-fit, minmax(200px, 1fr))'
      },
      spacing: {
        'section-height': '500px',
      },
      maxWidth: {
        'course-card': '424px'
      },
      boxShadow: {
        'custom-card': '0px 4px 15px 2px rgba(0,0,0, 0.1)',
      },
      colors: {
        primary: '#3B82F6', // Blue-500
        secondary: '#6366F1', // Indigo-500
        accent: '#8B5CF6', // Violet-500
        'dark-bg': '#0F172A',
        'light-bg': '#F8FAFC',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
        'glass': 'linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.3) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
