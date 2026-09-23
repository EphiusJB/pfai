'use client';

import { useEffect } from 'react';
// import supabaseAnon  from '@/lib/supabase/anon';
import { useAuthStore } from '@/lib/store/AuthStore';

export default function AuthProvider({ children }) {
   const initialize = useAuthStore((s) => s.initialize);
  // // const setSession = useAuthStore((state) => state.setSession);
  // // const setLoading = useAuthStore((state) => state.setLoading);
  // const supabase = supabaseAnon;

  // useEffect(() => {
  //   // 1. Fetch initial auth session on mount
  //   const initAuth = async () => {
  //     setLoading(true);
  //     const {
  //       data: { session },
  //     } = await supabase.auth.getSession();
  //     setSession(session);
  //   };

  //   initAuth();

  //   // 2. Listen to ongoing auth state changes (login, logout, token refresh)
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session);
  //   });

  //   return () => {
  //     subscription?.unsubscribe();
  //   };
  // }, [setSession, setLoading, supabase]);

  // return <>{children}</>;

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}