import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';

import './index.css';
import App from './App.jsx';
import { AppProvider } from './context/AppContext.jsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const RootApp = () => {
    // If Clerk key is configured, wrap with ClerkProvider; otherwise render AppProvider directly with demo fallback
    if (PUBLISHABLE_KEY) {
        return (
            <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/login">
                <AppProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </AppProvider>
            </ClerkProvider>
        );
    }

    return (
        <AppProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AppProvider>
    );
};

createRoot(document.getElementById('root')).render(<RootApp />);
