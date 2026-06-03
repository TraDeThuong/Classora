import supabase from "./supabase";
import type { Student } from "../types/students";

export const STUDENT_TEACHER_ACCOUNT_ERROR =
  "Teacher accounts cannot log in to the student portal";

interface SignUpData {
  fullName: string;
  email: string;
  password: string;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function getAuthenticatedUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  if (!user) throw new Error("No logged in user");

  return user;
}

async function isCurrentUserTeacher() {
  const user = await getAuthenticatedUser();

  const { data: teacher, error } = await supabase
    .from("teachers")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return Boolean(teacher);
}

async function assertCurrentUserIsNotTeacher() {
  const isTeacher = await isCurrentUserTeacher();

  if (isTeacher) {
    throw new Error(STUDENT_TEACHER_ACCOUNT_ERROR);
  }
}

async function ensureStudentProfile(fullName?: string): Promise<Student> {
  await assertCurrentUserIsNotTeacher();
  const user = await getAuthenticatedUser();

  const email = user.email;
  if (!email) throw new Error("Student email could not be loaded");
  const normalizedEmail = normalizeEmail(email);

  const profile = {
    auth_user_id: user.id,
    full_name:
      fullName ||
      user.user_metadata.full_name ||
      user.user_metadata.name ||
      normalizedEmail,
    email: normalizedEmail,
    avatar_url: user.user_metadata.avatar_url ?? null,
    google_id: user.identities?.[0]?.id ?? null,
    status: "active",
  };

  const { data: existingByAuth, error: existingAuthError } = await supabase
    .from("students")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (existingAuthError) throw new Error(existingAuthError.message);
  if (existingByAuth) return existingByAuth;

  const { data: existingByEmail, error: existingEmailError } = await supabase
    .from("students")
    .select("*")
    .ilike("email", normalizedEmail)
    .maybeSingle();

  if (existingEmailError) throw new Error(existingEmailError.message);

  if (existingByEmail) {
    const { data, error: updateError } = await supabase
      .from("students")
      .update({
        auth_user_id: user.id,
        avatar_url: existingByEmail.avatar_url ?? profile.avatar_url,
        google_id: existingByEmail.google_id ?? profile.google_id,
        status: "active",
      })
      .eq("id", existingByEmail.id)
      .select()
      .single();

    if (updateError) throw new Error(updateError.message);
    return data;
  }

  const { data, error: insertError } = await supabase
    .from("students")
    .insert(profile)
    .select()
    .single();

  if (insertError) throw new Error(insertError.message);

  return data;
}

export async function signUpTeacher({
  fullName,
  email,
  password,
}: SignUpData) {
  const normalizedEmail = normalizeEmail(email);

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("User was not created");

  const { error: profileError } = await supabase.from("teachers").insert({
    auth_user_id: data.user.id,
    full_name: fullName,
    email: normalizedEmail,
    status: "active",
  });

  if (profileError) throw new Error(profileError.message);

  return data;
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/teacher/auth/callback`
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
      redirectTo: `${window.location.origin}/teacher/complete-signup`,
    },
  });

  if (error) throw new Error(error.message);
}

export async function signInWithGoogleForStudentSignup() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/student/auth/callback`,
    },
  });

  if (error) throw new Error(error.message);
}

export async function createStudentProfileFromGoogle() {
  return ensureStudentProfile();
}

export async function signUpStudent({
  fullName,
  email,
  password,
}: SignUpData) {
  const normalizedEmail = normalizeEmail(email);

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("User was not created");

  const student = data.session ? await ensureStudentProfile(fullName) : null;

  return { ...data, student };
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
        email: normalizeEmail(email),
        password,
    });

    if (error) throw new Error(error.message);

    return data;
}

export async function loginStudent({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Student> {
  const { error } = await supabase.auth.signInWithPassword({
    email: normalizeEmail(email),
    password,
  });

  if (error) throw new Error(error.message);

  try {
    return await ensureStudentProfile();
  } catch (studentError) {
    await supabase.auth.signOut();
    throw studentError;
  }
}

export async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/teacher/auth/callback`
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

export async function getCurrentStudent(): Promise<Student | null> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);
  if (!user) return null;

  const { data: teacher, error: teacherError } = await supabase
    .from("teachers")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (teacherError) throw new Error(teacherError.message);
  if (teacher) return null;

  const { data: studentByAuth, error } = await supabase
    .from("students")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (studentByAuth) return studentByAuth;

  if (!user.email) return null;
  const normalizedEmail = normalizeEmail(user.email);

  const { data: studentByEmail, error: emailError } = await supabase
    .from("students")
    .select("*")
    .ilike("email", normalizedEmail)
    .maybeSingle();

  if (emailError) throw new Error(emailError.message);
  if (!studentByEmail) return null;

  const { data: linkedStudent, error: updateError } = await supabase
    .from("students")
    .update({
      auth_user_id: user.id,
      avatar_url: studentByEmail.avatar_url ?? user.user_metadata.avatar_url ?? null,
      google_id: studentByEmail.google_id ?? user.identities?.[0]?.id ?? null,
      status: "active",
    })
    .eq("id", studentByEmail.id)
    .select()
    .single();

  if (updateError) throw new Error(updateError.message);

  return linkedStudent;
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
