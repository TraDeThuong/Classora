import supabase from "./supabase";


interface SignUpData {
  fullName: string;
  email: string;
  password: string;
}

export async function signUpTeacher({
  fullName,
  email,
  password,
}: SignUpData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("User was not created");

  const { error: profileError } = await supabase.from("teachers").insert({
    auth_user_id: data.user.id,
    full_name: fullName,
    email,
    status: "active",
  });

  if (profileError) throw new Error(profileError.message);

  return data;
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    },
  });

  if (error) throw new Error(error.message);
}

export async function createTeacherProfileFromGoogle() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  if (!user) throw new Error("No logged in user");

  const { error: profileError } = await supabase.from("teachers").upsert(
    {
      auth_user_id: user.id,
      full_name: user.user_metadata.full_name || user.email,
      email: user.email,
      avatar_url: user.user_metadata.avatar_url,
      google_id: user.identities?.[0]?.id ?? null,
      status: "active",
    },
    {
      onConflict: "auth_user_id",
    }
  );

  if (profileError) throw new Error(profileError.message);

  return user;
}

export async function signInWithGoogleForSignup() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/complete-signup`,
    },
  });

  if (error) throw new Error(error.message);
}

export async function completeGoogleSignup(password: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!user) throw new Error("No logged in user");

  const { error: passwordError } = await supabase.auth.updateUser({
    password,
  });

  if (
    passwordError &&
    !passwordError.message.includes("New password should be different")
  ) {
    throw new Error(passwordError.message);
  }

  const { error: profileError } = await supabase.from("teachers").upsert(
    {
      auth_user_id: user.id,
      full_name: user.user_metadata.full_name || user.email,
      email: user.email,
      avatar_url: user.user_metadata.avatar_url,
      google_id: user.identities?.[0]?.id ?? null,
      status: "active",
    },
    {
      onConflict: "auth_user_id",
    }
  );

  if (profileError) throw new Error(profileError.message);

  return user;
}

export async function login({email, password,}: {email: string;password: string;}) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw new Error(error.message);

    return data;
}

export async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    },
  });

  if (error) throw new Error(error.message);
}

export async function getCurrentTeacher() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);
  if (!user) return null;

  const { data: teacher, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return teacher;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
}

export interface UpdateTeacherProfileData {
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  degree?: string;
  specialization?: string;
}

export async function updateCurrentTeacherProfile(
  updatedData: UpdateTeacherProfileData,
) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);
  if (!user) throw new Error("No authenticated user found");

  const { data, error } = await supabase
    .from("teachers")
    .update(updatedData)
    .eq("auth_user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("updateTeacherProfileError:", error);
    throw new Error("Profile could not be updated");
  }

  return data;
}