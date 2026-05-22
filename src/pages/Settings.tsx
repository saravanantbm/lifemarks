import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, MessageCircle, Shield, Info, LogOut,
  ChevronRight, Edit3, Check, X, Eye, EyeOff, Loader2, Music2, Link2Off,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  initiateSpotifyAuth, isSpotifyConnected, disconnectSpotify, fetchAllLikedSongs,
  type SpotifyTrack,
} from '../lib/spotify';

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string | undefined;

export function Settings() {
  const location = useLocation();
  const user = useStore((s) => s.user);
  const goals = useStore((s) => s.goals);
  const experiences = useStore((s) => s.experiences);
  const addExperience = useStore((s) => s.addExperience);
  const signIn = useStore((s) => s.signIn);
  const signOut = useStore((s) => s.signOut);
  const updateProfileName = useStore((s) => s.updateProfileName);
  const authLoading = useStore((s) => s.authLoading);
  const authError = useStore((s) => s.authError);
  const clearAuthError = useStore((s) => s.clearAuthError);

  const [editName, setEditName] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name ?? '');
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Spotify state
  const [spotifyConnected, setSpotifyConnected] = useState(isSpotifyConnected);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<{ fetched: number; total: number } | null>(null);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.spotifyConnected) {
      setSpotifyConnected(true);
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location]);

  async function handleSpotifyImport() {
    setImporting(true);
    setImportProgress(null);
    setImportResult(null);
    setImportError(null);
    try {
      const tracks = await fetchAllLikedSongs((fetched, total) =>
        setImportProgress({ fetched, total })
      );
      const existingTitles = new Set(
        experiences.filter((e) => e.type === 'Music').map((e) => e.title.toLowerCase())
      );
      const toImport: SpotifyTrack[] = tracks.filter(
        (t) => !existingTitles.has(`${t.title} — ${t.artist}`.toLowerCase())
      );
      for (const t of toImport) {
        addExperience({
          title: `${t.title} — ${t.artist}`,
          type: 'Music',
          notes: t.album,
          link: t.spotifyUrl,
        });
      }
      setImportResult(
        toImport.length > 0
          ? `Imported ${toImport.length} song${toImport.length !== 1 ? 's' : ''}${tracks.length - toImport.length > 0 ? ` (${tracks.length - toImport.length} already in library)` : ''}`
          : 'All songs already in your library'
      );
    } catch (e) {
      setImportError((e as Error).message);
      if ((e as Error).message.includes('expired') || (e as Error).message.includes('reconnect')) {
        setSpotifyConnected(false);
      }
    } finally {
      setImporting(false);
      setImportProgress(null);
    }
  }

  function handleDisconnectSpotify() {
    disconnectSpotify();
    setSpotifyConnected(false);
    setImportResult(null);
    setImportError(null);
  }

  const stats = [
    { label: 'Total Goals', value: goals.length },
    { label: 'Completed', value: goals.filter((g) => g.status === 'completed').length },
    { label: 'Experiences', value: experiences.length },
    { label: 'Done', value: experiences.filter((e) => e.status === 'done').length },
  ];

  async function handleSaveName() {
    if (nameValue.trim()) {
      await updateProfileName(nameValue.trim());
      setEditName(false);
    }
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    clearAuthError();
    if (authMode === 'signin') {
      await signIn(email.trim(), password);
    }
  }

  function openAuth(mode: 'signin' | 'signup') {
    clearAuthError();
    setEmail('');
    setPassword('');
    setNewName('');
    setAuthMode(mode);
  }

  const whatsappUrl =
    'https://wa.me/919944674648?text=' +
    encodeURIComponent("Hi! I'm using Lifemarks and I'd like to report a bug / request a feature:\n\n");

  const sections = [
    {
      title: 'Support',
      items: [
        {
          icon: MessageCircle,
          label: 'WhatsApp Support',
          sublabel: 'Chat with us directly',
          action: () => window.open(whatsappUrl, '_blank'),
          color: 'text-emerald-400',
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: Shield,
          label: 'Privacy Policy',
          sublabel: 'How we handle your data',
          action: () => {},
          color: 'text-blue-400',
        },
        {
          icon: Info,
          label: 'App Version',
          sublabel: 'v1.0.0 — MVP',
          action: null,
          color: 'text-white/40',
        },
      ],
    },
  ];

  return (
    <div className="px-4 pt-6 pb-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-5">Settings</h1>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-5 bg-gradient-to-br from-brand-900/60 to-purple-900/40"
      >
        {user ? (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center text-2xl font-bold text-white">
                {user.name[0].toUpperCase()}
              </div>
              <div className="flex-1">
                {editName ? (
                  <div className="flex items-center gap-2">
                    <input
                      className="input text-sm py-1.5 flex-1"
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      autoFocus
                    />
                    <button onClick={handleSaveName} className="p-1.5 text-brand-400 hover:text-brand-300">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditName(false)} className="p-1.5 text-white/40 hover:text-white">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-white font-bold text-lg">{user.name}</p>
                    <button
                      onClick={() => { setNameValue(user.name); setEditName(true); }}
                      className="text-white/30 hover:text-brand-400"
                    >
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
                {user.email && <p className="text-white/40 text-sm">{user.email}</p>}
                <p className="text-emerald-400 text-xs mt-0.5">✓ Synced to cloud</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {stats.map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-white font-bold text-lg">{value}</p>
                  <p className="text-white/40 text-[11px] leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-0">
                <User size={28} className="text-white/40" />
              </div>
              <div>
                <p className="text-white font-semibold">Exploring anonymously</p>
                <p className="text-white/40 text-xs mt-0.5">Data is only on this device</p>
              </div>
            </div>

            {authMode === null ? (
              <div className="flex gap-2">
                <button onClick={() => openAuth('signin')} className="flex-1 btn-primary py-2 text-sm">
                  Sign In
                </button>
                <button onClick={() => openAuth('signup')} className="flex-1 btn-ghost py-2 text-sm border border-brand-500/30">
                  Create Account
                </button>
              </div>
            ) : (
              <form onSubmit={handleAuth} className="space-y-3">
                <p className="text-white/60 text-sm font-medium">
                  {authMode === 'signin' ? 'Sign in to your account' : 'Create your account'}
                </p>
                {authMode === 'signup' && (
                  <input
                    className="input text-sm"
                    placeholder="Your name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    autoFocus
                  />
                )}
                <input
                  className="input text-sm"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus={authMode === 'signin'}
                />
                <div className="relative">
                  <input
                    className="input text-sm pr-10"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {authError && (
                  <p className="text-red-400 text-xs">{authError}</p>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="flex-1 btn-primary py-2 text-sm flex items-center justify-center gap-1.5"
                  >
                    {authLoading ? <Loader2 size={15} className="animate-spin" /> : authMode === 'signin' ? 'Sign In' : 'Create Account'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode(null); clearAuthError(); }}
                    className="btn-ghost py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => openAuth(authMode === 'signin' ? 'signup' : 'signin')}
                  className="w-full text-center text-white/30 text-xs hover:text-white/50 transition-colors"
                >
                  {authMode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </form>
            )}
          </div>
        )}
      </motion.div>

      {/* Spotify */}
      {SPOTIFY_CLIENT_ID && (
        <div className="mb-4">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-2 px-1">Integrations</p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1DB954]/20 flex items-center justify-center flex-shrink-0">
                <Music2 size={18} className="text-[#1DB954]" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Spotify</p>
                <p className="text-white/40 text-xs">
                  {spotifyConnected ? 'Connected — import your liked songs' : 'Connect to import your liked songs'}
                </p>
              </div>
              {spotifyConnected ? (
                <button
                  onClick={handleDisconnectSpotify}
                  className="flex items-center gap-1 text-white/30 hover:text-red-400 text-xs transition-colors"
                >
                  <Link2Off size={13} /> Disconnect
                </button>
              ) : (
                <button
                  onClick={initiateSpotifyAuth}
                  className="px-3 py-1.5 rounded-lg bg-[#1DB954] text-black text-xs font-bold hover:bg-[#1ed760] transition-colors"
                >
                  Connect
                </button>
              )}
            </div>

            {spotifyConnected && (
              <div className="space-y-2">
                <button
                  onClick={handleSpotifyImport}
                  disabled={importing}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1DB954]/10 border border-[#1DB954]/20 text-[#1DB954] text-sm font-medium hover:bg-[#1DB954]/20 transition-colors disabled:opacity-60"
                >
                  {importing ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      {importProgress
                        ? `Fetching ${importProgress.fetched} / ${importProgress.total}…`
                        : 'Fetching liked songs…'}
                    </>
                  ) : (
                    'Import Liked Songs'
                  )}
                </button>

                {importResult && (
                  <p className="text-center text-emerald-400 text-xs">{importResult}</p>
                )}
                {importError && (
                  <p className="text-center text-red-400 text-xs">{importError}</p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Settings sections */}
      {sections.map((section) => (
        <div key={section.title} className="mb-4">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-2 px-1">{section.title}</p>
          <div className="card space-y-1 py-2">
            {section.items.map((item) => (
              <button
                key={item.label}
                onClick={item.action ?? undefined}
                disabled={!item.action}
                className="w-full flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-white/5 transition-colors text-left disabled:cursor-default"
              >
                <item.icon size={18} className={item.color} />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  {item.sublabel && <p className="text-white/40 text-xs">{item.sublabel}</p>}
                </div>
                {item.action && <ChevronRight size={14} className="text-white/20" />}
              </button>
            ))}
          </div>
        </div>
      ))}

      {user && (
        <button
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 text-sm font-medium transition-all mt-2"
        >
          <LogOut size={16} /> Sign Out
        </button>
      )}

      <p className="text-center text-white/20 text-xs mt-8">
        Lifemarks — Mark what matters. Live what you love.
      </p>
    </div>
  );
}
