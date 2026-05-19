import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Shield, Info, LogOut, ChevronRight, Edit3, Check, X, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';

export function Settings() {
  const user = useStore((s) => s.user);
  const goals = useStore((s) => s.goals);
  const experiences = useStore((s) => s.experiences);
  const updateDisplayName = useStore((s) => s.updateDisplayName);

  const [editName, setEditName] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name || '');
  const [signingOut, setSigningOut] = useState(false);

  const stats = [
    { label: 'Total Goals', value: goals.length },
    { label: 'Completed', value: goals.filter((g) => g.status === 'completed').length },
    { label: 'Experiences', value: experiences.length },
    { label: 'Done', value: experiences.filter((e) => e.status === 'done').length },
  ];

  function handleSaveName() {
    if (nameValue.trim()) {
      updateDisplayName(nameValue.trim());
      setEditName(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    setSigningOut(false);
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
          sublabel: 'Your data is encrypted & private',
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
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center text-2xl font-bold text-white shrink-0">
            {(user?.name || '?')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            {editName ? (
              <div className="flex items-center gap-2">
                <input
                  className="input text-sm py-1.5 flex-1"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
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
                <p className="text-white font-bold text-lg truncate">{user?.name}</p>
                <button
                  onClick={() => { setNameValue(user?.name || ''); setEditName(true); }}
                  className="text-white/30 hover:text-brand-400 shrink-0"
                >
                  <Edit3 size={14} />
                </button>
              </div>
            )}
            {user?.email && (
              <p className="text-white/40 text-sm truncate">{user.email}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 border-t border-white/10 pt-4">
          {stats.map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-white font-bold text-lg">{value}</p>
              <p className="text-white/40 text-[11px] leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Settings sections */}
      {sections.map((section) => (
        <div key={section.title} className="mb-4">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-2 px-1">{section.title}</p>
          <div className="card space-y-1 py-2">
            {section.items.map((item) => (
              <button
                key={item.label}
                onClick={item.action || undefined}
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

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        disabled={signingOut}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 text-sm font-medium transition-all mt-2 disabled:opacity-50"
      >
        {signingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
        {signingOut ? 'Signing out…' : 'Sign Out'}
      </button>

      <p className="text-center text-white/20 text-xs mt-8">
        Lifemarks — Mark what matters. Live what you love.
      </p>
    </div>
  );
}
