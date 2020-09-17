import React from 'react';
import logo from './sandbox_square_salmon.png';
import './App.css';

function App() {
  return (
    <div className="App bg-red-500">
	<button className="bg-teal-400">Button Name</button>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Sandbox A-Eye Project Landing Page
        </p>
      </header>
    </div>
  );
}

export default App;
