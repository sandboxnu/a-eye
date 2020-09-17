import React from 'react';
import Navbar from "./Navbar";
import logo from './sandbox_square_salmon.png';
import './App.css';

function App() {
  return (
      <div className="App">
          <div className="App-header">
              <Navbar />
          </div>

          <img src={logo} className="App-logo" alt="logo" />
          <p>
              Sandbox A-Eye Project Landing Page
          </p>
      </div>
  );
}

export default App;
