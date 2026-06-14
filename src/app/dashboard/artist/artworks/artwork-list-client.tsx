"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoldButton } from "@/components/shared/gold-button";
import { OutlineButton } from "@/components/shared/outline-button";
import type { Artwork } from "@/lib/db/schema";

type Tab = "all" | "available" | "draft";

interface Props {
  artworks: Artwork[];
}

export function ArtworkListClient({ artworks }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const counts = {
    all: artworks.length,
    available: artworks.filter((a) => a.status === "available").length,
    draft: artworks.filter((a) => a.status === "draft").length,
  };

  const filtered = activeTab === "all" ? artworks : artworks.filter((a) => a.status === activeTab);

  async function handlePublish(artworkId: string) {
    const { publishArtwork } = await import("@/lib/artwork-actions");
    await publishArtwork(artworkId);
    router.refresh();
  }

  async function handleDelete(artworkId: string) {
    const { deleteArtwork } = await import("@/lib/artwork-actions");
    await deleteArtwork(artworkId);
    setConfirmDelete(null);
    router.refresh();
  }

  function formatDate(date: Date | string) {
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function formatNpr(price: number) {
    return `NPR ${price.toLocaleString("en-IN")}`;
  }

  if (artworks.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-headline-md text-on-surface">My Artworks</h1>
        </div>
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">brush</span>
          <p className="text-body-lg text-on-surface-variant mt-4">You haven&apos;t created any artworks yet</p>
          <Link href="/dashboard/artist/artworks/new">
            <GoldButton className="mt-6">Create Your First Artwork</GoldButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-headline-md text-on-surface">My Artworks</h1>
        <Link href="/dashboard/artist/artworks/new">
          <GoldButton>Add New Artwork</GoldButton>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 border-b border-outline-variant">
        {(["all", "available", "draft"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-label-sm uppercase tracking-widest transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "text-primary border-primary"
                : "text-on-surface-variant border-transparent hover:text-on-surface"
            }`}
          >
            {tab === "all" ? "All" : tab === "available" ? "Published" : "Drafts"} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Artwork list */}
      <div className="space-y-3">
        {filtered.map((artwork) => (
          <div
            key={artwork.id}
            className="flex items-center gap-4 p-4 bg-surface-container-low border border-outline-variant rounded-sm"
          >
            {/* Thumbnail */}
            <div className="w-20 h-20 shrink-0 bg-surface-container-higher rounded-sm overflow-hidden">
              {artwork.images && artwork.images[0] ? (
                <img src={artwork.images[0]} alt={artwork.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30">
                  <span className="material-symbols-outlined text-2xl">image</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-headline-md text-on-surface truncate">{artwork.title}</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-label-sm uppercase tracking-widest px-2 py-0.5 rounded-full ${
                  artwork.status === "available"
                    ? "bg-primary/20 text-primary"
                    : "bg-surface-container-highest text-on-surface-variant"
                }`}>
                  {artwork.status === "available" ? "Published" : "Draft"}
                </span>
                <span className="text-label-sm text-on-surface-variant">{formatNpr(artwork.priceNpr)}</span>
                <span className="text-label-sm text-on-surface-variant/60">{formatDate(artwork.createdAt)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/dashboard/artist/artworks/${artwork.id}/edit`}
                className="px-4 py-2 border border-outline-variant text-label-sm uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-primary rounded-sm transition-colors"
              >
                Edit
              </Link>

              {artwork.status === "draft" && (
                <button
                  onClick={() => handlePublish(artwork.id)}
                  className="px-4 py-2 border border-primary/40 text-primary text-label-sm uppercase tracking-widest hover:bg-primary/10 rounded-sm transition-colors"
                >
                  Publish
                </button>
              )}

              {confirmDelete === artwork.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(artwork.id)}
                    className="px-3 py-2 bg-error text-on-error text-label-sm uppercase tracking-widest rounded-sm"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="px-3 py-2 border border-outline-variant text-label-sm uppercase tracking-widest text-on-surface-variant rounded-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(artwork.id)}
                  className="px-4 py-2 border border-error/40 text-error text-label-sm uppercase tracking-widest hover:bg-error/10 rounded-sm transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
