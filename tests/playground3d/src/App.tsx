import React from 'react';
import logo from './logo.svg';
import './App.css';
import RenderSurface from './components/RenderSurface';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2 className='App-link'>Playground3D</h2>
      </header>
      <div id="main">      
         <RenderSurface ></RenderSurface> 
      </div>
    </div>
  );
}

export default App;
