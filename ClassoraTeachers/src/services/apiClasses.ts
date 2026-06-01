import { generateClassCode } from "../utils/generateClassCode";
import supabase from "./supabase";

interface NewClass {
  class_name: string;
  description: string | null;
  max_students: number;
  room: string | null;
  start_date: string;
  end_date: string;
  status: "active" | "inactive" | "completed" | "archived";
  thumbnail: FileList;
}

export async function createClass(newClass: NewClass) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!user) throw new Error("User not found");

  const { data: teacher, error: teacherError } = await supabase
    .from("teachers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (teacherError) {
    console.error(teacherError);
    throw new Error("Teacher profile could not be loaded");
  }

  const imageFile = newClass.thumbnail?.[0];

  if (!imageFile) {
    throw new Error("Thumbnail image is required");
  }

  const imageName = `${crypto.randomUUID()}-${imageFile.name}`.replaceAll("/", "");

  const { error: storageError } = await supabase.storage
    .from("thumbnails")
    .upload(imageName, imageFile);

  if (storageError) {
    console.error(storageError);
    throw new Error("Class thumbnail could not be uploaded");
  }

  const imagePath = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/thumbnails/${imageName}`;

  const { thumbnail, ...classData } = newClass;

  const { data, error } = await supabase
    .from("classes")
    .insert([
      {
        ...classData,
        teacher_id: teacher.id,
        class_code: generateClassCode(),
        thumbnail: imagePath,
      },
    ])
    .select()
    .single();

  if (error) {
    await supabase.storage.from("thumbnails").remove([imageName]);
    console.error(error);
    throw new Error("Class could not be created");
  }

  return data;
}

export async function getClasses() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!user) throw new Error("User not found");

  const { data: teacher, error: teacherError } = await supabase
    .from("teachers")
    .select("id, auth_user_id, full_name, email")
    .eq("auth_user_id", user.id)
    .single();

  if (teacherError) {
    console.error("teacherError:", teacherError);
    throw new Error("Teacher profile could not be loaded");
  }

  // console.log("teacher:", teacher);

  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("teacher_id", teacher.id);

  if (error) {
    console.error("classesError:", error);
    throw new Error("Classes could not be loaded");
  }

    // console.log("classes:", data);
    // console.log("teacher id:", teacher.id);
    // console.log("classes:", data);

  return data;
}

export async function getClassByClassId(classId: number) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!user) throw new Error("User not found");

  const { data: teacher, error: teacherError } = await supabase
    .from("teachers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (teacherError) {
    console.error("teacherError:", teacherError);
    throw new Error("Teacher profile could not be loaded");
  }

  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("id", classId)
    .eq("teacher_id", teacher.id)
    .single();

  if (error) {
    console.error("classError:", error);
    throw new Error("Class could not be loaded");
  }

  return data;
}


export async function updateClass({
  id,
  newClassData,
}: {
  id: number;
  newClassData: {
    class_name: string;
    description: string | null;
    max_students: number;
    room: string | null;
    start_date: string;
    end_date: string;
  };
}) {
  const { data, error } = await supabase
    .from("classes")
    .update(newClassData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function updateClassStatus({
  id,
  status,
}: {
  id: number;
  status: "inactive" | "archived";
}) {
  const { data, error } = await supabase
    .from("classes")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}