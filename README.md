# ChitChat - Real-time Chat Application

A modern real-time chat application built with React, Node.js, Socket.IO, and Express.

## Features

- 🔒 User authentication and authorization
- 💬 Real-time messaging
- 🌐 Online/Offline user status
- 👤 User profiles with avatars
- 📱 Responsive design
- 🖼️ Image sharing in messages
- 🔍 Filter contacts by online status

## Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS
- DaisyUI
- Zustand (State Management)
- Socket.IO Client

### Backend
- Node.js
- Express
- Socket.IO
- MongoDB
- Cookie Parser
- CORS

## Key Components

### Frontend Components
- `ChatContainer`: Handles the main chat interface and message display
- `ChatHeader`: Shows selected user info and online status
- `Sidebar`: Displays user contacts with online/offline indicators
- `MessageInput`: Handles message composition and sending

### Backend Features
- Real-time message synchronization
- User authentication routes
- Message storage and retrieval
- Online user tracking

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd Client
   npm install

   # Install backend dependencies
   cd Server
   npm install
   ```
3. Set up environment variables:
   - Create `.env` file in Server directory
   - Add required environment variables (PORT, MONGODB_URI, etc.)

4. Start the development servers:
   ```bash
   # Start frontend (from Client directory)
   npm run dev

   # Start backend (from Server directory)
   npm start
   ```

## Features in Detail

### Real-time Communication
- Instant message delivery using Socket.IO
- Live user status updates
- Message read receipts

### User Interface
- Clean and modern design using Tailwind CSS and DaisyUI
- Responsive layout that works on both desktop and mobile
- Intuitive chat interface with message history

### User Experience
- Smooth animations and transitions
- Message timestamps
- User avatars and profile pictures
- Online/Offline status indicators