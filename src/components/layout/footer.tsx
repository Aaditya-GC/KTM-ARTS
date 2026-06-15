export function Footer() {
  return (
    <footer className="bg-surface-dim border-t border-outline py-16 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto space-y-10 text-center">
        <div>
          <h3 className="font-headline-lg text-primary tracking-[0.2em] uppercase font-bold text-headline-md">
            Kathmandu Arts
          </h3>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {["Archive", "Master Artists", "Private Commissions", "Cultural Preservation", "Privacy Policy"].map((item) => (
            <span
              key={item}
              className="text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-accent transition-colors cursor-pointer"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex justify-center space-x-8">
          <span className="material-symbols-outlined text-on-surface-variant hover:text-accent transition-colors cursor-pointer">public</span>
          <span className="material-symbols-outlined text-on-surface-variant hover:text-accent transition-colors cursor-pointer">share</span>
          <span className="material-symbols-outlined text-on-surface-variant hover:text-accent transition-colors cursor-pointer">mail</span>
        </div>

        <p className="text-label-sm text-on-surface-variant/60">
          &copy; {new Date().getFullYear()} Kathmandu Arts. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
