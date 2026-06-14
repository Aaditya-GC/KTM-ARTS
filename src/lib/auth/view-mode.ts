"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function enableUserView() {
  const jar = await cookies();
  jar.set("view-as-client", "1", { path: "/", maxAge: 60 * 60 * 8, httpOnly: true });
  redirect("/");
}

export async function disableUserView() {
  const jar = await cookies();
  jar.delete("view-as-client");
  redirect("/dashboard");
}

export async function getViewMode(): Promise<boolean> {
  const jar = await cookies();
  return jar.get("view-as-client")?.value === "1";
}
