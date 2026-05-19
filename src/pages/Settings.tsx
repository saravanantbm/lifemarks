import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, MessageCircle, Shield, Info, LogOut,
  ChevronRight, Edit3, Check, X, Eye, EyeOff, Loader2,
} from 'lucide-react';
import { useStore } from '../store/useStore';

export function Settings() {
  const user = useStore((s) => s.user);
  const goals = useStore((s) => s.goals);
  const experiences = useStore((s) => s.experiences);
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
