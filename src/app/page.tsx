'use client';

import { useState, useEffect } from 'react';
import { LinkStats } from '@/lib/types';
import { truncateText } from '@/lib/utils';

interface FormData {
  url: string;
}

interface ShortenResponse {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
}

export default function Dashboard(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({ url: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [stats, setStats] = useState<LinkStats[]>([]);
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(true);

  // Fetch stats from API
  const fetchStats = async (): Promise<void> => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsStatsLoading(false);
    }
  };

  // Auto-refresh stats every 10 seconds
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: formData.url }),
      });

      const data = await response.json();

      if (response.ok) {
        const result = data as ShortenResponse;
        setSuccess(`Short URL created: ${result.shortUrl}`);
        setFormData({ url: '' });
        // Refresh stats to show new entry
        fetchStats();
      } else {
        setError(data.error || 'Failed to shorten URL');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background text-textPrimary">
      <header className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-textPrimary">URL Shortener</h1>
        <p className="text-textSecondary mt-1">Create short links and track their performance</p>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        {/* URL Shortening Form */}
        <div className="bg-cardBackground text-textPrimary p-6 rounded-lg shadow-md border border-border mb-8">
          <h2 className="text-xl font-semibold mb-4">Shorten a URL</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-textSecondary mb-2">
                Enter URL to shorten
              </label>
              <input
                type="url"
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ url: e.target.value })}
                placeholder="https://example.com/very-long-url"
                className="w-full px-4 py-2 bg-background text-textPrimary border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                required
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !formData.url.trim()}
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-md">
              <p className="text-success text-sm">{success}</p>
            </div>
          )}
        </div>

        {/* Stats Table */}
        <div className="bg-cardBackground text-textPrimary p-6 rounded-lg shadow-md border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Analytics</h2>
            <div className="text-sm text-textSecondary">
              {isStatsLoading ? 'Loading...' : `${stats.length} links`}
            </div>
          </div>

          {stats.length === 0 ? (
            <div className="text-center py-8 text-textSecondary">
              <p>No shortened URLs yet. Create your first one above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-textPrimary border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-sm font-medium text-textSecondary">Short Code</th>
                    <th className="pb-3 text-sm font-medium text-textSecondary hidden sm:table-cell">Original URL</th>
                    <th className="pb-3 text-sm font-medium text-textSecondary text-center">Clicks</th>
                    <th className="pb-3 text-sm font-medium text-textSecondary hidden md:table-cell">Created</th>
                    <th className="pb-3 text-sm font-medium text-textSecondary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((link, index) => {
                    const shortUrl = `${window.location.origin}/api/${link.shortCode}`;
                    return (
                      <tr key={link.shortCode} className={index % 2 === 0 ? 'bg-background/50' : ''}>
                        <td className="py-3 pr-4">
                          <code className="text-accent font-mono text-sm">{link.shortCode}</code>
                        </td>
                        <td className="py-3 pr-4 hidden sm:table-cell">
                          <div className="max-w-xs">
                            <a
                              href={link.originalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:underline text-sm"
                              title={link.originalUrl}
                            >
                              {truncateText(link.originalUrl, 50)}
                            </a>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {link.clicks}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-sm text-textSecondary hidden md:table-cell">
                          {formatDate(link.createdAt)}
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => copyToClipboard(shortUrl)}
                            className="text-xs px-2 py-1 bg-border hover:bg-border/80 text-textPrimary rounded transition-colors"
                            title="Copy short URL"
                          >
                            Copy
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}