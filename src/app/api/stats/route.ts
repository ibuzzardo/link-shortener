import { NextResponse } from 'next/server';
import { getAllStats } from '@/lib/store';
import { LinkStats } from '@/lib/types';

export async function GET(): Promise<NextResponse> {
  try {
    const stats: LinkStats[] = getAllStats();
    
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('Error in /api/stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}