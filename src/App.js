import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from "./Navbar";
import Footer from './footer';
import './App.css';
import AboutPage from "./aboutPage/AboutPage"
import Gabor from "./gaussianBlur/gaborFilter"
import GaussianBlurDemo from './gaussianBlur/GaussianBlurDemo';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
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
      </div>
    </BrowserRouter>
  );
}

export default App;
