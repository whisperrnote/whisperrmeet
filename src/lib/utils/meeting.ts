import { nanoid } from 'nanoid';

export function generateMeetingId(): string {
  return nanoid(10);
}

export function generateParticipantId(): string {
  return nanoid(12);
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function getMeetingUrl(meetingId: string): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/meeting/${meetingId}`;
}

export function copyToClipboard(text: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject();
  return navigator.clipboard.writeText(text);
}
