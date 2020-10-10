import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from "./Navbar";
import Footer from './footer';
import './App.css';
import AboutPage from "./aboutPage/AboutPage";
import Gabor from "./modules/computerVision/gaborFilter/gaborFilter"
import GaussianBlurDemo from './modules/computerVision/gaussianBlur/GaussianBlurDemo';
import DoG from './modules/computerVision/diffofgaussian/DiffOfGaussian.tsx';

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
          <Switch>
            <Route path="/dog" component={DoG} />
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
