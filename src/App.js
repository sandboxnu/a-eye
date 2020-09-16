import React from 'react';
import logo from './sandbox_square_salmon.png';
import './App.css';
import Navbar from "./Navbar";
import AboutPage from "./aboutPage/AboutPage"

function App() {
  return (
    <div className="App">
      <div className="App-header">
          <Navbar />
      </div>

      <div className="page-content">
        <AboutPage/>
      </div>
    {/* <img src={logo} className="App-logo" alt="logo" />
    <p>
      Sandbox A-Eye Project Landing Page
    </p> */}
    </div>
  );
}

export default App;
