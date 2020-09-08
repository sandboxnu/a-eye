import React from 'react';
import logo from './sandbox_square_salmon.png';
import './App.css';
import Navbar from "./Navbar";

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
