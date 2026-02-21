import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// A dummy Analytics component just to show RBAC in action
const AnalyticsDemo = () => (
  <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
    <h1 style={{ color: '#059669' }}>Financial Analytics Dashboard</h1>
    <p>This page contains sensitive company financial data.</p>
    <p>Only <strong>Managers</strong> and <strong>Financial Analysts</strong> can see this!</p>
    <button onClick={() => window.location.href = '/dashboard'}>Go Back</button>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />

          {/* Protected Route: ANY logged-in user can view the basic Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['Manager', 'Dispatcher', 'SafetyOfficer', 'FinancialAnalyst']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Highly Restricted Route: ONLY Finance and Managers */}
          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={['Manager', 'FinancialAnalyst']}>
                <AnalyticsDemo />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
