import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from "./Navbar";
import './App.css';
import AboutPage from "./aboutPage/AboutPage"

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="App-header">
          <Navbar />
        </div>
        <main className="font-mono text-lg">
          <Switch>
            <Route path="/about" component={AboutPage} />
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
