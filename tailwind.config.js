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
        scrollBox: '#8D9DBA',
        lightblue: '#CBD9F2',
        darkblue: '#394D73',
        moduleDarkBlue: '#010326',
        modulePaleBlue: '#CBD9F2',
        moduleTeal: '#0FD4C0',
        moduleOffwhite: '#F2F2F2',
        moduleNavy: '#394D73',
        brightOrange: '#f15e2c',
        lightNavy: '#5e76a2'
      },
      fontFamily: {
        opensans: ["open sans", "sans-serif"],
        roboto: ["roboto", "sans-serif"],
        robotoMono: ["roboto-mono", "sans-serif"]
      },
      fontSize: {
        "3.5xl": ['32px'],
        "7xl": ['72px']
      },
      fontWeight: {
        'micro': 25
      },
      backgroundImage: theme => ({
        'about': 'url("../media/aboutCurve.svg")',
        'landing-page': 'url("../media/background_landing_page.svg")'
      }),
      backgroundSize: {
        stretchBottom: '103% 50%'
      },
      borderRadius: {
        module: '64px'
      },
      boxShadow: {
        module: '12px 10px 19px rgba(0, 0, 0, 0.30)',
        spacing: {
          '500px': '500px'
        }
      }
      ,
      top: {
        '-1': '-1px'
      },
      maxHeight: {
        xs: '20rem',
        sm: '24rem',
        md: '28rem',
        lg: '32rem'
      },
      width: {
        '35vw': '35vw'
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
}
