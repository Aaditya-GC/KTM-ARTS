"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoldButton } from "@/components/shared/gold-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Artist } from "@/lib/db/schema";

const SPECIALIZATION_OPTIONS = ["Mandala", "Deities", "Life of Buddha", "Landscape", "Abstract", "Other"];

interface Award {
  title: string;
  year: number;
}

interface Props {
  artist: Artist;
}

export function ProfileEditForm({ artist }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [specializations, setSpecializations] = useState<string[]>(artist.specialization ?? []);
  const [awards, setAwards] = useState<Award[]>(
    (artist.awards as Award[]) ?? []
  );
  const [bioChars, setBioChars] = useState(artist.bio?.length ?? 0);

  function toggleSpecialization(spec: string) {
    setSpecializations((prev) => prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]);
  }

  function addAward() {
    setAwards((prev) => [...prev, { title: "", year: new Date().getFullYear() }]);
  }

  function updateAward(index: number, field: "title" | "year", value: string | number) {
    setAwards((prev) => prev.map((a, i) => (i === index ? { ...a, [field]: value } : a)));
  }

  function removeAward(index: number) {
    setAwards((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      slug: artist.slug,
      bio: (formData.get("bio") as string) || "",
      lineage: (formData.get("lineage") as string) || undefined,
      specialization: specializations,
      experienceYears: formData.get("experienceYears") ? Number(formData.get("experienceYears")) : undefined,
      location: (formData.get("location") as string) || undefined,
      awards: awards.filter((a) => a.title.trim()),
    };

    try {
      const { updateArtistProfile } = await import("@/lib/auth/artist-actions");
      const result = await updateArtistProfile(artist.id, data);

      const err = result as { error: string } | undefined;
      if (err?.error) {
        setError(err.error);
        setLoading(false);
        return;
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  async function handleStudioImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { uploadArtistImage } = await import("@/lib/auth/artist-actions");
      const result = await uploadArtistImage(formData) as { error?: string };
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    }

    e.target.value = "";
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-headline-md text-on-surface mb-8">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* BIO */}
        <section className="bg-surface-container-low border border-outline-variant p-6 rounded-sm space-y-4">
          <h2 className="text-label-sm uppercase tracking-widest text-primary font-bold">About</h2>

          <div>
            <Label htmlFor="bio" className="text-on-surface-variant text-body-md">Bio</Label>
            <textarea
              id="bio"
              name="bio"
              maxLength={2000}
              defaultValue={artist.bio ?? ""}
              onChange={(e) => setBioChars(e.target.value.length)}
              className="w-full bg-surface border border-outline-variant text-on-surface p-3 rounded-sm min-h-[120px] mt-1"
            />
            <p className="text-label-sm text-on-surface-variant/60 text-right mt-1">{bioChars}/2000</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lineage" className="text-on-surface-variant text-body-md">Lineage</Label>
              <Input id="lineage" name="lineage" defaultValue={artist.lineage ?? ""}
                placeholder="e.g. 4th generation Karma Gadri tradition"
                className="bg-surface border-outline-variant text-on-surface mt-1" />
            </div>
            <div>
              <Label htmlFor="location" className="text-on-surface-variant text-body-md">Location</Label>
              <Input id="location" name="location" defaultValue={artist.location ?? ""}
                placeholder="e.g. Boudha, Kathmandu"
                className="bg-surface border-outline-variant text-on-surface mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experienceYears" className="text-on-surface-variant text-body-md">Experience (years)</Label>
              <Input id="experienceYears" name="experienceYears" type="number" min={0} max={80}
                defaultValue={artist.experienceYears ?? ""}
                className="bg-surface border-outline-variant text-on-surface mt-1" />
            </div>
          </div>
        </section>

        {/* SPECIALIZATIONS */}
        <section className="bg-surface-container-low border border-outline-variant p-6 rounded-sm space-y-4">
          <h2 className="text-label-sm uppercase tracking-widest text-primary font-bold">Specializations</h2>
          <div className="flex flex-wrap gap-2">
            {SPECIALIZATION_OPTIONS.map((spec) => (
              <button
                key={spec}
                type="button"
                onClick={() => toggleSpecialization(spec)}
                className={`px-4 py-2 text-label-sm uppercase tracking-widest rounded-full border transition-colors ${
                  specializations.includes(spec)
                    ? "bg-primary text-on-primary border-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </section>

        {/* AWARDS */}
        <section className="bg-surface-container-low border border-outline-variant p-6 rounded-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-label-sm uppercase tracking-widest text-primary font-bold">Awards</h2>
            <button type="button" onClick={addAward}
              className="px-4 py-2 border border-primary/40 text-primary text-label-sm uppercase rounded-full hover:bg-primary/10">
              Add Award
            </button>
          </div>

          {awards.length === 0 && (
            <p className="text-on-surface-variant text-body-md italic">No awards added yet.</p>
          )}

          <div className="space-y-3">
            {awards.map((award, i) => (
              <div key={i} className="flex gap-3 items-center">
                <Input
                  placeholder="Award title"
                  value={award.title}
                  onChange={(e) => updateAward(i, "title", e.target.value)}
                  className="bg-surface border-outline-variant text-on-surface flex-1"
                />
                <Input
                  type="number"
                  min={1900}
                  max={new Date().getFullYear()}
                  placeholder="Year"
                  value={award.year || ""}
                  onChange={(e) => updateAward(i, "year", parseInt(e.target.value) || 0)}
                  className="bg-surface border-outline-variant text-on-surface w-28"
                />
                <button type="button" onClick={() => removeAward(i)} className="text-error hover:text-error/80 shrink-0">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* STUDIO IMAGES */}
        <section className="bg-surface-container-low border border-outline-variant p-6 rounded-sm space-y-4">
          <h2 className="text-label-sm uppercase tracking-widest text-primary font-bold">Studio Images</h2>

          {artist.studioImages && artist.studioImages.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {artist.studioImages.map((url, i) => (
                <img key={url} src={url} alt={`Studio ${i + 1}`} className="w-full aspect-square object-cover rounded-sm" />
              ))}
            </div>
          )}

          <div>
            <Label htmlFor="studioImage" className="text-on-surface-variant text-body-md">Upload studio image</Label>
            <Input
              id="studioImage"
              type="file"
              accept="image/*"
              onChange={handleStudioImageUpload}
              className="bg-surface border-outline-variant text-on-surface mt-1 file:bg-primary file:text-on-primary file:border-0 file:px-4 file:py-2 file:rounded-full file:mr-4 file:text-label-sm file:uppercase file:tracking-widest"
            />
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="bg-error-container/20 border border-error/30 text-error p-4 rounded-sm">
            {error}
          </div>
        )}

        {/* SUBMIT */}
        <div className="flex gap-4">
          <GoldButton type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </GoldButton>
        </div>
      </form>
    </div>
  );
}
