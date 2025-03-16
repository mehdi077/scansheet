module.exports = {
  theme: {
    extend: {
      keyframes: {
        'scan-line': {
          '0%': { top: '0%' },
          '100%': { top: '100%' }
        }
      },
      animation: {
        'scan-line': 'scan-line 2s ease-in-out infinite alternate'
      }
    }
  }
} 