import type { Metadata } from "next";
import { SectionHeader } from "@/components/shared/section-header";
import { db } from "@/lib/db";
import { artists } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { CommissionForm } from "@/components/commission/commission-form";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Commissions — Kathmandu Arts",
  description: "Commission a custom Thangka masterpiece. Work directly with master artists to create a sacred artwork tailored to your vision.",
  openGraph: {
    title: "Commissions — Kathmandu Arts",
    description: "Commission a custom Thangka masterpiece with our master artists.",
  },
};

export default async function CommissionsPage() {
  const commissionArtists = await db
    .select()
    .from(artists)
    .where(eq(artists.isVerified, true))
    .limit(4);

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <SectionHeader
        eyebrow="Private Commissions"
        title="Commission a Masterpiece"
        description="Work directly with our master artists to create a custom Thangka tailored to your spiritual or aesthetic vision."
        align="center"
      />

      <div className="grid md:grid-cols-2 gap-16 mt-16 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-primary" />
            <span className="text-label-sm uppercase tracking-widest text-primary font-bold">How It Works</span>
          </div>
          <h2 className="text-headline-lg text-on-background">
            From Vision to <span className="text-primary text-glow-gold">Consecration</span>
          </h2>
          <p className="text-body-lg text-on-surface-variant leading-relaxed">
            Every commission begins with a conversation. Share your intention — whether it is a specific deity,
            a meditation focus, or a gift — and we match you with the artist whose lineage and style resonates.
          </p>
          <div className="space-y-6 pt-4">
            {[
              { num: "01", label: "Consultation", desc: "Share your vision, preferred deity, size, and timeline" },
              { num: "02", label: "Artist Match", desc: "We pair you with a master whose tradition aligns with your request" },
              { num: "03", label: "Sketch Approval", desc: "Review and refine the sacred geometry before painting begins" },
              { num: "04", label: "Creation & Consecration", desc: "The piece is painted, blessed, and shipped to you" },
            ].map((step) => (
              <div key={step.num} className="flex gap-4">
                <span className="text-headline-md text-primary font-bold shrink-0 w-12">{step.num}</span>
                <div>
                  <p className="text-body-md text-on-surface font-semibold">{step.label}</p>
                  <p className="text-body-md text-on-surface-variant">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="aspect-[4/5] bg-surface-container-low rounded-sm overflow-hidden">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest">
            <span className="material-symbols-outlined text-8xl text-primary/20">edit_note</span>
          </div>
        </div>
      </div>

      {/* Available Artists */}
      <div className="mt-section-gap">
        <SectionHeader
          title="Artists Accepting Commissions"
          align="center"
        />
        {commissionArtists.length > 0 ? (
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {commissionArtists.map((artist) => (
              <div key={artist.id} className="text-center group">
                <div className="aspect-[3/4] bg-surface-container-low rounded-sm overflow-hidden mb-4">
                  <div className="w-full h-full bg-surface-container-higher flex items-center justify-center">
                    <span className="text-label-sm text-on-surface-variant/30">Artist Image</span>
                  </div>
                </div>
                <h3 className="text-headline-md text-on-surface">{artist.slug.replace(/-/g, " ")}</h3>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 border border-outline-variant/20 bg-surface-container-low p-8 rounded-sm text-center max-w-xl mx-auto">
            <span className="material-symbols-outlined text-4xl text-primary mb-4 block">edit_note</span>
            <p className="text-body-md text-on-surface-variant mb-4">
              No artists are currently accepting commissions.
              <br />
              New commission slots open every month.
            </p>
          </div>
        )}
      </div>

      <section className="border border-primary/20 bg-surface-container-high p-8 md:p-12 rounded-sm mt-section-gap max-w-3xl mx-auto">
        <h2 className="text-headline-md text-on-background mb-4 text-center">Ready to Begin?</h2>
        <p className="text-body-lg text-on-surface-variant mb-8 max-w-xl mx-auto text-center">
          Share your vision below and our curation team will respond within 48 hours
          with artist recommendations and a preliminary timeline.
        </p>
        <CommissionForm />
      </section>
    </div>
  );
}
