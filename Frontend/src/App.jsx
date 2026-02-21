import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import DashboardOverview from './components/DashboardOverview';
import ProtectedRoute from './components/ProtectedRoute';
import Expense from './components/Expense';
import Management from './components/Management';
import MainLayout from './components/MainLayout';
import VehicleRegistry from './components/VehicleRegistry';
import TripDispatcher from './components/TripDispatcher';
import DriverPerformance from './components/DriverPerformance';
import FinancialAnalytics from './components/FinancialAnalytics';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes wrapped in MainLayout */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['Manager', 'Dispatcher', 'SafetyOfficer', 'FinancialAnalyst']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Default dashboard for all roles */}
          <Route path="/dashboard" element={<DashboardOverview />} />

          {/* Role-specific routes */}
          <Route path="/vehicle-registry" element={<VehicleRegistry />} />
          <Route path="/dispatcher" element={<TripDispatcher />} />
          <Route path="/maintenance" element={<Management />} />
          <Route path="/driver-performance" element={<DriverPerformance />} />
          <Route path="/trip-expense" element={<Expense />} />
          <Route path="/financial-analytics" element={<FinancialAnalytics />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
