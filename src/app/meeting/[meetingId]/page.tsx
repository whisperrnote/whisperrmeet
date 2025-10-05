'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { getMeeting, joinMeeting, leaveMeeting, getParticipants } from '@/lib/appwrite/meetings';
import { getCurrentUser, loginAnonymously } from '@/lib/appwrite/auth';
import type { Meeting, Participant } from '@/types';
import type { Models } from 'appwrite';

interface ChatMessage {
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export default function MeetingRoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const meetingId = params.meetingId as string;
  const nameParam = searchParams.get('name');

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  const cleanup = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
  }, [localStream]);

  const initializeMeeting = useCallback(async () => {
    try {
      setLoading(true);

      // Get meeting details
      const meetingData = await getMeeting(meetingId);
      if (!meetingData) {
        setError('Meeting not found');
        return;
      }
      setMeeting(meetingData);

      // Get or create user
      let user: Models.User<Models.Preferences> | { $id: string; name: string } | null = await getCurrentUser();
      if (!user) {
        const session = await loginAnonymously();
        user = { $id: session.userId, name: nameParam || 'Guest' };
      }

      // Join meeting
      const participant = await joinMeeting(
        meetingId,
        user.$id,
        nameParam || ('name' in user ? user.name : 'Guest') || 'Guest',
        !('email' in user && user.email)
      );
      setCurrentParticipant(participant);

      // Get media stream
      await setupMediaDevices();

      // Get participants
      const participantsList = await getParticipants(meetingId);
      setParticipants(participantsList);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join meeting';
      console.error('Error initializing meeting:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [meetingId, nameParam]);

  async function setupMediaDevices() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing media devices:', err);
      alert('Unable to access camera/microphone. Please check permissions.');
    }
  }

  useEffect(() => {
    initializeMeeting();
    return () => {
      cleanup();
    };
  }, [initializeMeeting, cleanup]);

  function toggleAudio() {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  }

  function toggleVideo() {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  }

  async function handleLeaveMeeting() {
    if (currentParticipant) {
      await leaveMeeting(currentParticipant.participantId);
    }
    cleanup();
    window.location.href = '/';
  }

  function handleSendMessage() {
    if (chatInput.trim() && currentParticipant) {
      const message: ChatMessage = {
        senderId: currentParticipant.participantId,
        senderName: currentParticipant.displayName,
        content: chatInput,
        timestamp: new Date().toISOString(),
      };
      setChatMessages([...chatMessages, message]);
      setChatInput('');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Joining meeting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Unable to Join Meeting</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button onClick={() => window.location.href = '/'} variant="primary">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-semibold text-lg">{meeting?.title || 'Meeting Room'}</h1>
            <p className="text-gray-400 text-sm">{participants.length} participant{participants.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 p-4">
          <div className="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Local Video */}
            <div className="relative bg-gray-800 rounded-xl overflow-hidden aspect-video">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/70 px-3 py-1 rounded-lg">
                <p className="text-white text-sm font-medium">
                  {currentParticipant?.displayName} (You)
                </p>
              </div>
              {!videoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {currentParticipant?.displayName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Remote Participants */}
            {participants.filter(p => p.participantId !== currentParticipant?.participantId).map((participant) => (
              <div key={participant.participantId} className="relative bg-gray-800 rounded-xl overflow-hidden aspect-video">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {participant.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/70 px-3 py-1 rounded-lg">
                  <p className="text-white text-sm font-medium">{participant.displayName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Sidebar */}
        {chatOpen && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-white font-semibold">Chat</h3>
              <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="bg-gray-700 rounded-lg p-3">
                  <p className="text-indigo-400 text-sm font-medium">{msg.senderName}</p>
                  <p className="text-white text-sm mt-1">{msg.content}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Button onClick={handleSendMessage} variant="primary" size="sm">
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <footer className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={toggleAudio}
            variant={audioEnabled ? 'secondary' : 'danger'}
            size="lg"
            className="w-14 h-14 rounded-full"
          >
            {audioEnabled ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </Button>

          <Button
            onClick={toggleVideo}
            variant={videoEnabled ? 'secondary' : 'danger'}
            size="lg"
            className="w-14 h-14 rounded-full"
          >
            {videoEnabled ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            )}
          </Button>

          <Button
            onClick={() => setChatOpen(!chatOpen)}
            variant="secondary"
            size="lg"
            className="w-14 h-14 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </Button>

          <Button
            onClick={handleLeaveMeeting}
            variant="danger"
            size="lg"
            className="w-14 h-14 rounded-full ml-4"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
            </svg>
          </Button>
        </div>
      </footer>
    </div>
  );
}
