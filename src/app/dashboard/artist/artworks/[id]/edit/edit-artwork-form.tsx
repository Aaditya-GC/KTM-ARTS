"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoldButton } from "@/components/shared/gold-button";
import { OutlineButton } from "@/components/shared/outline-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { Artwork, CreationStep, Certificate } from "@/types";

const STYLE_OPTIONS = ["Karma Gadri", "Newari", "Tibetan", "Thangka", "Other"];
const CATEGORY_OPTIONS = ["Mandala", "Deities", "Life of Buddha", "Landscape", "Abstract", "Thangka", "Other"];
const MATERIAL_SUGGESTIONS = ["24K Gold", "Lapis Lazuli", "Vermilion", "Mineral Pigments", "Cotton Canvas", "Silk Canvas"];
const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const currentYear = new Date().getFullYear();

interface Props {
  artwork: Artwork;
  categories: string[];
  steps: CreationStep[];
  certificate: Certificate | null;
}

interface StepEntry {
  stepNumber: number;
  title: string;
  description: string;
  durationDays: number | null;
}

export function EditArtworkForm({ artwork, categories: initialCategories, steps: initialSteps, certificate }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [materialsInput, setMaterialsInput] = useState("");
  const [materials, setMaterials] = useState<string[]>(artwork.materials ?? []);
  const [stepEntries, setStepEntries] = useState<StepEntry[]>(
    initialSteps.map((s) => ({
      stepNumber: s.stepNumber,
      title: s.title,
      description: s.description ?? "",
      durationDays: s.durationDays,
    }))
  );
  const [certLoading, setCertLoading] = useState(false);
  const [certMessage, setCertMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      deity: (formData.get("deity") as string) || undefined,
      style: (formData.get("style") as string) || undefined,
      medium: (formData.get("medium") as string) || undefined,
      materials: materials.length > 0 ? materials : undefined,
      dimensionsCm: formData.get("dimensionHeight") && formData.get("dimensionWidth")
        ? { height: Number(formData.get("dimensionHeight")), width: Number(formData.get("dimensionWidth")) }
        : undefined,
      priceNpr: parseInt(formData.get("priceNpr") as string),
      priceUsd: formData.get("priceUsd") ? parseInt(formData.get("priceUsd") as string) : undefined,
      yearCreated: formData.get("yearCreated") ? parseInt(formData.get("yearCreated") as string) : undefined,
      categories,
      status: (artwork.status === "available" ? "available" : "draft") as "available" | "draft",
    };

    try {
      const { updateArtwork, uploadArtworkImage } = await import("@/lib/artwork-actions");
      const result = await updateArtwork(artwork.id, data);

      if (result && "error" in result) {
        setError(result.error);
        setLoading(false);
        return;
      }

      if (selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          setUploadProgress(`Uploading image ${i + 1} of ${selectedFiles.length}...`);
          const fileFormData = new FormData();
          fileFormData.append("file", selectedFiles[i]);
          const uploadResult = await uploadArtworkImage(artwork.id, fileFormData);
          if ("error" in uploadResult) {
            setError(`Image ${i + 1} failed: ${uploadResult.error}`);
            setLoading(false);
            setUploadProgress(null);
            return;
          }
        }
      }

      router.push("/dashboard/artist/artworks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  async function handleSaveSteps() {
    try {
      const { saveCreationSteps } = await import("@/lib/artwork-actions");
      await saveCreationSteps(
        artwork.id,
        stepEntries.map((s) => ({
          stepNumber: s.stepNumber,
          title: s.title,
          description: s.description || undefined,
          durationDays: s.durationDays ?? undefined,
        }))
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save steps");
    }
  }

  async function handleGenerateCertificate() {
    setCertLoading(true);
    setCertMessage(null);
    try {
      const { generateCertificate } = await import("@/lib/artwork-actions");
      const result = await generateCertificate(artwork.id);
      if (result && "error" in result) {
        setCertMessage(`Error: ${result.error}`);
      } else {
        setCertMessage("Certificate generated successfully!");
        router.refresh();
      }
    } catch (err) {
      setCertMessage(err instanceof Error ? err.message : "Failed to generate certificate");
    } finally {
      setCertLoading(false);
    }
  }

  async function handleRemoveImage(imageUrl: string) {
    try {
      const { removeArtworkImage } = await import("@/lib/artwork-actions");
      await removeArtworkImage(artwork.id, imageUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove image");
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files].slice(0, MAX_IMAGES));
    e.target.value = "";
  }

  function toggleCategory(cat: string) {
    setCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  }

  function addMaterial(mat: string) {
    if (!materials.includes(mat)) setMaterials((prev) => [...prev, mat]);
  }

  function removeMaterial(mat: string) {
    setMaterials((prev) => prev.filter((m) => m !== mat));
  }

  function addStep() {
    setStepEntries((prev) => [
      ...prev,
      { stepNumber: prev.length + 1, title: "", description: "", durationDays: null },
    ]);
  }

  function updateStep(index: number, field: keyof StepEntry, value: string | number | null) {
    setStepEntries((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  function removeStep(index: number) {
    setStepEntries((prev) => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, stepNumber: i + 1 })));
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-headline-md text-on-surface mb-8">Edit Artwork</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* BASIC INFO */}
        <section className="bg-surface-container-low border border-outline-variant p-6 rounded-sm space-y-4">
          <h2 className="text-label-sm uppercase tracking-widest text-primary font-bold">Basic Info</h2>

          <div>
            <Label htmlFor="title" className="text-on-surface-variant text-body-md">Title</Label>
            <Input id="title" name="title" defaultValue={artwork.title} required
              className="bg-surface border-outline-variant text-on-surface mt-1" />
          </div>

          <div>
            <Label htmlFor="description" className="text-on-surface-variant text-body-md">Description</Label>
            <textarea id="description" name="description" defaultValue={artwork.description} required
              className="w-full bg-surface border border-outline-variant text-on-surface p-3 rounded-sm min-h-[100px] mt-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deity" className="text-on-surface-variant text-body-md">Deity</Label>
              <Input id="deity" name="deity" defaultValue={artwork.deity ?? ""}
                className="bg-surface border-outline-variant text-on-surface mt-1" />
            </div>
            <div>
              <Label htmlFor="style" className="text-on-surface-variant text-body-md">Style</Label>
              <select id="style" name="style" defaultValue={artwork.style ?? ""}
                className="w-full bg-surface border border-outline-variant text-on-surface p-3 rounded-sm mt-1">
                <option value="">Select style</option>
                {STYLE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="medium" className="text-on-surface-variant text-body-md">Medium</Label>
            <Input id="medium" name="medium" defaultValue={artwork.medium ?? ""}
              className="bg-surface border-outline-variant text-on-surface mt-1" />
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="bg-surface-container-low border border-outline-variant p-6 rounded-sm space-y-4">
          <h2 className="text-label-sm uppercase tracking-widest text-primary font-bold">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CATEGORY_OPTIONS.map((cat) => (
              <div key={cat} className="flex items-center gap-3">
                <Checkbox
                  id={`cat-${cat}`}
                  checked={categories.includes(cat)}
                  onCheckedChange={() => toggleCategory(cat)}
                  className="border-outline-variant accent-primary"
                />
                <Label htmlFor={`cat-${cat}`} className="text-on-surface-variant text-body-md">{cat}</Label>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section className="bg-surface-container-low border border-outline-variant p-6 rounded-sm space-y-4">
          <h2 className="text-label-sm uppercase tracking-widest text-primary font-bold">Pricing & Dimensions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priceNpr" className="text-on-surface-variant text-body-md">Price (NPR)</Label>
              <Input id="priceNpr" name="priceNpr" type="number" defaultValue={artwork.priceNpr} required
                className="bg-surface border-outline-variant text-on-surface mt-1" />
            </div>
            <div>
              <Label htmlFor="priceUsd" className="text-on-surface-variant text-body-md">Price (USD)</Label>
              <Input id="priceUsd" name="priceUsd" type="number" defaultValue={artwork.priceUsd ?? ""}
                className="bg-surface border-outline-variant text-on-surface mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dimensionHeight" className="text-on-surface-variant text-body-md">Height (cm)</Label>
              <Input id="dimensionHeight" name="dimensionHeight" type="number"
                defaultValue={(artwork.dimensionsCm as { height?: number })?.height ?? ""}
                className="bg-surface border-outline-variant text-on-surface mt-1" />
            </div>
            <div>
              <Label htmlFor="dimensionWidth" className="text-on-surface-variant text-body-md">Width (cm)</Label>
              <Input id="dimensionWidth" name="dimensionWidth" type="number"
                defaultValue={(artwork.dimensionsCm as { width?: number })?.width ?? ""}
                className="bg-surface border-outline-variant text-on-surface mt-1" />
            </div>
            <div>
              <Label htmlFor="yearCreated" className="text-on-surface-variant text-body-md">Year Created</Label>
              <Input id="yearCreated" name="yearCreated" type="number" defaultValue={artwork.yearCreated ?? ""}
                className="bg-surface border-outline-variant text-on-surface mt-1" />
            </div>
          </div>
        </section>

        {/* MATERIALS */}
        <section className="bg-surface-container-low border border-outline-variant p-6 rounded-sm space-y-4">
          <h2 className="text-label-sm uppercase tracking-widest text-primary font-bold">Materials</h2>

          <div className="flex flex-wrap gap-2">
            {MATERIAL_SUGGESTIONS.map((mat) => (
              <button
                key={mat}
                type="button"
                onClick={() => materials.includes(mat) ? removeMaterial(mat) : addMaterial(mat)}
                className={`px-3 py-1.5 text-label-sm uppercase tracking-widest rounded-full border transition-colors ${
                  materials.includes(mat)
                    ? "bg-primary text-on-primary border-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-accent"
                }`}
              >
                {mat}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={materialsInput}
              onChange={(e) => setMaterialsInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && materialsInput.trim()) { e.preventDefault(); addMaterial(materialsInput.trim()); setMaterialsInput(""); } }}
              placeholder="Type a material and press Enter"
              className="bg-surface border-outline-variant text-on-surface flex-1"
            />
            <button
              type="button"
              onClick={() => { if (materialsInput.trim()) { addMaterial(materialsInput.trim()); setMaterialsInput(""); } }}
              className="px-4 py-2 border border-primary/40 text-primary text-label-sm uppercase rounded-full hover:bg-primary/10"
            >
              Add
            </button>
          </div>

          {materials.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {materials.map((mat) => (
                <span key={mat} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-label-sm rounded-full">
                  {mat}
                  <button type="button" onClick={() => removeMaterial(mat)} className="text-primary hover:text-accent">&times;</button>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* CURRENT IMAGES */}
        <section className="bg-surface-container-low border border-outline-variant p-6 rounded-sm space-y-4">
          <h2 className="text-label-sm uppercase tracking-widest text-primary font-bold">Images</h2>

          {artwork.images && artwork.images.length > 0 && (
            <div>
              <p className="text-label-sm text-on-surface-variant mb-3">Current images</p>
              <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                {artwork.images.map((url, i) => (
                  <div key={url} className="relative group">
                    <Image src={url} alt={`Artwork ${i + 1}`} fill className="object-cover rounded-sm" sizes="(max-width: 768px) 25vw, 20vw" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-primary text-on-primary text-label-sm px-2 py-0.5 rounded-full uppercase tracking-widest text-[10px]">
                        Primary
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(url)}
                      className="absolute top-1 right-1 w-6 h-6 bg-error/90 text-on-error rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="add-images" className="text-on-surface-variant text-body-md">Add more images</Label>
            <Input
              id="add-images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="bg-surface border-outline-variant text-on-surface mt-1 file:bg-primary file:text-on-primary file:border-0 file:px-4 file:py-2 file:rounded-full file:mr-4 file:text-label-sm file:uppercase file:tracking-widest"
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
              {selectedFiles.map((file, i) => (
                <div key={i} className="relative">
                  <img src={URL.createObjectURL(file)} alt={`New ${i + 1}`} className="w-full aspect-square object-cover rounded-sm" />
                  <button
                    type="button"
                    onClick={() => setSelectedFiles((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-6 h-6 bg-error/90 text-on-error rounded-full flex items-center justify-center text-sm"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CREATION STEPS */}
        <section className="bg-surface-container-low border border-outline-variant p-6 rounded-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-label-sm uppercase tracking-widest text-primary font-bold">Creation Steps</h2>
            <button type="button" onClick={addStep}
              className="px-4 py-2 border border-primary/40 text-primary text-label-sm uppercase rounded-full hover:bg-primary/10">
              Add Step
            </button>
          </div>

          {stepEntries.length === 0 && (
            <p className="text-on-surface-variant text-body-md italic">No creation steps yet. Add the process behind this artwork.</p>
          )}

          <div className="space-y-4">
            {stepEntries.map((step, i) => (
              <div key={i} className="flex gap-4 items-start p-4 bg-surface-container border border-outline-variant rounded-sm">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-label-sm font-bold shrink-0 mt-1">
                  {step.stepNumber}
                </div>
                <div className="flex-1 space-y-3">
                  <Input
                    placeholder="Step title"
                    value={step.title}
                    onChange={(e) => updateStep(i, "title", e.target.value)}
                    className="bg-surface border-outline-variant text-on-surface"
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={step.description}
                    onChange={(e) => updateStep(i, "description", e.target.value)}
                    className="w-full bg-surface border border-outline-variant text-on-surface p-2 rounded-sm text-body-md min-h-[60px]"
                  />
                  <Input
                    type="number"
                    min={1}
                    placeholder="Duration (days)"
                    value={step.durationDays ?? ""}
                    onChange={(e) => updateStep(i, "durationDays", e.target.value ? parseInt(e.target.value) : null)}
                    className="bg-surface border-outline-variant text-on-surface w-40"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeStep(i)}
                  className="text-error hover:text-error/80 shrink-0 mt-1"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            ))}
          </div>

          {stepEntries.length > 0 && (
            <button
              type="button"
              onClick={handleSaveSteps}
              className="px-6 py-2 border border-primary/40 text-primary text-label-sm uppercase rounded-full hover:bg-primary/10"
            >
              Save Steps
            </button>
          )}
        </section>

        {/* CERTIFICATE */}
        {artwork.status === "available" && (
          <section className="bg-surface-container-low border border-outline-variant p-6 rounded-sm space-y-4">
            <h2 className="text-label-sm uppercase tracking-widest text-primary font-bold">Certificate of Heritage</h2>

            {certificate ? (
              <div className="space-y-2">
                <p className="text-body-md text-on-surface">
                  Certificate No: <span className="text-primary font-bold">{certificate.certificateNo}</span>
                </p>
                <p className="text-body-md text-on-surface-variant">
                  Issued: {new Date(certificate.issuedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-body-md text-on-surface-variant mb-3">No certificate generated yet.</p>
                <OutlineButton type="button" disabled={certLoading} onClick={handleGenerateCertificate}>
                  {certLoading ? "Generating..." : "Generate Certificate"}
                </OutlineButton>
                {certMessage && (
                  <p className={`text-sm mt-2 ${certMessage.startsWith("Error") ? "text-error" : "text-primary"}`}>
                    {certMessage}
                  </p>
                )}
              </div>
            )}
          </section>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-error-container/20 border border-error/30 text-error p-4 rounded-sm">
            {error}
          </div>
        )}

        {/* PROGRESS */}
        {uploadProgress && (
          <div className="text-on-surface-variant text-body-md italic">
            {uploadProgress}
          </div>
        )}

        {/* SUBMIT */}
        <div className="flex gap-4">
          <GoldButton type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </GoldButton>
          <button
            type="button"
            onClick={() => router.push("/dashboard/artist/artworks")}
            className="border border-outline-variant text-on-surface-variant px-6 py-3 rounded-sm text-label-sm uppercase tracking-widest hover:bg-surface-container-low transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
