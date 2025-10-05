import { databases, DATABASE_ID, COLLECTIONS } from './config';
import { ID, Query } from 'appwrite';
import type { Meeting, Participant, ChatMessage } from '@/types';
import { generateMeetingId, generateParticipantId } from '@/lib/utils/meeting';

export async function createMeeting(
  hostId: string,
  title: string,
  settings?: Partial<Meeting['settings']>
): Promise<Meeting> {
  try {
    const meetingId = generateMeetingId();
    const meeting = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.MEETINGS,
      ID.unique(),
      {
        meetingId,
        hostId,
        title,
        type: 'instant',
        status: 'scheduled',
        maxParticipants: 100,
        participantCount: 0,
        isRecording: false,
        settings: JSON.stringify({
          waitingRoomEnabled: false,
          allowAnonymous: true,
          chatEnabled: true,
          screenShareEnabled: true,
          recordingEnabled: true,
          ...settings,
        }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );

    return meeting as unknown as Meeting;
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw error;
  }
}

export async function getMeeting(meetingId: string): Promise<Meeting | null> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.MEETINGS,
      [Query.equal('meetingId', meetingId)]
    );

    if (response.documents.length > 0) {
      const meeting = response.documents[0] as unknown as Meeting;
      if (typeof meeting.settings === 'string') {
        meeting.settings = JSON.parse(meeting.settings);
      }
      return meeting;
    }
    return null;
  } catch (error) {
    console.error('Error fetching meeting:', error);
    return null;
  }
}

export async function updateMeetingStatus(
  meetingId: string,
  status: Meeting['status']
): Promise<void> {
  try {
    const meeting = await getMeeting(meetingId);
    if (!meeting) throw new Error('Meeting not found');

    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.MEETINGS,
      meeting.$id,
      {
        status,
        updatedAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error('Error updating meeting status:', error);
    throw error;
  }
}

export async function joinMeeting(
  meetingId: string,
  userId: string,
  displayName: string,
  isAnonymous: boolean = false
): Promise<Participant> {
  try {
    const participantId = generateParticipantId();
    const participant = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.PARTICIPANTS,
      ID.unique(),
      {
        participantId,
        meetingId,
        userId,
        displayName,
        isAnonymous,
        role: 'participant',
        status: 'joined',
        audioEnabled: true,
        videoEnabled: true,
        screenSharing: false,
        joinedAt: new Date().toISOString(),
      }
    );

    // Update participant count
    const meeting = await getMeeting(meetingId);
    if (meeting) {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.MEETINGS,
        meeting.$id,
        {
          participantCount: meeting.participantCount + 1,
          updatedAt: new Date().toISOString(),
        }
      );
    }

    return participant as unknown as Participant;
  } catch (error) {
    console.error('Error joining meeting:', error);
    throw error;
  }
}

export async function leaveMeeting(participantId: string): Promise<void> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.PARTICIPANTS,
      [Query.equal('participantId', participantId)]
    );

    if (response.documents.length > 0) {
      const participant = response.documents[0] as unknown as Participant;
      
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.PARTICIPANTS,
        participant.$id,
        {
          status: 'left',
          leftAt: new Date().toISOString(),
        }
      );

      // Update participant count
      const meeting = await getMeeting(participant.meetingId);
      if (meeting) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.MEETINGS,
          meeting.$id,
          {
            participantCount: Math.max(0, meeting.participantCount - 1),
            updatedAt: new Date().toISOString(),
          }
        );
      }
    }
  } catch (error) {
    console.error('Error leaving meeting:', error);
    throw error;
  }
}

export async function getParticipants(meetingId: string): Promise<Participant[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.PARTICIPANTS,
      [
        Query.equal('meetingId', meetingId),
        Query.equal('status', 'joined'),
      ]
    );

    return response.documents as unknown as Participant[];
  } catch (error) {
    console.error('Error fetching participants:', error);
    return [];
  }
}

export async function sendChatMessage(
  meetingId: string,
  senderId: string,
  senderName: string,
  content: string
): Promise<ChatMessage> {
  try {
    const message = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.CHAT_MESSAGES,
      ID.unique(),
      {
        messageId: ID.unique(),
        meetingId,
        senderId,
        senderName,
        content,
        type: 'text',
        isEncrypted: true,
        timestamp: new Date().toISOString(),
      }
    );

    return message as unknown as ChatMessage;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

export async function getChatMessages(meetingId: string): Promise<ChatMessage[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CHAT_MESSAGES,
      [
        Query.equal('meetingId', meetingId),
        Query.orderDesc('timestamp'),
        Query.limit(100),
      ]
    );

    return response.documents.reverse() as unknown as ChatMessage[];
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }
}
