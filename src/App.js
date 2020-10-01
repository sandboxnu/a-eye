import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from "./Navbar";
import Footer from './footer';
import './App.css';
import AboutPage from "./aboutPage/AboutPage"
import LandingPage from "./landingPage/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="App-header">
          <Navbar />
        </div>
        <main className="font-mono text-lg">
          <Switch>
            <Route path="/home" component={LandingPage} />
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
