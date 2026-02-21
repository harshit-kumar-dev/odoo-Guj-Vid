import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Expense from './components/Expense';
import Management from './components/Management';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/management" element={<Management />} />
          {/* A placeholder for the dashboard route configured in Login.jsx */}
          <Route path="/dashboard" element={<div><h2>Dashboard (Placeholder)</h2><p>You have successfully logged in!</p></div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
