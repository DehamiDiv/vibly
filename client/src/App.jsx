import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

import Layout from './pages/layout.jsx';
import Feed from './pages/feed.jsx';
import Login from './pages/login.jsx';
import Messages from './pages/messages.jsx';
import Connections from './pages/connectins.jsx';
import Discover from './pages/discover.jsx';
import Profile from './pages/profile.jsx';
import CreatePost from './pages/createPost.jsx';

// Protected Route Handler
const ProtectedLayout = () => {
    const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

    let isSignedIn = true;
    let isLoaded = true;

    try {
        const auth = useAuth();
        if (clerkKey) {
            isSignedIn = auth.isSignedIn;
            isLoaded = auth.isLoaded;
        }
    } catch {
        // Clerk unconfigured fallback
        isSignedIn = true;
        isLoaded = true;
    }

    if (clerkKey && !isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (clerkKey && !isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    return <Layout />;
};

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            {/* Protected Application Routes */}
            <Route element={<ProtectedLayout />}>
                <Route path="/" element={<Feed />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/messages/:userId" element={<Messages />} />
                <Route path="/connections" element={<Connections />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/create-post" element={<CreatePost />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;
