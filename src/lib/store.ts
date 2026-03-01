import { MapValue, LinkStats } from './types';

// In-memory storage for shortened URLs
const urlStore = new Map<string, MapValue>();

export function setUrl(code: string, originalUrl: string): void {
  urlStore.set(code, {
    originalUrl,
    clicks: 0,
    createdAt: new Date(),
  });
}

export function getUrl(code: string): MapValue | undefined {
  return urlStore.get(code);
}

export function incrementClicks(code: string): boolean {
  const entry = urlStore.get(code);
  if (entry) {
    entry.clicks += 1;
    return true;
  }
  return false;
}

export function getAllStats(): LinkStats[] {
  const stats: LinkStats[] = [];
  
  for (const [shortCode, value] of urlStore.entries()) {
    stats.push({
      shortCode,
      originalUrl: value.originalUrl,
      clicks: value.clicks,
      createdAt: value.createdAt.toISOString(),
    });
  }
  
  // Sort by creation date (newest first)
  return stats.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function hasCode(code: string): boolean {
  return urlStore.has(code);
}