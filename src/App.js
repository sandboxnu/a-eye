import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Navbar from "./Navbar";
import Footer from './footer';

import './App.css';
import AboutPage from "./aboutPage/AboutPage"
import LandingPage from "./landingPage/LandingPage";
import ModulePage from "./modulePage/ModulePage";
import MPNeuron from "./modules/perceptrons/mpNeuron/MPNeuron";
import RosenblattDemo from "./modules/perceptrons/rosenblatt/RosenblattDemo";
import RblattVectorsDemo from "./modules/perceptrons/rblattVectors/RblattVectorsDemo.tsx";

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
            <Route path="/neuron" component={MPNeuron} />
            <Route path="/rblatt" component={RosenblattDemo} />
            <Route path="/vector" component={RblattVectorsDemo} />
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
