export interface ShortenRequest {
  url: string;
}

export interface ShortenResponse {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
}

export interface LinkStats {
  shortCode: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
}

export interface MapValue {
  originalUrl: string;
  clicks: number;
  createdAt: Date;
}