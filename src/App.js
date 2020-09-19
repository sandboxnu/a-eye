import React from 'react';
import Navbar from "./Navbar";
import logo from './sandbox_square_salmon.png';
import './App.css';
import AboutPage from "./aboutPage/AboutPage"

function App() {
  return (
    <div className="App">
      <div className="App-header">
          <Navbar />
      </div>

      <main className="font-mono text-lg"> 
        <AboutPage/> 
      </main>
    </div>
  );
}

export default App;
