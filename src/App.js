import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Navbar from "./Navbar";
import Footer from './footer';
import AboutPage from "./aboutPage/AboutPage";
import Gabor from "./modules/computerVision/gaborFilter/gaborFilter"
import GaussianBlurDemo from './modules/computerVision/gaussianBlur/GaussianBlurDemo';
import './App.css';

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
            <Route path="/about" component={AboutPage} />
          </Switch>
          <Switch>
            <Route path="/home" component={GaussianBlurDemo} />
          </Switch>
          <Switch>
            <Route path="/gabor" component={Gabor} />
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

// change colors as needed idk
const THEME = createMuiTheme({
  palette: {
    primary: {
      main: '#394D73' // same as footer color
    },
    secondary: {
      main: '#0FD4C0' // logo teal
    },
  },
});

export default App;
