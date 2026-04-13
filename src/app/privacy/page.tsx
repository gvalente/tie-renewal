import { Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — RenewMyTIE",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col">
      <div className="warm-gradient texture-overlay border-b border-border/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-sm font-medium">
            <Shield className="h-3.5 w-3.5" />
            Privacy
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground leading-relaxed">Last updated: April 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 w-full">
        <div className="prose prose-sm max-w-none space-y-6 text-sm text-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">What we collect</h2>
            <p className="text-muted-foreground">
              When you create an account, we collect your email address and optional name. When
              you use the app, we store TIE expiry dates and application tracking data
              (registro numbers, submission dates, status check logs) that you voluntarily enter.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">How we use it</h2>
            <p className="text-muted-foreground">
              Your data is used solely to provide the service: showing you your renewal timeline,
              tracking your application status, and sending you deadline reminders if you opt in.
              We do not sell your data, share it with third parties, or use it for advertising.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Data storage</h2>
            <p className="text-muted-foreground">
              Data is stored in Supabase (EU region). Authentication is handled by Supabase Auth.
              Passwords are hashed and never stored in plain text.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Your rights</h2>
            <p className="text-muted-foreground">
              You can delete your account and all associated data at any time from your dashboard.
              You can also delete individual TIE records and application entries using the delete
              buttons on each item.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Contact</h2>
            <p className="text-muted-foreground">
              Questions about privacy? This is a personal project — reach out via the
              GitHub repository linked in the footer.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
