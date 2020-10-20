import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Navbar from "./Navbar";
import Footer from './footer';
import AboutPage from "./aboutPage/AboutPage";

import { ImageSelectableDemo } from './modules/computerVision/imageSelector/ImageSelectableDemo';
import GaussianBlurDemo from './modules/computerVision/gaussianBlur/GaussianBlurDemo';
import DoG from './modules/computerVision/diffofgaussian/DiffOfGaussian.tsx';
import HaarWaveletDemo from './modules/computerVision/haarWavelet/HaarWaveletDemo';
import './App.css';
import GaborDemo from './modules/computerVision/gaborFilter/gaborFilter';

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
            <Route path="/gaussian" 
              render={() => <ImageSelectableDemo Demo={GaussianBlurDemo} initImg='purpleFlowers.jpeg'/>}
            />
          </Switch>
          <Switch>
            <Route path="/gabor" 
              render={() => <ImageSelectableDemo Demo={GaborDemo} initImg='zebra.jpg'/>}
            />
          </Switch>
          <Switch>
            <Route path="/dog" 
              render={() => <ImageSelectableDemo Demo={DoG} initImg='teddyBear.jpg'/>}
            />
          </Switch>
          <Switch>
            <Route path="/haar" 
              render={() => <ImageSelectableDemo Demo={HaarWaveletDemo} initImg='Lenna.png'/>}
            />
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
