import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* A placeholder for the dashboard route configured in Login.jsx */}
        <Route path="/dashboard" element={<div><h2>Dashboard (Placeholder)</h2><p>You have successfully logged in!</p></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
