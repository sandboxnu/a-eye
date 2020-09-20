import React from 'react';
import Navbar from "./Navbar";
import './App.css';
import Kmeans from './kmeans';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
  return (

    <BrowserRouter>
      <div>
          <Switch>
            <Route path="/kmeans" component={Kmeans}/>
          <Route component={Error}/>
          </Switch>
      </div> 
    </BrowserRouter>

  );
}

export default App;
