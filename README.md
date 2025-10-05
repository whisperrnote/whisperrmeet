# WhisperMeet 🎥

**Secure Video Conferencing Made Simple**

WhisperMeet is a modern, open-source video conferencing and live streaming platform built with Next.js 15 and Appwrite. It provides end-to-end encrypted video meetings with an intuitive user interface, making it a solid competitor to Google Meet.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8)
![Appwrite](https://img.shields.io/badge/Appwrite-Backend-f02e65)

## ✨ Features

### Current Features (MVP)
- ✅ **Instant Meetings**: Create and join meetings instantly
- ✅ **Anonymous Mode**: 30-minute quick calls without sign-up
- ✅ **End-to-End Encryption**: Security by default
- ✅ **Video & Audio Controls**: Toggle camera and microphone
- ✅ **Real-time Chat**: Text messaging during meetings
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Meeting Codes**: Easy-to-share meeting identifiers
- ✅ **Participant Management**: See who's in the meeting
- ✅ **Modern UI**: Beautiful gradient design with smooth animations

### Coming Soon
- 🔄 **Screen Sharing**: Share your screen with participants
- 🔄 **Recording**: Save meetings for later viewing
- 🔄 **Virtual Backgrounds**: Blur or custom backgrounds
- 🔄 **Waiting Room**: Host-controlled admission
- 🔄 **Breakout Rooms**: Split into smaller groups
- 🔄 **Polls & Reactions**: Interactive engagement
- 🔄 **Calendar Integration**: Schedule meetings
- 🔄 **Scheduled Meetings**: Plan ahead
- 🔄 **User Accounts**: Full authentication system

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Appwrite Cloud account (or self-hosted Appwrite instance)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd whisperrmeet
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MAX_ANONYMOUS_DURATION=1800000
```

4. **Configure Appwrite**

The project includes `appwrite.config.json` with all database and storage configurations. To sync with your Appwrite project:

```bash
# Install Appwrite CLI
npm install -g appwrite-cli

# Login to Appwrite
appwrite login

# Deploy configurations
appwrite deploy database
appwrite deploy storage
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
whisperrmeet/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── create-meeting/    # Create meeting page
│   │   ├── meeting/[id]/      # Meeting room
│   │   ├── login/             # Authentication pages
│   │   └── register/
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── meeting/          # Meeting-specific components
│   │   └── layout/           # Layout components
│   ├── lib/                  # Utility libraries
│   │   ├── appwrite/        # Appwrite client & services
│   │   ├── webrtc/          # WebRTC utilities
│   │   └── utils/           # Helper functions
│   ├── hooks/               # Custom React hooks
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
├── appwrite.config.json    # Appwrite database/storage config
└── blueprint.md            # Project documentation
```

## 🎨 Design Philosophy

WhisperMeet follows modern design principles:

- **Minimalist Interface**: Clean, distraction-free UI
- **Gradient Accents**: Beautiful indigo-to-purple gradients
- **Dark Mode Ready**: Optimized for dark environments
- **Smooth Animations**: Polished transitions and interactions
- **Accessible**: WCAG 2.1 compliant design
- **Mobile-First**: Responsive across all devices

## 🔒 Security

- **End-to-End Encryption**: All media streams are encrypted client-side
- **Secure Authentication**: Appwrite-powered auth with multiple methods
- **Anonymous Sessions**: Time-limited with automatic cleanup
- **Data Privacy**: No persistent storage without consent
- **HTTPS Only**: Secure communication protocols

## 🛠 Technology Stack

### Frontend
- **Next.js 15.5.4**: React framework with App Router
- **React 19.1.0**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling
- **Lucide React**: Beautiful icon set

### Backend (Appwrite)
- **Authentication**: Email, anonymous, OAuth
- **Database**: NoSQL document database
- **Storage**: File uploads and management
- **Real-time**: Live subscriptions for updates
- **Functions**: Serverless backend logic

### Media
- **WebRTC**: Peer-to-peer video/audio
- **Simple-peer**: WebRTC abstraction
- **Socket.io**: Real-time signaling (planned)

## 📊 Database Schema

### Collections

#### Users
- Profile information
- Preferences
- Avatar

#### Meetings
- Meeting metadata
- Settings (waiting room, recording, etc.)
- Participant count
- Encryption keys

#### Participants
- Active participants
- Audio/video status
- Role (host, co-host, participant)

#### Chat Messages
- Real-time messaging
- File attachments
- Encrypted content

#### Recordings
- Saved meeting recordings
- Thumbnails
- Expiration dates

#### Polls & Reactions
- Interactive features
- Real-time voting

### Storage Buckets

- **Avatars**: User profile pictures (5MB max)
- **Recordings**: Meeting recordings (2GB max)
- **Backgrounds**: Virtual backgrounds (10MB max)
- **Attachments**: Chat files (50MB max)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Appwrite](https://appwrite.io/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For support, email support@whisperrmeet.com or join our Discord community.

## 🗺 Roadmap

See `blueprint.md` for detailed development roadmap and feature planning.

---

**Made with ❤️ by the WhisperMeet Team**
