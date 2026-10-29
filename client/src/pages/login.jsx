import React, { useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { assets } from '../assets/assets.js';
import { ShieldCheck, Zap, Sparkles } from 'lucide-react';

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);

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
                            <span className="text-3xl font-black tracking-tight">Vibly</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
                            Connect with creators &amp; professionals worldwide.
                        </h2>
                        <p className="text-purple-100 text-base leading-relaxed mb-6">
                            Experience next-generation social networking with real-time messaging, stories, and optimized media.
                        </p>

                        <div className="space-y-3 text-sm text-purple-100">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                                <span>Clerk-powered authentication &amp; security</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-[#F59E0B]" />
                                <span>Inngest durable background jobs &amp; cleanups</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-[#FDE047]" />
                                <span>ImageKit lightning-fast media optimization</span>
                            </div>
                        </div>
                    </div>

                    {/* Social proof banner */}
                    <div className="pt-8 border-t border-white/20 mt-8 flex items-center gap-3">
                        <img src={assets.group_users} alt="Users" className="h-8 object-contain" />
                        <p className="text-sm text-purple-100">
                            Join over <span className="font-bold text-white">50,000+</span> developers &amp; designers.
                        </p>
                    </div>
                </div>

                {/* Right Form Container */}
                <div className="p-8 sm:p-10 flex flex-col justify-center">
                    <div className="mb-6">
                        <h3 className="text-3xl font-bold text-[#1E1B4B]">
                            {isSignUp ? 'Create your account' : 'Welcome back'}
                        </h3>
                        <p className="text-base text-[#6B7280] mt-1">
                            {isSignUp ? 'Sign up to join Vibly today.' : 'Sign in to continue to Vibly.'}
                        </p>
                    </div>

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
                            className="mt-4 text-sm font-semibold text-[#7C3AED] hover:underline"
                        >
                            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
