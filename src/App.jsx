/* eslint-disable */
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import brokenLink from './404_page/404_page';
import Navbar from './Navbar';
import Footer from './footer';

import './index.css';
import AboutPage from './aboutPage/AboutPage';
import LandingPage from './landingPage/LandingPage';
import ModulePage from './modulePage/ModulePage';

// change colors as needed
const THEME = createMuiTheme({
  palette: {
    primary: {
      main: '#394D73', // same as footer color
    },
    secondary: {
      main: '#0FD4C0', // logo teal
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <div className="App" id="app">
        <ThemeProvider theme={THEME}>
          <div className="App-header">
            <Navbar />
          </div>
          <main className="font-mono text-lg font-charcoal">
            <Switch>
              <Route exact path="/" component={LandingPage} />
              <Route path="/home" component={LandingPage} />
              <Route path="/modules/:module" component={ModulePage} />
              <Route path="/about" component={AboutPage} />
              <Route path="/*" component={brokenLink} />
            </Switch>
          </main>
          <div>
            <Footer />
          </div>
        </ThemeProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
