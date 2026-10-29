# 🟣 Vibly — Next-Gen Social Networking Platform

<p align="center">
  <img src="client/public/favicon.svg" alt="Vibly Logo" width="80" height="80" />
</p>

<p align="center">
  <b>A modern, feature-rich full-stack social media application inspired by Instagram & Threads aesthetics.</b>
</p>

---

## ✨ Features

- **🔐 Authentication & Security**: Seamless sign-in, sign-up, and profile management powered by **Clerk** (with demo mode support).
- **⚡ Background Jobs & Workflows**: Robust background task processing and scheduled jobs handled with **Inngest**.
- **🖼️ Media Storage & Optimization**: Lightning-fast image processing, transformations, and global CDN delivery with **ImageKit**.
- **💬 Real-Time Messaging**: Real-Time chat and instant direct messaging powered by Server-Sent Events (SSE).
- **📰 Feed & Dynamic Posts**: Share text posts, multi-image posts, hashtags, reactions (👍, ❤️), and comments.
- **📸 24-Hour Stories**: Instagram-style vibrant stories bar with text/media statuses and auto-advancing viewer.
- **👥 Connections & Follows**: Send and accept friend requests, follow/unfollow creators, and manage your network.
- **🔍 Discovery & Search**: Live instant user and content search with category tags (Developers, Designers, Founders).
- **🎨 Trendy UI / UX**: Vibrant Violet (`#7C3AED`), Pink (`#EC4899`), and Amber (`#F59E0B`) palette with responsive full-width layout.

---

## 🛠️ Tech Stack

### Frontend (`client/`)
- **React 19** + **Vite**
- **Tailwind CSS v4**
- **@clerk/clerk-react**
- **Lucide React** (Modern iconography)
- **Axios**

### Backend (`server/`)
- **Node.js** + **Express** (ES Modules)
- **MongoDB** + **Mongoose**
- **@clerk/express** & Svix webhook verification
- **Inngest** SDK
- **ImageKit** SDK + Multer memory storage
- **Nodemailer** (Email notifications)
- **Server-Sent Events (SSE)** for real-time chat

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/DehamiDiv/vibly.git
cd vibly
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Backend Setup
```bash
cd ../server
npm install
cp .env.example .env
npm run dev
```
The server will run on [http://localhost:5000](http://localhost:5000).

---

## ⚙️ Environment Variables

### `client/.env`
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000/api
```

### `server/.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vibly
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

---

## 📄 License
MIT © 2026 Vibly
