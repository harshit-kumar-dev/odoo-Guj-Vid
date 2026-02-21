import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Login />
      </div>
    </BrowserRouter>
  );
}

export default App;
