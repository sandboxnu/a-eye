import React from 'react';
import Navbar from "./Navbar";
import './App.css';
import AboutPage from "./aboutPage/AboutPage"

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <Navbar />
      </div>
      {/* <div className="App-body">
        <p className="font-roboto italic">
          Sandbox A-Eye Project Landing Page
              </p>
      </div> */}
      <main className="font-mono text-lg">
        <AboutPage />
      </main>
    </div>


  );
}

export default App;
