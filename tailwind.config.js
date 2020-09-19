module.exports = {
  purge: [],
  theme: {
    extend: {
      colors: {
        teal: '#0FD4C0',
        charcoal: '#254053',
        bgdiff: '#bba5a5',
        navy: '#394D73',
        transteal: '#46B4A72C',
        navygreen: '#254053',
        offwhite: '#f2f2f2'
      },
      backgroundImage: theme => ({
        'test': 'url("https://i.pinimg.com/originals/f4/db/17/f4db1762ff708a55014c55edf3b10fd0.png")'
      })
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
