import { Client, Account, Databases, Storage, Functions } from 'appwrite';

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'whisperrmeet');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export { client };

// Database and Collection IDs
export const DATABASE_ID = 'meetingsDB';

export const COLLECTIONS = {
  USERS: 'users',
  MEETINGS: 'meetings',
  PARTICIPANTS: 'participants',
  CHAT_MESSAGES: 'chatMessages',
  RECORDINGS: 'recordings',
  POLLS: 'polls',
  REACTIONS: 'reactions',
};

// Storage Bucket IDs
export const BUCKETS = {
  AVATARS: 'avatars',
  RECORDINGS: 'recordings',
  BACKGROUNDS: 'backgrounds',
  ATTACHMENTS: 'attachments',
};
