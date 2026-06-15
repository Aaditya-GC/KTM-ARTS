"use server";

import { createClient } from "@/lib/supabase/server";
import { signUpSchema, signInSchema } from "@/lib/validators/auth";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
    },
  });

  if (error) return { error: error.message };

  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      full_name: parsed.data.fullName,
      role: "client",
    });

    if (profileError) return { error: profileError.message };
  }

  redirect("/verify");
}

export async function signIn(formData: FormData) {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { error: error.message };

  redirect("/dashboard");
}

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Silently handle error
  }
  redirect("/");
}
