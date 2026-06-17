import Link from "next/link";

import { ReactNode } from "react";

interface PolicySection {
  title: string;
  body: string | ReactNode;
}

interface PolicyLayoutProps {
  title: string;
  lastUpdated: string;
  sections: PolicySection[];
}

export function PolicyLayout({ title, lastUpdated, sections }: PolicyLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xs mb-10" style={{ color: "#8C6A4E" }}>
          Home / {title}
        </p>

        <h1 className="text-2xl font-medium mb-2" style={{ color: "#1C1008" }}>
          {title}
        </h1>
        <p className="text-xs mb-12" style={{ color: "#8C6A4E" }}>
          Last updated: {lastUpdated}
        </p>

        {sections.map((section, i) => (
          <div key={i}>
            {i > 0 && <div style={{ height: 1, backgroundColor: "#DDD0BC", margin: "32px 0" }} />}
            <section>
              <h2
                className="text-sm font-medium uppercase tracking-widest mt-10 mb-3"
                style={{ color: "#1C1008" }}
              >
                {section.title}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "#1C1008" }}>
                {section.body}
              </p>
            </section>
          </div>
        ))}
      </div>
    </div>
  );
}
