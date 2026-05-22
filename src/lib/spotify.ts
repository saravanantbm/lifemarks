const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string | undefined;

const STORAGE_KEYS = {
  accessToken: 'sp_access_token',
  refreshToken: 'sp_refresh_token',
  expiresAt: 'sp_expires_at',
  verifier: 'sp_code_verifier',
};

function getRedirectUri() {
  return `${window.location.origin}/spotify/callback`;
}

// ── PKCE helpers ─────────────────────────────────────────────────────────────

function randomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

function base64url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64urlFromBuffer(buffer: ArrayBuffer): string {
  return base64url(new Uint8Array(buffer));
}

function generateVerifier(): string {
  return base64url(randomBytes(64));
}

async function generateChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64urlFromBuffer(digest);
}

// ── Auth flow ─────────────────────────────────────────────────────────────────

export async function initiateSpotifyAuth() {
  if (!CLIENT_ID) throw new Error('VITE_SPOTIFY_CLIENT_ID is not set');
  const verifier = generateVerifier();
  const challenge = await generateChallenge(verifier);
  localStorage.setItem(STORAGE_KEYS.verifier, verifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: 'user-library-read',
    redirect_uri: getRedirectUri(),
    code_challenge_method: 'S256',
    code_challenge: challenge,
  });
  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

export async function handleSpotifyCallback(code: string): Promise<void> {
  if (!CLIENT_ID) throw new Error('VITE_SPOTIFY_CLIENT_ID is not set');
  const verifier = localStorage.getItem(STORAGE_KEYS.verifier);
  if (!verifier) throw new Error('No code verifier found');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: getRedirectUri(),
      client_id: CLIENT_ID,
      code_verifier: verifier,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error_description ?? 'Token exchange failed');
  }

  const token = await res.json();
  localStorage.setItem(STORAGE_KEYS.accessToken, token.access_token);
  if (token.refresh_token) localStorage.setItem(STORAGE_KEYS.refreshToken, token.refresh_token);
  localStorage.setItem(STORAGE_KEYS.expiresAt, String(Date.now() + token.expires_in * 1000));
  localStorage.removeItem(STORAGE_KEYS.verifier);
}

async function refreshAccessToken(): Promise<string | null> {
  if (!CLIENT_ID) return null;
  const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
  if (!refreshToken) return null;

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
    }),
  });
  if (!res.ok) { disconnectSpotify(); return null; }
  const token = await res.json();
  localStorage.setItem(STORAGE_KEYS.accessToken, token.access_token);
  if (token.refresh_token) localStorage.setItem(STORAGE_KEYS.refreshToken, token.refresh_token);
  localStorage.setItem(STORAGE_KEYS.expiresAt, String(Date.now() + token.expires_in * 1000));
  return token.access_token;
}

async function getValidToken(): Promise<string | null> {
  const token = localStorage.getItem(STORAGE_KEYS.accessToken);
  const expiresAt = Number(localStorage.getItem(STORAGE_KEYS.expiresAt) ?? 0);
  if (!token) return null;
  if (Date.now() > expiresAt - 60_000) return refreshAccessToken();
  return token;
}

export function isSpotifyConnected(): boolean {
  return !!localStorage.getItem(STORAGE_KEYS.accessToken);
}

export function disconnectSpotify(): void {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
}

// ── API ───────────────────────────────────────────────────────────────────────

export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  addedAt: string;
  previewUrl: string | null;
  spotifyUrl: string;
}

export async function fetchAllLikedSongs(
  onProgress?: (fetched: number, total: number) => void,
): Promise<SpotifyTrack[]> {
  const token = await getValidToken();
  if (!token) throw new Error('Not connected to Spotify');

  const tracks: SpotifyTrack[] = [];
  let url: string | null = 'https://api.spotify.com/v1/me/tracks?limit=50';

  let currentToken = token;
  while (url) {
    const response = await fetch(url, { headers: { Authorization: `Bearer ${currentToken}` } });
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) throw new Error('Spotify session expired, please reconnect');
      currentToken = newToken;
      continue;
    }
    if (!response.ok) throw new Error('Failed to fetch liked songs');
    const page = await response.json() as {
      items: Array<{ added_at: string; track: { id: string; name: string; artists: Array<{ name: string }>; album: { name: string }; preview_url: string | null; external_urls: { spotify: string } } }>;
      total: number;
      next: string | null;
    };

    for (const item of page.items) {
      const t = item.track;
      if (!t) continue;
      tracks.push({
        id: t.id,
        title: t.name,
        artist: t.artists.map((a) => a.name).join(', '),
        album: t.album.name,
        addedAt: item.added_at,
        previewUrl: t.preview_url,
        spotifyUrl: t.external_urls?.spotify ?? '',
      });
    }

    onProgress?.(tracks.length, page.total);
    url = page.next;
  }

  return tracks;
}
