import logo from './logo.svg'
import sample_cover from './sample_cover.jpg'
import sample_profile from './sample_profile.jpg'
import bgImage from './bgImage.png'
import group_users from './group_users.png'
import { Home, MessageCircle, Search, UserIcon, Users } from 'lucide-react'
import sponsored_img from './sponsored_img.png'

export const assets = {
    logo,
    sample_cover,
    sample_profile,
    bgImage,
    group_users,
    sponsored_img
}

export const menuItemsData = [
    { to: '/', label: 'Feed', Icon: Home },
    { to: '/messages', label: 'Messages', Icon: MessageCircle },
    { to: '/connections', label: 'Connections', Icon: Users },
    { to: '/discover', label: 'Discover', Icon: Search },
    { to: '/profile', label: 'Profile', Icon: UserIcon },
];

// Minimal auth placeholder — replaced immediately after Clerk/DB loads
export const dummyUserData = {
    _id: null,
    email: '',
    full_name: '',
    username: '',
    bio: '',
    profile_picture: sample_profile,
    cover_photo: sample_cover,
    location: '',
    followers: [],
    following: [],
    connections: [],
    posts: [],
    is_verified: false,
    createdAt: null,
    updatedAt: null,
};
