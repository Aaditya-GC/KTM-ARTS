import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { artists, artworks, profiles, articles, testimonials } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { GoldButton } from "@/components/shared/gold-button";
import { SectionHeader } from "@/components/shared/section-header";
import { ArtistCard } from "@/components/artist/artist-card";
import { ArtCard } from "@/components/art/art-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredArtists = await db
    .select()
    .from(artists)
    .innerJoin(profiles, eq(artists.id, profiles.id))
    .where(eq(artists.isFeatured, true))
    .limit(4);

  const featuredArtworks = await db
    .select()
    .from(artworks)
    .innerJoin(artists, eq(artworks.artistId, artists.id))
    .innerJoin(profiles, eq(artists.id, profiles.id))
    .where(and(eq(artworks.status, "available"), eq(artworks.isVerified, true)))
    .limit(3);

  const articleList = await db
    .select()
    .from(articles)
    .where(eq(articles.isPublished, true))
    .limit(3);

  const testimonialList = await db.select().from(testimonials).limit(1);

  return (
    <div>
      {/* Section 1 — Hero */}
      <section className="relative w-full min-h-screen overflow-hidden -mt-[132px]">
        <Image
          src="https://images.pexels.com/photos/2408167/pexels-photo-2408167.jpeg?auto=compress&cs=tinysrgb&w=1920&q=85"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to bottom, rgba(10,6,2,0.45) 0%, rgba(10,6,2,0.65) 100%)" }} />
        <div className="relative z-20 flex flex-col items-center justify-end min-h-screen px-6 pb-12 md:pb-16 text-center">
          <div className="max-w-xl mx-auto">
          <p className="text-xs tracking-[0.25em] uppercase text-tertiary mb-5">
            KATHMANDU VALLEY · EST. 2024
          </p>
          <h1 className="text-3xl md:text-4xl font-normal text-on-primary leading-[1.1] tracking-[-0.5px]" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>
            Sacred Art,<br />
            Thoughtfully Collected.
          </h1>
          <p className="text-sm text-tertiary mt-4 max-w-[360px]">
            Original Thangka paintings by verified Himalayan artists.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8">
            <Link
              href="/marketplace"
              className="bg-background text-on-background text-[11px] tracking-[2px] uppercase px-7 py-3.5 min-h-[44px] flex items-center justify-center hover:bg-on-background hover:text-background transition-colors duration-200"
            >
              Browse Collection
            </Link>
            <Link
              href="/knowledge-hub"
              className="bg-transparent border border-background text-on-primary text-[11px] tracking-[2px] uppercase px-7 py-3.5 min-h-[44px] flex items-center justify-center hover:bg-background/10 transition-colors duration-200"
            >
              Our Heritage
            </Link>
          </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-tertiary animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Section 2 — Platform Overview Cards */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
        <div className="grid md:grid-cols-3 gap-gutter">
          {[
            {
              icon: "auto_awesome",
              title: "Collect Art",
              desc: "Acquire authenticated Thangka masterpieces with full provenance. Each piece carries a Certificate of Heritage.",
              href: "/marketplace",
            },
            {
              icon: "person_pin",
              title: "Meet the Masters",
              desc: "Discover artists from generations-old painting traditions. Every brushstroke carries lineage and devotion.",
              href: "/artists",
              offset: true,
            },
            {
              icon: "edit_note",
              title: "Commission",
              desc: "Work directly with master artists to create a custom Thangka tailored to your spiritual vision.",
              href: "/commissions",
            },
          ].map((card, i) => (
            <Link
              key={card.title}
              href={card.href}
              className={`group bg-surface-container-low border border-outline-variant/10 hover:border-primary/40 transition-all duration-500 h-[500px] flex flex-col justify-end p-8 relative overflow-hidden ${card.offset ? "md:-mt-12" : ""}`}
            >
              <span className="material-symbols-outlined absolute top-8 right-8 text-8xl text-on-surface-variant/5 group-hover:scale-110 transition-transform duration-700">
                {card.icon}
              </span>
              <div className="relative z-10">
                <h3 className="text-headline-md text-on-surface mb-3">{card.title}</h3>
                <p className="text-body-md text-on-surface-variant mb-6">{card.desc}</p>
                <span className="inline-flex items-center gap-2 text-label-sm uppercase tracking-widest text-primary group-hover:translate-x-2 transition-transform">
                  Learn More
                  <span className="material-symbols-outlined text-sm">trending_flat</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 3 — Featured Artists */}
      {featuredArtists.length > 0 && (
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
          <SectionHeader
            eyebrow="The Living Lineage"
            title="Featured Masters"
            description="Artists whose brushes are guided by meditation and sacred geometry"
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {featuredArtists.map(({ artists: artist, profiles: profile }) => (
              <ArtistCard
                key={artist.slug}
                artist={{
                  slug: artist.slug,
                  fullName: profile.fullName,
                  specialization: artist.specialization ?? undefined,
                  imageUrl: artist.studioImages?.[0] ?? undefined,
                  experienceYears: artist.experienceYears ?? undefined,
                }}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/artists"
              className="inline-block border-b border-primary text-label-sm uppercase tracking-widest text-primary pb-1 hover:opacity-80 transition-opacity"
            >
              View All Artists
            </Link>
          </div>
        </section>
      )}

      {/* Section 4 — Featured Thangkas */}
      {featuredArtworks.length > 0 && (
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
          <SectionHeader
            title="Curated Collections"
            align="center"
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-x-gutter gap-y-20">
            {featuredArtworks.map(({ artworks: artwork, artists: artist, profiles: profile }) => (
              <ArtCard
                key={artwork.slug}
                artwork={{
                  slug: artwork.slug,
                  title: artwork.title,
                  images: artwork.images ?? [],
                  priceNpr: artwork.priceNpr,
                  priceUsd: artwork.priceUsd,
                  status: artwork.status,
                  isVerified: artwork.isVerified ?? false,
                  artist: { name: profile.fullName, slug: artist.slug },
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Section 5 — Creation Journey */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
        <SectionHeader
          eyebrow="The Process"
          title="Birth of a Masterpiece"
          description="Each Thangka is a journey of devotion spanning weeks or months"
          align="center"
        />
        <div className="mt-16 relative">
          <div className="hidden md:block absolute left-0 right-0 h-px bg-primary/30 top-8" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            {[
              { num: 1, title: "Sketch", desc: "Sacred geometry is drafted with precision following ancient iconometric canons" },
              { num: 2, title: "Base Color", desc: "Mineral pigments are ground and applied in luminous layers" },
              { num: 3, title: "Detail Work", desc: "Fine brushwork brings deities and symbols to life over weeks" },
              { num: 4, title: "Gold Leaf", desc: "24K gold is hand-applied to halos, ornaments, and sacred elements" },
              { num: 5, title: "Finalization", desc: "The piece is consecrated, blessed, and prepared for its guardian" },
            ].map((step) => (
              <div key={step.num} className="text-center group">
                <div className="w-16 h-16 mx-auto rounded-full border border-primary/30 bg-background flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
                  <span className="text-headline-md">{step.num}</span>
                </div>
                <h4 className="text-headline-md text-on-surface mt-6">{step.title}</h4>
                <p className="text-body-md text-on-surface-variant mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="aspect-[21/9] bg-surface-container-low mt-16 rounded-sm overflow-hidden">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest">
            <span className="text-label-sm uppercase tracking-widest text-on-surface-variant/30">Editorial Image</span>
          </div>
        </div>
      </section>

      {/* Section 6 — Custom Commission */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] bg-surface-container-low rounded-sm overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest">
              <span className="material-symbols-outlined text-8xl text-primary/20">brush</span>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-primary" />
              <span className="text-label-sm uppercase tracking-widest text-primary font-bold">Custom Commission</span>
            </div>
            <h2 className="text-headline-lg text-on-background">
              Your Personal <span className="text-primary text-glow-gold">Sacred Path</span>
            </h2>
            <p className="text-body-lg text-on-surface-variant leading-relaxed">
              Commission a one-of-a-kind Thangka created specifically for your meditation space,
              altar, or collection. Our master artists work with you from concept to consecration.
            </p>
            <div className="space-y-4 pt-4">
              {[
                { icon: "edit_note", label: "Concept Consultation", desc: "Define the deity, composition, and spiritual intention" },
                { icon: "history_edu", label: "Lineage Mapping", desc: "Connect with the specific artistic tradition that resonates with you" },
              ].map((feat) => (
                <div key={feat.label} className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary mt-1">{feat.icon}</span>
                  <div>
                    <p className="text-body-md text-on-surface font-semibold">{feat.label}</p>
                    <p className="text-body-md text-on-surface-variant">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/commissions">
              <GoldButton>Request Private Consultation</GoldButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 7 — Authenticity Verification */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
        <div className="bg-surface-container-high border border-primary/20 p-8 md:p-16 rounded-sm">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="aspect-[3/4] max-w-sm mx-auto w-full bg-surface-container-lowest rounded-sm p-8 relative overflow-hidden">
              <div className="w-32 h-32 rounded-full border-2 border-primary/20 absolute top-8 right-8" />
              <div className="h-full flex flex-col justify-end space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-sm flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                </div>
                <p className="text-label-sm uppercase tracking-widest text-primary font-bold">Certificate of Heritage</p>
                <p className="text-body-md text-on-surface-variant font-mono">KA-2025-001</p>
                <div className="w-20 h-20 bg-surface-container border border-outline-variant/30 rounded-sm flex items-center justify-center">
                  <span className="text-label-sm text-on-surface-variant/50">QR</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-headline-lg text-on-background">
                Peace of Mind for <span className="text-primary text-glow-gold">Collectors</span>
              </h2>
              <p className="text-body-lg text-on-surface-variant leading-relaxed">
                Every artwork in our archive is accompanied by a Certificate of Heritage,
                ensuring authenticity, provenance, and material transparency.
              </p>
              <div className="space-y-4">
                {[
                  { icon: "verified_user", label: "Digital Passport", desc: "Blockchain-secured provenance tracking" },
                  { icon: "auto_awesome", label: "Material Audit", desc: "Verified gold content, mineral pigments, and canvas type" },
                ].map((feat) => (
                  <div key={feat.label} className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary mt-1">{feat.icon}</span>
                    <div>
                      <p className="text-body-md text-on-surface font-semibold">{feat.label}</p>
                      <p className="text-body-md text-on-surface-variant">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8 — Knowledge Hub Preview */}
      {articleList.length > 0 && (
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
          <SectionHeader
            title="Cultural Knowledge Hub"
            align="center"
          />
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {articleList.map((article) => (
              <Link
                key={article.slug}
                href={`/knowledge-hub/${article.slug}`}
                className="group block"
              >
                <div className="aspect-[16/9] bg-surface-container-low rounded-sm overflow-hidden">
                  <div className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 bg-surface-container-higher flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl text-on-surface-variant/20">history_edu</span>
                  </div>
                </div>
                <h3 className="text-headline-md text-on-surface mt-4 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-body-md text-on-surface-variant mt-2 line-clamp-2">
                  {article.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Section 9 — Testimonial */}
      {testimonialList.length > 0 && testimonialList.map((t) => (
        <section key={t.id} className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
          <div className="relative max-w-4xl mx-auto text-center">
            <span className="absolute -top-20 left-1/2 -translate-x-1/2 text-[160px] text-primary/5 font-display-xl leading-none select-none">
              &ldquo;
            </span>
            <p className="text-headline-lg italic font-normal text-on-surface relative z-10">
              {t.quote}
            </p>
            <div className="mt-8">
              <p className="text-label-sm uppercase tracking-widest text-primary font-bold">{t.authorName}</p>
              {t.authorLocation && (
                <p className="text-label-sm uppercase tracking-widest text-on-surface-variant mt-1">{t.authorLocation}</p>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* Section 10 — Live Sessions (placeholder) */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
        <SectionHeader
          eyebrow="Coming Soon"
          title="Live Masterclasses"
          description="Watch master artists at work in real-time from their studios in the Kathmandu Valley"
          align="center"
        />
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="h-[450px] bg-surface-container-low rounded-sm relative overflow-hidden group">
              <div className="w-full h-full bg-surface-container-higher flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">videocam</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4 bg-error/90 text-on-error px-3 py-1 rounded-full text-label-sm uppercase tracking-widest font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Coming Soon
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-headline-md text-on-background">Live Session Title</p>
                <p className="text-body-md text-on-surface-variant mt-1">Master Artist</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
