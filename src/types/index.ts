export interface User {
  $id: string;
  userId: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
  avatarFileId?: string;
  preferences?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Meeting {
  $id: string;
  meetingId: string;
  hostId: string;
  title?: string;
  description?: string;
  type: 'instant' | 'scheduled' | 'recurring';
  status: 'scheduled' | 'active' | 'ended' | 'cancelled';
  startTime?: string;
  endTime?: string;
  scheduledDuration?: number;
  isRecording: boolean;
  recordingFileId?: string;
  encryptionKey?: string;
  maxParticipants: number;
  participantCount: number;
  settings?: MeetingSettings;
  createdAt?: string;
  updatedAt?: string;
}

export interface MeetingSettings {
  waitingRoomEnabled: boolean;
  allowAnonymous: boolean;
  chatEnabled: boolean;
  screenShareEnabled: boolean;
  recordingEnabled: boolean;
  requireAudio: boolean;
  requireVideo: boolean;
}

export interface Participant {
  $id: string;
  participantId: string;
  meetingId: string;
  userId?: string;
  displayName: string;
  isAnonymous: boolean;
  role: 'host' | 'co-host' | 'participant';
  status: 'waiting' | 'joined' | 'left';
  joinedAt?: string;
  leftAt?: string;
  connectionId?: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenSharing: boolean;
}

export interface ChatMessage {
  $id: string;
  messageId: string;
  meetingId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'file' | 'system';
  fileId?: string;
  timestamp: string;
  isEncrypted: boolean;
}

export interface Recording {
  $id: string;
  recordingId: string;
  meetingId: string;
  fileId: string;
  fileName: string;
  fileSize?: number;
  duration?: number;
  thumbnailFileId?: string;
  status: 'processing' | 'ready' | 'failed';
  createdAt?: string;
  expiresAt?: string;
}

export interface Poll {
  $id: string;
  pollId: string;
  meetingId: string;
  creatorId: string;
  question: string;
  options: string[];
  votes: Record<string, string[]>;
  totalVotes: number;
  isActive: boolean;
  createdAt?: string;
}

export interface Reaction {
  $id: string;
  reactionId: string;
  meetingId: string;
  userId: string;
  userName?: string;
  emoji: string;
  timestamp: string;
}

export interface MediaStream {
  stream: MediaStream;
  userId: string;
  displayName: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenSharing: boolean;
}
