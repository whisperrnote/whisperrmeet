import { account, databases, DATABASE_ID, COLLECTIONS } from './config';
import { ID, Models } from 'appwrite';
import type { User } from '@/types';

export async function createAccount(email: string, password: string, name: string) {
  try {
    const accountResponse = await account.create(ID.unique(), email, password, name);
    
    // Create user profile in database
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      ID.unique(),
      {
        userId: accountResponse.$id,
        displayName: name,
        email: email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );

    return accountResponse;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
}

export async function loginWithEmail(email: string, password: string) {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

export async function loginAnonymously() {
  try {
    const session = await account.createAnonymousSession();
    
    // Create anonymous user profile
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      ID.unique(),
      {
        userId: session.userId,
        displayName: `Guest-${session.userId.slice(0, 6)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );

    return session;
  } catch (error) {
    console.error('Error creating anonymous session:', error);
    throw error;
  }
}

export async function logout() {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<Models.User<Models.Preferences> | null> {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      []
    );
    
    if (response.documents.length > 0) {
      const userDoc = response.documents.find((doc) => (doc as unknown as User).userId === userId);
      return userDoc ? (userDoc as unknown as User) : null;
    }
    return null;
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return null;
  }
}
