import { NextRequest, NextResponse } from 'next/server';
import { getUrl, incrementClicks } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ [key: string]: string }> }
): Promise<NextResponse> {
  try {
    const { code } = await params;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Invalid short code' },
        { status: 400 }
      );
    }

    // Look up the URL
    const urlData = getUrl(code);
    
    if (!urlData) {
      return NextResponse.json(
        { error: 'Short code not found' },
        { status: 404 }
      );
    }

    // Increment click count
    incrementClicks(code);

    // Redirect to the original URL
    return NextResponse.redirect(urlData.originalUrl, 302);
  } catch (error) {
    console.error('Error in /api/[code]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}