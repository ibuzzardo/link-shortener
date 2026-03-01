import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateCode, isValidUrl, buildShortUrl } from '@/lib/utils';
import { setUrl, hasCode } from '@/lib/store';
import { ShortenResponse } from '@/lib/types';

const ShortenRequestSchema = z.object({
  url: z.string().min(1, 'URL is required'),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = ShortenRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { url } = validation.data;

    // Validate URL format
    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL format. URL must start with http:// or https://' },
        { status: 400 }
      );
    }

    // Generate unique short code
    let shortCode: string;
    let attempts = 0;
    const maxAttempts = 10;
    
    do {
      shortCode = generateCode(6);
      attempts++;
      
      if (attempts > maxAttempts) {
        return NextResponse.json(
          { error: 'Failed to generate unique short code. Please try again.' },
          { status: 500 }
        );
      }
    } while (hasCode(shortCode));

    // Store the URL mapping
    setUrl(shortCode, url);

    // Build the short URL
    const shortUrl = buildShortUrl(shortCode, request);

    const response: ShortenResponse = {
      shortCode,
      shortUrl,
      originalUrl: url,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error in /api/shorten:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}