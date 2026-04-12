import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RenewMyTIE — TIE Renewal, simplified",
  description:
    "The stress-free guide for highly qualified professionals renewing their TIE residence card in Spain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Top accent stripe — azulejo-inspired */}
        <div className="h-1 bg-gradient-to-r from-terracotta via-amber-warm to-terracotta" />

        <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5 group">
              {/* Logo mark */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-terracotta to-terracotta-dark flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Renew<span className="text-terracotta">My</span>TIE
              </span>
            </a>
            <nav className="hidden sm:flex items-center gap-1">
              {[
                { href: "/track", label: "Expiry Tracker" },
                { href: "/renew", label: "Renewal Guide" },
                { href: "/status", label: "Status Tracker" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            {/* Mobile nav toggle placeholder */}
            <nav className="sm:hidden flex items-center gap-3 text-sm">
              <a href="/track" className="text-muted-foreground hover:text-foreground">Track</a>
              <a href="/renew" className="text-muted-foreground hover:text-foreground">Renew</a>
              <a href="/status" className="text-muted-foreground hover:text-foreground">Status</a>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-auto">
          {/* Warm divider */}
          <div className="divider-warm" />
          <div className="bg-secondary/50 texture-overlay">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                {/* Brand */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-terracotta to-terracotta-dark flex items-center justify-center">
                      <span className="text-white font-bold text-xs">T</span>
                    </div>
                    <span className="text-sm font-semibold">RenewMyTIE</span>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Built by an expat who&apos;s been through it &mdash; so you
                    don&apos;t have to figure it out alone.
                  </p>
                </div>

                {/* Links */}
                <div className="flex gap-8 text-xs">
                  <div className="space-y-2">
                    <p className="font-medium text-foreground/70 uppercase tracking-wider text-[10px]">Navigate</p>
                    <div className="space-y-1.5">
                      <a href="/track" className="block text-muted-foreground hover:text-terracotta transition-colors">Expiry Tracker</a>
                      <a href="/renew" className="block text-muted-foreground hover:text-terracotta transition-colors">Renewal Guide</a>
                      <a href="/status" className="block text-muted-foreground hover:text-terracotta transition-colors">Status Tracker</a>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-foreground/70 uppercase tracking-wider text-[10px]">Resources</p>
                    <div className="space-y-1.5">
                      <a href="https://expinterweb.inclusion.gob.es/iley11/inicio/showTramites.action?procedimientoSel=200&proc=1" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-terracotta transition-colors">Law 14/2013 Portal</a>
                      <a href="https://sede.administracionespublicas.gob.es/infoext2/" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-terracotta transition-colors">infoext2</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 pt-4 border-t border-border/50">
                <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
                  This app provides informational guidance only, not legal advice.
                  We are not practicing immigration law. Always verify information
                  with official government sources. Datos verificados con una solicitud real presentada en 2026.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
