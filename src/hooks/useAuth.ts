import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

export interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const loadFromSupabase = useStore((s) => s.loadFromSupabase);
  const clearUserData = useStore((s) => s.clearUserData);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        loadFromSupabase(data.session.user.id, data.session.user.email ?? undefined);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      if (sess?.user) {
        loadFromSupabase(sess.user.id, sess.user.email ?? undefined);
      } else {
        clearUserData();
      }
    });

    return () => subscription.unsubscribe();
  }, [loadFromSupabase, clearUserData]);

  return { session, user: session?.user ?? null, loading };
}
