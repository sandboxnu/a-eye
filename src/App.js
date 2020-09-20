import React from 'react';
import Navbar from "./Navbar";
import './App.css';
import Kmeans from './kmeans';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
  return (

    <BrowserRouter>
      <div className="App">
        <div className="App-header">
          <Navbar />
        </div>
        <main className="font-mono text-lg">
          <Switch>
            <Route path="/kmeans" component={Kmeans} />
          </Switch>
        </main>
      </div>
    </BrowserRouter>

  );
}

export default App;
