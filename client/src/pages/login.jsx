import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { assets } from '../assets/assets.js';
import { useApp } from '../context/AppContext.jsx';
import { ArrowRight, CheckCircle, ShieldCheck, Zap, Sparkles } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { setCurrentUser } = useApp();
    const [isSignUp, setIsSignUp] = useState(false);

    const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

    // Demo Mode Sign In Handler when Clerk keys are not configured
    const handleDemoSignIn = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8F7FF] via-white to-[#EDE9FE]/40 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {/* Left Branding Showcase */}
                <div className="bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#EC4899] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <img src={assets.logo} alt="Vibly Logo" className="w-10 h-10 bg-white p-1 rounded-xl shadow-md" />
                            <span className="text-2xl font-black tracking-tight">Vibly</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-4">
                            Connect with creators & professionals worldwide.
                        </h2>
                        <p className="text-purple-100 text-sm leading-relaxed mb-6">
                            Experience next-generation social networking with real-time messaging, stories, and optimized media.
                        </p>

                        <div className="space-y-3 text-xs text-purple-100">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                                <span>Clerk-powered authentication & security</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-[#F59E0B]" />
                                <span>Inngest durable background jobs & cleanups</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[#FDE047]" />
                                <span>ImageKit lightning-fast media optimization</span>
                            </div>
                        </div>
                    </div>

                    {/* Social proof banner */}
                    <div className="pt-8 border-t border-white/20 mt-8 flex items-center gap-3">
                        <img src={assets.group_users} alt="Users" className="h-8 object-contain" />
                        <p className="text-xs text-purple-100">
                            Join over <span className="font-bold text-white">50,000+</span> developers & designers.
                        </p>
                    </div>
                </div>

                {/* Right Form Container */}
                <div className="p-8 sm:p-10 flex flex-col justify-center">
                    {clerkKey ? (
                        /* Clerk Authentication */
                        <div className="flex flex-col items-center">
                            {isSignUp ? (
                                <SignUp 
                                    routing="hash"
                                    signInUrl="#/login"
                                    afterSignUpUrl="/"
                                />
                            ) : (
                                <SignIn 
                                    routing="hash"
                                    signUpUrl="#/login"
                                    afterSignInUrl="/"
                                />
                            )}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="mt-4 text-xs font-semibold text-[#7C3AED] hover:underline"
                            >
                                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                            </button>
                        </div>
                    ) : (
                        /* Instant Demo Sign-In Card */
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-[#1E1B4B]">
                                    Welcome to Vibly
                                </h3>
                                <p className="text-xs text-[#6B7280] mt-1">
                                    Clerk authentication integration is enabled. Enter demo mode or configure your Clerk keys in <code className="bg-gray-100 px-1 py-0.5 rounded text-[#7C3AED]">.env</code>.
                                </p>
                            </div>

                            <div className="bg-[#F8F7FF] border border-[#7C3AED]/20 rounded-2xl p-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={assets.sample_profile}
                                        alt="Demo User"
                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[#7C3AED]"
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-[#1E1B4B]">John Warren</p>
                                        <p className="text-xs text-[#6B7280]">@john_warren (Full Access Demo)</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleDemoSignIn}
                                className="w-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:opacity-95 text-white font-semibold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#7C3AED]/25 transition-all active:scale-98 cursor-pointer"
                            >
                                <span>Continue as John Warren</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <p className="text-[11px] text-gray-400 text-center">
                                Tip: Add your <code className="text-gray-600">VITE_CLERK_PUBLISHABLE_KEY</code> in <code className="text-gray-600">.env</code> to enable live Clerk OAuth & multi-factor authentication.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
