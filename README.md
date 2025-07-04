# SnapTalk

SnapTalk is a modern social media platform built with the MERN (MongoDB, Express.js, React.js, Node.js) stack. It combines the features of real-time chat messaging with social media functionalities like posts, stories, and user profiles.

![SnapTalk Logo](./client/src/images/SnapTalk.png)

## Features

- **User Authentication**
  - Register and Login functionality
  - Protected routes for authenticated users
  - Firebase integration for enhanced security

- **Social Media Features**
  - Create and share posts
  - Upload and view stories
  - Like and interact with posts
  - User profiles
  - Search functionality

- **Real-time Chat**
  - One-on-one messaging
  - Real-time message updates using Socket.IO
  - User search for starting new conversations
  - Message input with text support

- **Modern UI/UX**
  - Responsive design
  - Clean and intuitive interface
  - Seamless navigation
  - Landing page for new users

## Tech Stack

### Frontend
- React.js
- Context API for state management
- Socket.IO Client for real-time communication
- Firebase for additional features
- CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- Socket.IO for real-time features
- JWT for authentication

## Project Structure

```
SnapTalk/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Context providers
│   │   ├── pages/       # Main page components
│   │   └── styles/      # CSS styling files
│   └── public/          # Static files
└── server/              # Backend Node.js application
    ├── controllers/     # Route controllers
    ├── models/          # MongoDB models
    ├── routes/          # API routes
    └── middleware/      # Custom middleware
```
## Phasewisedocumentation Link
https://drive.google.com/drive/folders/1F8ctqLBz6PnENJKZrhZ7yrj7sMeARZu-

 
## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/madhuri-perumalla/social_media_app.git
cd SnapTalk
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd ../client
npm install
```

4. Create a `.env` file in the server directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=6001
```

5. Create a `.env` file in the client directory with your Firebase configuration:
```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
```

### Running the Application

1. Start the backend server
```bash
cd server
npm start
```

2. Start the frontend application in a new terminal
```bash
cd client
npm start
```

The application should now be running on `http://localhost:3000`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- Thanks to all contributors who have helped shape SnapTalk
- Special thanks to the MERN stack smart internz community for their excellent documentation and resources 


