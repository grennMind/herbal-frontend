import { supabase } from "../config/supabase";

// Sign up
export const signUp = async ({ email, password, name, user_type }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, user_type }
    }
  });
  return { data, error };
};

// Sign in
export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Get current user
export const getUser = () => supabase.auth.getUser();
