"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <p className="text-xs" style={{ color: "#8C6A4E" }}>
          Home / About Us
        </p>
      </div>

      {/* Section 1 — Hero */}
      <section className="relative h-[50vh] overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ backgroundColor: "rgba(28,16,8,0.5)" }}
        >
          <p
            className="text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: "#D4B896" }}
          >
            ABOUT US
          </p>
          <h1 className="text-3xl md:text-4xl font-medium text-center px-6" style={{ color: "#F5F0E8" }}>
            Rooted in the Himalayas.
          </h1>
        </div>
      </section>

      {/* Section 2 — Our Story */}
      <FadeUp>
        <section className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#8C6A4E" }}>
                OUR STORY
              </p>
              <h2 className="text-2xl font-medium mb-6" style={{ color: "#1C1008" }}>
                Art as a Sacred Practice
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#1C1008" }}>
                Kathmandu Arts was born from a deep respect for the living tradition of Thangka painting — one of the world&apos;s most intricate and spiritually significant art forms.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#1C1008" }}>
                We work directly with master artists in the Kathmandu Valley, ensuring every piece is authentic, fairly sourced, and carries the intention it was painted with.
              </p>
            </div>
            <div
              className="aspect-square border"
              style={{ backgroundColor: "#EDE5D8", borderColor: "#DDD0BC" }}
            >
              <Image
                src="https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Thangka painting detail"
                width={800}
                height={800}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </FadeUp>

      {/* Section 3 — Three Pillars */}
      <section style={{ backgroundColor: "#EDE5D8" }}>
        <FadeUp>
          <div className="py-20 px-6">
            <p className="text-xs tracking-widest uppercase text-center mb-16" style={{ color: "#8C6A4E" }}>
              What We Stand For
            </p>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  num: "01",
                  title: "Authentic Sourcing",
                  body: "Every artwork is sourced directly from verified artists in Nepal. No middlemen, no reproductions.",
                },
                {
                  num: "02",
                  title: "Living Tradition",
                  body: "Thangka painting is a centuries-old discipline. We support artists who have trained for decades under master painters.",
                },
                {
                  num: "03",
                  title: "Conscious Collection",
                  body: "We believe art collecting should be intentional. Each piece is documented, authenticated, and cared for.",
                },
              ].map((pillar, i) => (
                <motion.div
                  key={pillar.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                >
                  <p className="text-5xl font-light mb-4" style={{ color: "#DDD0BC" }}>
                    {pillar.num}
                  </p>
                  <p className="text-base font-medium mb-3" style={{ color: "#1C1008" }}>
                    {pillar.title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#8C6A4E" }}>
                    {pillar.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>
      </section>

      {/* Section 4 — The Artists */}
      <FadeUp>
        <section className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="aspect-[4/5] overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Artist at work in Kathmandu"
                  width={800}
                  height={1000}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#8C6A4E" }}>
                THE ARTISTS
              </p>
              <h2 className="text-2xl font-medium mb-6" style={{ color: "#1C1008" }}>
                Masters of Their Craft
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "#1C1008" }}>
                Our network of artists spans three generations of Thangka painters based in Thamel and Patan, Kathmandu. Each artist is verified, credited, and fairly compensated for their work.
              </p>
              <div className="flex gap-12 mt-8">
                {[
                  { num: "12+", label: "Verified Artists" },
                  { num: "200+", label: "Artworks Listed" },
                  { num: "15+", label: "Years of Combined Experience" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-medium" style={{ color: "#7A5C00" }}>
                      {stat.num}
                    </p>
                    <p className="text-xs uppercase tracking-wide mt-1" style={{ color: "#8C6A4E" }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </FadeUp>

      {/* Section 5 — CTA Banner */}
      <section style={{ backgroundColor: "#1C1008" }}>
        <FadeUp>
          <div className="py-20 px-6 text-center">
            <h2 className="text-2xl font-medium mb-4" style={{ color: "#F5F0E8" }}>
              Begin Your Collection.
            </h2>
            <p className="text-sm mb-8" style={{ color: "#8C6A4E" }}>
              Browse original Thangka paintings by verified Himalayan artists.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/marketplace"
                className="px-8 py-3 text-xs uppercase tracking-widest transition-colors duration-200"
                style={{
                  backgroundColor: "#F5F0E8",
                  color: "#1C1008",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Browse Collection
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 text-xs uppercase tracking-widest border transition-colors duration-200"
                style={{
                  borderColor: "#F5F0E8",
                  color: "#F5F0E8",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
