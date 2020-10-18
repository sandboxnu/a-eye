import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from "./Navbar";
import Footer from './footer';
import './App.css';
import AboutPage from "./aboutPage/AboutPage"
import LandingPage from "./landingPage/LandingPage";
import ModulePage from "./modulePage/ModulePage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="App-header">
          <Navbar />
        </div>
        <main className="font-mono text-lg font-charcoal">
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/home" component={LandingPage} />
            <Route path="/modules/:module" component={ModulePage} />
            <Route path="/about" component={AboutPage} />
          </Switch>
        </main>
        <div>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
