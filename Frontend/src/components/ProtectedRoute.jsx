import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        // Not logged in at all, kick them back to login page
        return <Navigate to="/" replace />;
    }

    try {
        // Decode the token to discover who they are
        const decodedToken = jwtDecode(token);

        // Check if token has expired
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
            localStorage.removeItem('token');
            return <Navigate to="/" replace />;
        }

        // Check if their specific role is allowed on this page
        if (allowedRoles && !allowedRoles.includes(decodedToken.role)) {
            // They are logged in, but don't have permission for this specific page
            return (
                <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
                    <h1 style={{ color: '#dc2626' }}>Access Denied</h1>
                    <p>You do not have the required permissions to view this page.</p>
                    <p>Your current role is: <strong>{decodedToken.role}</strong></p>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        style={{ marginTop: '20px', padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Return to Dashboard
                    </button>
                </div>
            );
        }

        // If they pass all checks, render the page they asked for!
        return children;

    } catch (error) {
        // If the token is invalid or malformed
        localStorage.removeItem('token');
        return <Navigate to="/" replace />;
    }
};

export default ProtectedRoute;
