import React from 'react';
import Navbar from "./Navbar";
import Footer from './footer';
import './App.css';

function App() {
  return (
      <div className="App">
          <div className="App-header">
              <Navbar />
          </div>
          <div className="App-body">
              <p className="font-roboto italic">
                  Sandbox A-Eye Project Landing Page
              </p>
          </div>
          <div>
              <Footer />
          </div>
      </div>
  );
}

export default App;
