module.exports = {
  important: '#app',
  purge: [],
  theme: {
    extend: {
      colors: {
        'teal-a-eye': '#0FD4C0',
        charcoal: '#254053',
        bgdiff: '#cacaca',
        navy: '#394D73',
        'navy-disabled': '#526790',
        transteal: '#46B4A72C',
        navbar: '#2B4B62',
        offwhite: '#f2f2f2',
        scrollBox: '#8D9DBA'
      },
      fontFamily: {
        opensans: ["open sans", "sans-serif"],
        roboto: ["roboto", "sans-serif"]
      },
      backgroundImage: theme => ({
        'about': 'url("../media/aboutCurve.svg")'
      }),
      backgroundSize: {
        stretchBottom: '103% 50%'
      },
      spacing: {
        '500px': '500px'
      }
    },
    top: {
      '-1': '-1px'
    },
    maxHeight: {
      xs: '20rem',
      sm: '24rem',
      md: '28rem',
      lg: '32rem'
    }
  },
  variants: {
    mixBlendMode: ['responsive'],
    backgroundBlendMode: ['responsive'],
    isolation: ['responsive'],
  },
  plugins: [
    require('tailwindcss-blend-mode')()
  ],
}
