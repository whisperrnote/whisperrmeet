# WhisperMeet - Blueprint & Project Documentation

## Overview

**WhisperMeet** is a next-generation video conferencing and live streaming application built to compete with Google Meet. It leverages Next.js 15 for the frontend framework and Appwrite for backend services, providing a seamless, secure, and feature-rich communication platform.

### Core Mission
To provide a robust, easy-to-use video conferencing platform with end-to-end encryption by default, supporting live meetings, streaming capabilities, and anonymous mode for quick connections.

### Key Features
- **Live Video Meetings**: High-quality video and audio conferencing
- **Live Streaming**: Broadcast to multiple viewers with real-time interaction
- **End-to-End Encryption**: Security by default, no user configuration needed
- **Anonymous Mode**: Quick 30-minute video calls/streams without registration
- **Screen Sharing**: Share screens during meetings
- **Chat Integration**: Real-time text chat during meetings
- **Recording**: Record meetings (with permission)
- **Virtual Backgrounds**: Blur or custom backgrounds
- **Waiting Room**: Host-controlled participant admission
- **Breakout Rooms**: Split participants into smaller groups
- **Reactions**: Quick emoji reactions during calls
- **Polls & Q&A**: Interactive engagement features
- **Calendar Integration**: Schedule and join meetings
- **Mobile Responsive**: Works perfectly on all devices

## Technology Stack

### Frontend
- **Next.js 15.5.4**: React framework with App Router
- **React 19.1.0**: UI library
- **TypeScript 5.x**: Type safety
- **Tailwind CSS 4.x**: Styling framework
- **WebRTC**: Peer-to-peer video/audio communication
- **Socket.io Client**: Real-time bidirectional communication

### Backend
- **Appwrite**: Backend-as-a-Service
  - Authentication (email, anonymous, OAuth)
  - Database (meetings, participants, recordings)
  - Storage (recordings, avatars, virtual backgrounds)
  - Real-time subscriptions
  - Functions (serverless endpoints)

### Media & Communication
- **Simple-peer / PeerJS**: WebRTC abstraction
- **MediaSoup / Mediasoup-client**: SFU for scalable video conferencing
- **Socket.io**: Signaling server
- **End-to-end encryption**: Client-side encryption using Web Crypto API

## Architecture

### Application Structure
```
/app
  /(auth)
    /login
    /register
  /(main)
    /dashboard
    /create-meeting
    /join
    /[meetingId]
    /schedule
    /recordings
    /settings
  /api
    /socket
    /webrtc
/components
  /ui (reusable components)
  /meeting (meeting-specific components)
  /layout (layout components)
/lib
  /appwrite (Appwrite client setup)
  /webrtc (WebRTC utilities)
  /encryption (E2E encryption)
  /utils (helper functions)
/hooks (custom React hooks)
/types (TypeScript definitions)
```

## Database Schema (Appwrite)

### Database: meetingsDB

#### Collection: users
- userId (string, unique, required)
- displayName (string)
- email (string, email format)
- avatarUrl (string, url)
- avatarFileId (string)
- preferences (JSON string)
- createdAt (datetime)
- updatedAt (datetime)

#### Collection: meetings
- meetingId (string, unique, required)
- hostId (string, required)
- title (string)
- description (string)
- type (enum: instant, scheduled, recurring)
- status (enum: scheduled, active, ended, cancelled)
- startTime (datetime)
- endTime (datetime)
- scheduledDuration (integer, minutes)
- isRecording (boolean)
- recordingFileId (string)
- encryptionKey (string, encrypted)
- maxParticipants (integer, default: 100)
- participantCount (integer)
- settings (JSON string)
  - waitingRoomEnabled
  - allowAnonymous
  - chatEnabled
  - screenShareEnabled
  - recordingEnabled
- createdAt (datetime)
- updatedAt (datetime)

#### Collection: participants
- participantId (string, unique, required)
- meetingId (string, required, indexed)
- userId (string, indexed)
- displayName (string, required)
- isAnonymous (boolean)
- role (enum: host, co-host, participant)
- status (enum: waiting, joined, left)
- joinedAt (datetime)
- leftAt (datetime)
- connectionId (string)
- audioEnabled (boolean)
- videoEnabled (boolean)
- screenSharing (boolean)

#### Collection: chatMessages
- messageId (string, unique, required)
- meetingId (string, required, indexed)
- senderId (string, required)
- senderName (string)
- content (string, required)
- type (enum: text, file, system)
- fileId (string)
- timestamp (datetime)
- isEncrypted (boolean)

