import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import RightSidebar from '../components/RightSidebar.jsx';
import Navbar from '../components/Navbar.jsx';
import CreatePostModal from '../components/CreatePostModal.jsx';
import CreateStoryModal from '../components/CreateStoryModal.jsx';
import StoryViewerModal from '../components/StoryViewerModal.jsx';
import EditProfileModal from '../components/EditProfileModal.jsx';

const Layout = () => {
    return (
        <div className="min-h-screen bg-[#F8F7FF] text-[#1E1B4B] flex flex-col">
            {/* Top Navigation Bar */}
            <Navbar />

            {/* 3-Column Social Body */}
            <div className="w-full flex-1 flex justify-between">
                {/* Left Shortcuts Sidebar */}
                <div className="hidden md:block shrink-0">
                    <Sidebar />
                </div>

                {/* Center Content Feed / Main Stage */}
                <main className="flex-1 min-w-0 py-6 px-3 sm:px-6 flex justify-center">
                    <div className="w-full max-w-[680px] xl:max-w-[720px]">
                        <Outlet />
                    </div>
                </main>

                {/* Right Sponsored & Contacts Sidebar */}
                <RightSidebar />
            </div>

            {/* Global Modals */}
            <CreatePostModal />
            <CreateStoryModal />
            <StoryViewerModal />
            <EditProfileModal />
        </div>
    );
};

export default Layout;
