"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoldButton } from "@/components/shared/gold-button";
import { OutlineButton } from "@/components/shared/outline-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const STYLE_OPTIONS = ["Karma Gadri", "Newari", "Tibetan", "Thangka", "Other"];
const CATEGORY_OPTIONS = ["Mandala", "Deities", "Life of Buddha", "Landscape", "Abstract", "Thangka", "Other"];
const MATERIAL_SUGGESTIONS = ["24K Gold", "Lapis Lazuli", "Vermilion", "Mineral Pigments", "Cotton Canvas", "Silk Canvas"];
const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const currentYear = new Date().getFullYear();

interface ValidationErrors {
  title?: string;
  description?: string;
  priceNpr?: string;
  categories?: string;
  images?: string;
}

export default function NewArtworkPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"draft" | "available">("draft");
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [materialsInput, setMaterialsInput] = useState("");
  const [materials, setMaterials] = useState<string[]>([]);

  function validate(): ValidationErrors {
    const errors: ValidationErrors = {};
    const title = (document.getElementById("title") as HTMLInputElement)?.value;
    const description = (document.getElementById("description") as HTMLTextAreaElement)?.value;
    const priceNpr = (document.getElementById("priceNpr") as HTMLInputElement)?.value;

    if (!title || title.length < 3) errors.title = "Title must be at least 3 characters";
    if (!description || description.length < 20) errors.description = "Description must be at least 20 characters";
    if (!priceNpr || parseInt(priceNpr) < 1000) errors.priceNpr = "Price must be at least NPR 1,000";
    if (selectedCategories.length === 0) errors.categories = "Select at least one category";
    if (selectedFiles.some((f) => f.size > MAX_IMAGE_SIZE)) errors.images = "Each image must be under 5MB";
    if (selectedFiles.length > MAX_IMAGES) errors.images = `Maximum ${MAX_IMAGES} images allowed`;

    return errors;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const errors = validate();
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

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
      categories: selectedCategories,
      status,
    };

    try {
      const { createArtwork, uploadArtworkImage } = await import("@/lib/artwork-actions");
      const result = await createArtwork(data);

      if (result && "error" in result && typeof result.error === "string") {
        setError(result.error);
        setLoading(false);
        return;
      }

      if (selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          setUploadProgress(`Uploading image ${i + 1} of ${selectedFiles.length}...`);
          const fileFormData = new FormData();
          fileFormData.append("file", selectedFiles[i]);
          const uploadResult = await uploadArtworkImage(result.id, fileFormData);
          if (uploadResult && "error" in uploadResult && typeof uploadResult.error === "string") {
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

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files].slice(0, MAX_IMAGES));
    e.target.value = "";
  }

  function removeFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleCategory(category: string) {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  }

  function addMaterial(material: string) {
    if (!materials.includes(material)) setMaterials((prev) => [...prev, material]);
  }

  function removeMaterial(material: string) {
    setMaterials((prev) => prev.filter((m) => m !== material));
  }

  function handleMaterialsKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && materialsInput.trim()) {
      e.preventDefault();
      addMaterial(materialsInput.trim());
      setMaterialsInput("");
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-headline-md text-on-surface mb-8">Upload Artwork</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* BASIC INFO */}
        <section className="bg-surface-container-low border border-outline-variant p-6 rounded-sm space-y-4">
          <h2 className="text-label-sm uppercase tracking-widest text-primary font-bold">Basic Info</h2>

          <div>
            <Label htmlFor="title" className="text-on-surface-variant text-body-md">Title *</Label>
            <Input id="title" name="title" placeholder="Artwork title" required
              className="bg-surface border-outline-variant text-on-surface mt-1" />
            {validationErrors.title && <p className="text-error text-sm mt-1">{validationErrors.title}</p>}
          </div>

          <div>
            <Label htmlFor="description" className="text-on-surface-variant text-body-md">Description *</Label>
            <textarea id="description" name="description" placeholder="Describe the artwork, its symbolism, and story..." required
              className="w-full bg-surface border border-outline-variant text-on-surface p-3 rounded-sm min-h-[100px] mt-1" />
            {validationErrors.description && <p className="text-error text-sm mt-1">{validationErrors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deity" className="text-on-surface-variant text-body-md">Deity (optional)</Label>
              <Input id="deity" name="deity" placeholder="e.g. White Tara, Mahakala"
                className="bg-surface border-outline-variant text-on-surface mt-1" />
            </div>
            <div>
              <Label htmlFor="style" className="text-on-surface-variant text-body-md">Style</Label>
              <select id="style" name="style"
                className="w-full bg-surface border border-outline-variant text-on-surface p-3 rounded-sm mt-1">
                <option value="">Select style</option>
                {STYLE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="medium" className="text-on-surface-variant text-body-md">Medium (optional)</Label>
            <Input id="medium" name="medium" placeholder="e.g. Mineral pigments on cotton canvas"
              className="bg-surface border-outline-variant text-on-surface mt-1" />
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="bg-surface-container-low border border-outline-variant p-6 rounded-sm space-y-4">
          <h2 className="text-label-sm uppercase tracking-widest text-primary font-bold">Categories *</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CATEGORY_OPTIONS.map((cat) => (
              <div key={cat} className="flex items-center gap-3">
                <Checkbox
                  id={`cat-${cat}`}
                  checked={selectedCategories.includes(cat)}
                  onCheckedChange={() => toggleCategory(cat)}
                  className="border-outline-variant accent-primary"
                />
                <Label htmlFor={`cat-${cat}`} className="text-on-surface-variant text-body-md">{cat}</Label>
              </div>
            ))}
          </div>
          {validationErrors.categories && <p className="text-error text-sm">{validationErrors.categories}</p>}
        </section>

        {/* PRICING */}
        <section className="bg-surface-container-low border border-outline-variant p-6 rounded-sm space-y-4">
          <h2 className="text-label-sm uppercase tracking-widest text-primary font-bold">Pricing & Dimensions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priceNpr" className="text-on-surface-variant text-body-md">Price (NPR) *</Label>
              <Input id="priceNpr" name="priceNpr" type="number" min={1000} placeholder="e.g. 150000" required
                className="bg-surface border-outline-variant text-on-surface mt-1" />
              {validationErrors.priceNpr && <p className="text-error text-sm mt-1">{validationErrors.priceNpr}</p>}
            </div>
            <div>
              <Label htmlFor="priceUsd" className="text-on-surface-variant text-body-md">Price (USD, optional)</Label>
              <Input id="priceUsd" name="priceUsd" type="number" min={1} placeholder="e.g. 1200"
                className="bg-surface border-outline-variant text-on-surface mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dimensionHeight" className="text-on-surface-variant text-body-md">Height (cm)</Label>
              <Input id="dimensionHeight" name="dimensionHeight" type="number" min={1} placeholder="Height"
                className="bg-surface border-outline-variant text-on-surface mt-1" />
            </div>
            <div>
              <Label htmlFor="dimensionWidth" className="text-on-surface-variant text-body-md">Width (cm)</Label>
              <Input id="dimensionWidth" name="dimensionWidth" type="number" min={1} placeholder="Width"
                className="bg-surface border-outline-variant text-on-surface mt-1" />
            </div>
            <div>
              <Label htmlFor="yearCreated" className="text-on-surface-variant text-body-md">Year Created</Label>
              <Input id="yearCreated" name="yearCreated" type="number" min={1900} max={currentYear} placeholder="e.g. 2024"
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
              onKeyDown={handleMaterialsKeyDown}
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

        {/* IMAGES */}
        <section className="bg-surface-container-low border border-outline-variant p-6 rounded-sm space-y-4">
          <h2 className="text-label-sm uppercase tracking-widest text-primary font-bold">Images</h2>

          <div>
            <Label htmlFor="images" className="text-on-surface-variant text-body-md">
              Upload images (max {MAX_IMAGES}, 5MB each)
            </Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="bg-surface border-outline-variant text-on-surface mt-1 file:bg-primary file:text-on-primary file:border-0 file:px-4 file:py-2 file:rounded-full file:mr-4 file:text-label-sm file:uppercase file:tracking-widest"
            />
            {validationErrors.images && <p className="text-error text-sm mt-1">{validationErrors.images}</p>}
          </div>

          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
              {selectedFiles.map((file, i) => (
                <div key={i} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${i + 1}`}
                    className="w-full aspect-square object-cover rounded-sm"
                  />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-primary text-on-primary text-label-sm px-2 py-0.5 rounded-full uppercase tracking-widest text-[10px]">
                      Primary
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-error/90 text-on-error rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

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

        {/* SUBMISSION */}
        <div className="flex gap-4">
          <GoldButton type="submit" disabled={loading} onClick={() => setStatus("available")}>
            {loading ? "Creating..." : "Publish"}
          </GoldButton>
          <OutlineButton type="submit" disabled={loading} onClick={() => setStatus("draft")}>
            {loading ? "Creating..." : "Save as Draft"}
          </OutlineButton>
        </div>
      </form>
    </div>
  );
}