#### Collection: recordings
- recordingId (string, unique, required)
- meetingId (string, required, indexed)
- fileId (string, required)
- fileName (string)
- fileSize (integer)
- duration (integer, seconds)
- thumbnailFileId (string)
- status (enum: processing, ready, failed)
- createdAt (datetime)
- expiresAt (datetime)

#### Collection: polls
- pollId (string, unique, required)
- meetingId (string, required, indexed)
- creatorId (string, required)
- question (string, required)
- options (JSON string array)
- votes (JSON string)
- totalVotes (integer)
- isActive (boolean)
- createdAt (datetime)

#### Collection: reactions
- reactionId (string, unique, required)
- meetingId (string, required, indexed)
- userId (string, required)
- userName (string)
- emoji (string, required)
- timestamp (datetime)

## Storage Buckets (Appwrite)

### Bucket: avatars
- Purpose: User profile pictures
- Max Size: 5MB
- Allowed Extensions: jpg, jpeg, png, gif, webp
- Encryption: Enabled
- Permissions: Users can CRUD their own

### Bucket: recordings
- Purpose: Meeting recordings
- Max Size: 2GB
- Allowed Extensions: webm, mp4, mkv
- Encryption: Enabled
- Permissions: Host and participants with permission

### Bucket: backgrounds
- Purpose: Virtual background images
- Max Size: 10MB
- Allowed Extensions: jpg, jpeg, png, webp
- Encryption: Enabled
- Permissions: Public read, users can create

### Bucket: attachments
- Purpose: Chat file attachments
- Max Size: 50MB
- Allowed Extensions: All common file types
- Encryption: Enabled
- Permissions: Meeting participants only

## Current Implementation Status

### Phase 1: Foundation (Current)
- [x] Project setup with Next.js 15 and TypeScript
- [x] Tailwind CSS 4 configuration
- [x] Appwrite configuration file structure
- [ ] Appwrite client initialization
- [ ] Authentication system
- [ ] Basic UI components

### Phase 2: Core Meeting Features
- [ ] WebRTC implementation
- [ ] Video/audio streaming
- [ ] Screen sharing
- [ ] Real-time chat
- [ ] Participant management

### Phase 3: Advanced Features
- [ ] End-to-end encryption
- [ ] Recording functionality
- [ ] Virtual backgrounds
- [ ] Waiting room
- [ ] Breakout rooms

### Phase 4: Polish & Enhancement
- [ ] Anonymous mode (30-min limit)
- [ ] Polls and reactions
- [ ] Calendar integration
- [ ] Mobile optimization
- [ ] Performance optimization

## Design System

### Color Palette
- Primary: Blue (#4F46E5) - Trust, communication
- Secondary: Purple (#7C3AED) - Innovation
- Success: Green (#10B981) - Active, connected
- Warning: Orange (#F59E0B) - Notifications
- Error: Red (#EF4444) - Issues, muted
- Neutral: Gray scale for backgrounds and text

### Typography
- Headings: Geist Sans (system default)
- Body: Geist Sans
- Code/Monospace: Geist Mono

### Component Patterns
- Cards with soft shadows and rounded corners
- Buttons with hover states and smooth transitions
- Icons from Lucide React or Heroicons
- Toast notifications for feedback
- Modal dialogs for confirmations
- Loading skeletons for better UX

## Security Considerations

### End-to-End Encryption
1. Generate unique encryption keys per meeting
2. Exchange keys via secure signaling
3. Encrypt media streams client-side
4. Store keys securely (never on server)

### Authentication
- Email/password with secure hashing
- Anonymous sessions with 30-minute limit
- OAuth integration (Google, GitHub)
- JWT token management

### Privacy
- No persistent storage of media without consent
- GDPR compliance
- Data retention policies
- Secure file deletion

## Performance Optimization

### Video Quality
- Adaptive bitrate based on network
- Automatic quality adjustment
- Bandwidth monitoring
- Simulcast for multiple qualities

### Scalability
- SFU architecture for larger meetings
- CDN for static assets
- Edge functions for low latency
- Database indexing for fast queries

## Next Steps
1. Install required npm packages
2. Configure Appwrite database and storage
3. Implement authentication flow
4. Build meeting room UI
5. Integrate WebRTC functionality
6. Add real-time features
7. Implement encryption
8. Test and optimize
