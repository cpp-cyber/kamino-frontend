import TopNav from "@/components/top-nav";
import Footer4Col from "@/components/footer";

interface PageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  headerClassName?: string;
  showGradientBackground?: boolean;
}

export function PageLayout({
  children,
  header,
  headerClassName,
  showGradientBackground = false,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="relative">
        {showGradientBackground && (
          <div
            className="absolute inset-0 z-0"
            style={{
              background: `
                radial-gradient(ellipse 100% 80% at 30% 10%, color-mix(in srgb, var(--color-kamino-green) 20%, transparent), transparent 50%),
                radial-gradient(ellipse 120% 70% at 70% 15%, color-mix(in srgb, var(--color-kamino-yellow) 30%, transparent), transparent 45%),
                radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34, 197, 94, 0.08), transparent 70%),
                var(--background)
              `,
            }}
          />
        )}

        <div
          className={`relative z-10 mx-auto max-w-7xl px-4 md:px-8 lg:px-16 xl:px-24`}
        >
          {header && (
            <>
              <div
                className={`px-4 py-6 rounded-b-xl text-shadow ${headerClassName || ""}`}
              >
                {header}
              </div>
            </>
          )}
          <div className="flex flex-1 flex-col">
            <div className="min-h-[75vh] flex-1 rounded-xl mx-auto w-full max-w-6xl py-4 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </div>
      <Footer4Col />
    </div>
  );
}
