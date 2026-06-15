import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { artworks, artists, profiles, certificates, creationSteps } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { BadgeVerified } from "@/components/shared/badge-verified";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { AddToWishlistButton } from "@/components/cart/add-to-wishlist-button";
import { getWishlistIds } from "@/lib/wishlist-actions";
import Link from "next/link";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await db
    .select({ slug: artworks.slug })
    .from(artworks)
    .where(eq(artworks.status, "available"));

  return slugs.map(({ slug }) => ({ slug }));
}

interface ArtworkDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArtworkDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [artwork] = await db
    .select()
    .from(artworks)
    .innerJoin(artists, eq(artworks.artistId, artists.id))
    .innerJoin(profiles, eq(artists.id, profiles.id))
    .where(eq(artworks.slug, slug))
    .limit(1);

  if (!artwork) return { title: "Artwork Not Found" };

  return {
    title: `${artwork.artworks.title} — Kathmandu Arts`,
    description: artwork.artworks.description.slice(0, 160),
    openGraph: {
      title: artwork.artworks.title,
      description: artwork.artworks.description.slice(0, 160),
      images: artwork.artworks.images[0] ? [{ url: artwork.artworks.images[0] }] : [],
    },
  };
}

export default async function ArtworkDetailPage({ params }: ArtworkDetailPageProps) {
  const { slug } = await params;

  const result = await db
    .select()
    .from(artworks)
    .innerJoin(artists, eq(artworks.artistId, artists.id))
    .innerJoin(profiles, eq(artists.id, profiles.id))
    .leftJoin(certificates, eq(artworks.certificateId, certificates.id))
    .where(eq(artworks.slug, slug))
    .limit(1);

  if (result.length === 0) notFound();

  const { artworks: artwork, artists: artist, profiles: profile, certificates: certificate } = result[0];

  const steps = await db
    .select()
    .from(creationSteps)
    .where(eq(creationSteps.artworkId, artwork.id))
    .orderBy(creationSteps.stepNumber);

  const wishlistIds = new Set(await getWishlistIds());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: artwork.title,
    description: artwork.description,
    image: artwork.images,
    offers: {
      "@type": "Offer",
      price: artwork.priceUsd ?? Math.round(artwork.priceNpr / 134),
      priceCurrency: artwork.priceUsd ? "USD" : "NPR",
      availability: artwork.status === "available"
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
    },
    creator: {
      "@type": "Person",
      name: profile.fullName,
    },
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid lg:grid-cols-2 gap-16">
        <div>
          <div className="aspect-[4/5] bg-surface-container-low overflow-hidden rounded-sm relative">
            {artwork.images[0] ? (
              <Image
                src={artwork.images[0]}
                alt={artwork.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-8xl text-on-surface-variant/20">image</span>
              </div>
            )}
          </div>
          {artwork.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {artwork.images.map((img, i) => (
                <div key={i} className="w-20 h-20 shrink-0 bg-surface-container-low rounded-sm overflow-hidden relative">
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-label-sm uppercase text-primary tracking-widest">
                {artwork.status === "available" ? "Available" : artwork.status}
              </span>
              {artwork.isVerified && <BadgeVerified />}
            </div>
            <h1 className="text-headline-lg text-on-background">{artwork.title}</h1>
            <Link
              href={`/artists/${artist.slug}`}
              className="text-body-lg text-on-surface-variant italic hover:text-accent transition-colors inline-block mt-2"
            >
              {profile.fullName}
            </Link>
          </div>

          <p className="text-2xl font-medium text-primary">
            NPR {artwork.priceNpr.toLocaleString("en-US")}
          </p>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <AddToCartButton
                artwork={{
                  id: artwork.id,
                  slug: artwork.slug,
                  title: artwork.title,
                  images: artwork.images,
                  priceNpr: artwork.priceNpr,
                  artistName: profile.fullName,
                }}
              />
            </div>
            <AddToWishlistButton artworkId={artwork.id} initialInWishlist={wishlistIds.has(artwork.id)} />
          </div>

          <div className="border-t border-outline-variant/20 pt-8 space-y-4">
            <p className="text-body-lg text-on-surface-variant leading-relaxed">
              {artwork.description}
            </p>
          </div>

          {!!(artwork.dimensionsCm && typeof artwork.dimensionsCm === "object" && !Array.isArray(artwork.dimensionsCm)) && (
            <div className="border-t border-outline-variant/20 pt-8">
              <h3 className="text-label-sm uppercase tracking-widest text-primary mb-3">Dimensions</h3>
              <p className="text-body-md text-on-surface-variant">
                {(artwork.dimensionsCm as Record<string, number>).height ?? "—"} × {(artwork.dimensionsCm as Record<string, number>).width ?? "—"} cm
              </p>
            </div>
          )}

          {artwork.materials && artwork.materials.length > 0 && (
            <div className="border-t border-outline-variant/20 pt-8">
              <h3 className="text-label-sm uppercase tracking-widest text-primary mb-3">Materials</h3>
              <div className="flex flex-wrap gap-2">
                {artwork.materials.map((material) => (
                  <span
                    key={material}
                    className="px-3 py-1 border border-outline-variant text-label-sm uppercase tracking-widest text-on-surface-variant rounded-sm"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>
          )}

          {certificate && (
            <div className="border-t border-outline-variant/20 pt-8">
              <h3 className="text-label-sm uppercase tracking-widest text-primary mb-3">Certificate</h3>
              <p className="text-body-md text-on-surface-variant">
                Certificate No: {certificate.certificateNo}
              </p>
              <p className="text-body-md text-on-surface-variant">
                Issued: {certificate.issuedDate}
              </p>
            </div>
          )}

          {steps.length > 0 && (
            <div className="border-t border-outline-variant/20 pt-8">
              <h3 className="text-label-sm uppercase tracking-widest text-primary mb-6">Creation Journey</h3>
              <div className="space-y-6">
                {steps.map((step) => (
                  <div key={step.id} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center shrink-0 bg-background text-headline-md text-on-surface-variant">
                      {step.stepNumber}
                    </div>
                    <div>
                      <h4 className="text-body-md text-on-surface font-semibold">{step.title}</h4>
                      {step.description && (
                        <p className="text-body-md text-on-surface-variant mt-1">{step.description}</p>
                      )}
                      {step.durationDays && (
                        <p className="text-label-sm text-primary mt-1">{step.durationDays} days</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
