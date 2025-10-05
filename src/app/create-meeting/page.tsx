'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { createMeeting } from '@/lib/appwrite/meetings';
import { getCurrentUser, loginAnonymously } from '@/lib/appwrite/auth';
import { getMeetingUrl, copyToClipboard } from '@/lib/utils/meeting';

export default function CreateMeetingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [createdMeetingId, setCreatedMeetingId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setDisplayName(currentUser.name || '');
    }
  }

  async function handleCreateMeeting() {
    if (!displayName.trim()) {
      alert('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      let userId = user?.$id;
      
      // Create anonymous session if not logged in
      if (!userId) {
        const session = await loginAnonymously();
        userId = session.userId;
      }

      const meeting = await createMeeting(
        userId,
        meetingTitle || 'Quick Meeting',
        {
          waitingRoomEnabled: false,
          allowAnonymous: true,
          chatEnabled: true,
          screenShareEnabled: true,
          recordingEnabled: true,
        }
      );

      setCreatedMeetingId(meeting.meetingId);
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Failed to create meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleJoinMeeting() {
    if (createdMeetingId) {
      router.push(`/meeting/${createdMeetingId}?name=${encodeURIComponent(displayName)}`);
    }
  }

  function handleCopyLink() {
    if (createdMeetingId) {
      const url = getMeetingUrl(createdMeetingId);
      copyToClipboard(url).then(() => {
        alert('Meeting link copied to clipboard!');
      });
    }
  }

  if (createdMeetingId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
              Meeting Created! 🎉
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Meeting Code:</p>
              <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white text-center">
                {createdMeetingId}
              </p>
            </div>
            
            <div className="space-y-2">
              <Button onClick={handleJoinMeeting} variant="primary" className="w-full">
                Join Meeting Now
              </Button>
              <Button onClick={handleCopyLink} variant="secondary" className="w-full">
                Copy Meeting Link
              </Button>
              <Button onClick={() => router.push('/')} variant="ghost" className="w-full">
                Back to Home
              </Button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Share the meeting code with participants to let them join
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Create New Meeting
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center text-sm mt-2">
            Start an instant video meeting with end-to-end encryption
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Your Name"
            placeholder="Enter your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          
          <Input
            label="Meeting Title (Optional)"
            placeholder="e.g., Team Standup"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
          />

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Anonymous Mode</p>
                <p className="text-blue-700 dark:text-blue-300">
                  Creating a meeting without signing in will limit the session to 30 minutes.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleCreateMeeting}
            variant="primary"
            className="w-full"
            disabled={loading || !displayName.trim()}
          >
            {loading ? 'Creating Meeting...' : 'Create Meeting'}
          </Button>

          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            className="w-full"
            disabled={loading}
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
