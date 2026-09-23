import { create } from "zustand";
import supabaseAnon from "@/lib/supabase/anon";

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: true,
  error: null,

  /**
   * Initializes session on startup & listens to real-time auth changes
   */
  initialize: async () => {
    set({ loading: true, error: null });
    try {
      console.log("initializing...");
      const {
        data: { session },
        error,
      } = await supabaseAnon.auth.getSession();

      if (error) throw error;

      set({
        session,
        user: session?.user ?? null,
        loading: false,
      });

      await get().fetchProfile(session.user)

      

      supabaseAnon.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user ?? null,
        });
        get().fetchProfile(session.user)
      });
    } catch (err) {
      set({
        error: err?.message || "Failed to initialize session",
        loading: false,
      });
    }
  },
  fetchProfile: async (user) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabaseAnon
        .from("profiles")
        .select("*")
        .eq("id", user.id);

      if (error) {
        set({ error: error.message, loading: false });
        return { error: error.message };
      }
      set({ profile: data, loading: false, error: null });
    } catch (err) {
      const errorMessage =
        err?.message || "An unexpected error occurred during profile fetch.";
      set({ error: errorMessage, loading: false });
      return { error: errorMessage };
    }
  },

  /**
   * Signs in a user
   */
  signIn: async ({ email, password }) => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabaseAnon.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ error: error.message, loading: false });
        return { error: error.message };
      }

      set({
        user: data.user,
        session: data.session,
        loading: false,
        error: null,
      });

      return { data, error: null };
    } catch (err) {
      const errorMessage =
        err?.message || "An unexpected error occurred during sign in.";
      set({ error: errorMessage, loading: false });
      return { error: errorMessage };
    }
  },

  /**
   * Signs up a new user & creates their initial public profile
   */
  signUp: async ({ email, password, firstName, lastName, phone }) => {
    set({ loading: true, error: null });

    try {
      // 1. Create auth user
      const { data, error } = await supabaseAnon.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone,
          },
        },
      });

      if (error) {
        set({ error: error.message, loading: false });
        return { error: error.message };
      }

      // 2. Create public profile if user was returned
      if (data?.user) {
        const fullName = `${firstName} ${lastName}`.trim();
        const username = email.split("@")[0];
        const encodedName = encodeURIComponent(fullName);
        const avatarUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${encodedName}&backgroundColor=c5c5c5&textColor=ffffff`;

        const { error: profileError } = await supabaseAnon
          .from("profiles")
          .upsert([
            {
              id: data.user.id,
              name: fullName,
              email: data.user.email,
              username,
              avatar_url: avatarUrl,
            },
          ]);

        if (profileError) {
          console.error("Profile creation error:", profileError);
        }
      }

      set({
        user: data.user,
        session: data.session ?? null,
        loading: false,
        error: null,
      });

      return { data, error: null };
    } catch (err) {
      const errorMessage =
        err?.message || "Could not create account. Try again.";
      set({ error: errorMessage, loading: false });
      return { error: errorMessage };
    }
  },

  /**
   * Signs out the current user
   */
  signOut: async () => {
    set({ loading: true });
    try {
      await supabaseAnon.auth.signOut();
      set({
        user: null,
        session: null,
        loading: false,
        error: null,
      });
    } catch (err) {
      set({
        error: err?.message || "Failed to sign out",
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
