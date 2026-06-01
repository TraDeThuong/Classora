import supabase from "../services/supabase";

const fakeAvatars = [
  "avatar_1.png",
  "avatar_2.png",
  "avatar_3.png",
  "avatar_4.png",
  "avatar_5.png",
  "avatar_6.png",
  "avatar_7.png",
  "avatar_8.png",
  "avatar_9.png",
  "avatar_10.png",
];

export function getStudentAvatar(
  avatarUrl: string | null | undefined,
  studentId: number
) {
  if (avatarUrl) return avatarUrl;

  const index = studentId % fakeAvatars.length;
  const fileName = fakeAvatars[index];

  return supabase.storage
    .from("fakeStudentAvatar")
    .getPublicUrl(fileName).data.publicUrl;
}