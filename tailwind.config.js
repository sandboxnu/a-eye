module.exports = {
  purge: [],
  theme: {
    extend: {
      colors: {
        'teal-a-eye': '#0FD4C0',
        charcoal: '#254053',
        bgdiff: '#cacaca',
        navy: '#394D73',
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
        'about': 'url("./aboutCurve.svg")'
      }),
      backgroundSize: {
        stretchBottom: '103% 50%'
      }
    },
    top: {
      '-1': '-1px'
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
