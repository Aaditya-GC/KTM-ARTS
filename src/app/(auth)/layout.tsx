export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-margin-mobile">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="font-headline-lg text-primary tracking-widest uppercase text-headline-md">
            Kathmandu Arts
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}
