"use client";

import { useState } from "react";
import { submitContact } from "@/lib/contact-actions";


export default function ContactPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await submitContact(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      form.reset();
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F0E8" }}>
      <style>{`
        .contact-input::placeholder { color: #B89B7A; }
      `}</style>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-xs text-[#8C6A4E] mb-10">
          Home / Contact Us
        </p>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Form */}
          <div className="md:col-span-3">
            <h1 className="text-2xl font-medium" style={{ color: "#1C1008" }}>
              Contact Us
            </h1>
            <p className="text-sm mt-1.5 mb-8" style={{ color: "#8C6A4E" }}>
              Our team is here to help. We&apos;ll get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="name"
                  placeholder="Name"
                  required
                  className="contact-input w-full px-4 py-3 text-sm border outline-none"
                  style={{
                    backgroundColor: "#EDE5D8",
                    borderColor: "#DDD0BC",
                    color: "#1C1008",
                    height: 48,
                    borderRadius: 0,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#7A5C00")}
                  onBlur={(e) => (e.target.style.borderColor = "#DDD0BC")}
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="contact-input w-full px-4 py-3 text-sm border outline-none"
                  style={{
                    backgroundColor: "#EDE5D8",
                    borderColor: "#DDD0BC",
                    color: "#1C1008",
                    height: 48,
                    borderRadius: 0,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#7A5C00")}
                  onBlur={(e) => (e.target.style.borderColor = "#DDD0BC")}
                />
              </div>

              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                className="contact-input w-full px-4 py-3 text-sm border outline-none"
                style={{
                  backgroundColor: "#EDE5D8",
                  borderColor: "#DDD0BC",
                  color: "#1C1008",
                  height: 48,
                  borderRadius: 0,
                }}
                onFocus={(e) => (e.target.style.borderColor = "#7A5C00")}
                onBlur={(e) => (e.target.style.borderColor = "#DDD0BC")}
              />

              <input
                name="subject"
                placeholder="Subject"
                required
                className="contact-input w-full px-4 py-3 text-sm border outline-none"
                style={{
                  backgroundColor: "#EDE5D8",
                  borderColor: "#DDD0BC",
                  color: "#1C1008",
                  height: 48,
                  borderRadius: 0,
                }}
                onFocus={(e) => (e.target.style.borderColor = "#7A5C00")}
                onBlur={(e) => (e.target.style.borderColor = "#DDD0BC")}
              />

              <textarea
                name="message"
                placeholder="Message"
                required
                className="contact-input w-full px-4 py-3 text-sm border outline-none resize-none"
                style={{
                  backgroundColor: "#EDE5D8",
                  borderColor: "#DDD0BC",
                  color: "#1C1008",
                  minHeight: 160,
                  borderRadius: 0,
                }}
                onFocus={(e) => (e.target.style.borderColor = "#7A5C00")}
                onBlur={(e) => (e.target.style.borderColor = "#DDD0BC")}
              />

              <button
                type="submit"
                className="w-full text-sm uppercase tracking-widest py-3 transition-colors duration-200"
                style={{
                  backgroundColor: "#1C1008",
                  color: "#F5F0E8",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7A5C00")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1C1008")}
              >
                Send Message
              </button>

              {success && (
                <p className="text-sm" style={{ color: "#7A5C00" }}>
                  Thank you — we&apos;ll be in touch soon.
                </p>
              )}
              {error && (
                <p className="text-sm" style={{ color: "#a0522d" }}>
                  {error}
                </p>
              )}
            </form>
          </div>

          {/* Info Panel */}
          <div className="md:col-span-2 md:sticky md:top-8 self-start" style={{ backgroundColor: "#EDE5D8", border: "1px solid #DDD0BC", padding: 32 }}>
            <p className="text-sm tracking-widest mb-6" style={{ color: "#7A5C00" }}>
              KATHMANDU ARTS
            </p>

            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#8C6A4E" }}>
              BUSINESS ADDRESS
            </p>
            <p className="text-sm" style={{ color: "#1C1008" }}>
              Boudha, Kathmandu Nepal
            </p>

            <div style={{ height: 1, backgroundColor: "#DDD0BC", margin: "24px 0" }} />

            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#8C6A4E" }}>
              CONTACT
            </p>
            <a
              href="tel:+977-XXXXXXXX"
              className="block text-sm transition-colors"
              style={{ color: "#1C1008" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#7A5C00")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#1C1008")}
            >
              +977-XXXXXXXXX
            </a>
            <a
              href="mailto:hello@kathmanduarts.com"
              className="block text-sm transition-colors mt-1"
              style={{ color: "#1C1008" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#7A5C00")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#1C1008")}
            >
              hello@kathmanduarts.com
            </a>

            <div style={{ height: 1, backgroundColor: "#DDD0BC", margin: "24px 0" }} />

            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#8C6A4E" }}>
              STAY CONNECTED
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{ color: "#1C1008" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#7A5C00")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#1C1008")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{ color: "#1C1008" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#7A5C00")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#1C1008")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{ color: "#1C1008" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#7A5C00")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#1C1008")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
