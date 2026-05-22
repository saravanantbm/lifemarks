import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSpotifyCallback } from '../lib/spotify';

export function SpotifyCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const err = params.get('error');

    if (err || !code) {
      setError(err ?? 'No authorization code received');
      setTimeout(() => navigate('/settings'), 3000);
      return;
    }

    handleSpotifyCallback(code)
      .then(() => navigate('/settings', { state: { spotifyConnected: true } }))
      .catch((e) => {
        setError(e.message);
        setTimeout(() => navigate('/settings'), 3000);
      });
  }, [navigate]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#0f0a1e]">
      <div className="text-center space-y-3">
        {error ? (
          <>
            <p className="text-red-400 font-medium">Connection failed</p>
            <p className="text-white/40 text-sm">{error}</p>
            <p className="text-white/20 text-xs">Redirecting back…</p>
          </>
        ) : (
          <>
            <p className="text-[#1DB954] text-4xl">♫</p>
            <p className="text-white font-medium">Connecting Spotify…</p>
          </>
        )}
      </div>
    </div>
  );
}
