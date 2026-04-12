"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StepProgress } from "@/components/StepProgress";
import { DocumentChecklist } from "@/components/DocumentChecklist";
import { PORTAL, FEE, CONTACT } from "@/lib/constants";
import {
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Shield,
  CreditCard,
  FileText,
  Send,
  PartyPopper,
  ClipboardList,
  Info,
} from "lucide-react";

const steps = [
  { number: 0, title: "Eligibility" },
  { number: 1, title: "Auth Setup" },
  { number: 2, title: "Pay Fee" },
  { number: 3, title: "Documents" },
  { number: 4, title: "Submit" },
  { number: 5, title: "Done" },
];

export default function RenewPage() {
  const [currentStep, setCurrentStep] = useState(0);

  function next() {
    setCurrentStep(Math.min(currentStep + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function back() {
    setCurrentStep(Math.max(currentStep - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="warm-gradient texture-overlay border-b border-border/40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-olive/10 text-olive text-sm font-medium">
            <ClipboardList className="h-3.5 w-3.5" />
            Step-by-step guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Guided Renewal Walkthrough
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            HQP/PAC permit renewal under Law 14/2013 &mdash; verified against a real application
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6 w-full">
        <StepProgress steps={steps} currentStep={currentStep} />

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          {currentStep === 0 && <EligibilityStep />}
          {currentStep === 1 && <AuthStep />}
          {currentStep === 2 && <PaymentStep />}
          {currentStep === 3 && <DocumentsStep />}
          {currentStep === 4 && <SubmitStep />}
          {currentStep === 5 && <DoneStep />}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          {currentStep > 0 && currentStep < 5 ? (
            <Button variant="outline" onClick={back} className="border-border">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          ) : (
            <div />
          )}
          {currentStep < 5 && (
            <Button onClick={next} className="bg-terracotta hover:bg-terracotta-dark text-white">
              {currentStep === 0 ? "I'm eligible" : "Next step"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepHeader({
  icon: Icon,
  title,
  accent,
}: {
  icon: typeof Shield;
  title: string;
  accent: string;
}) {
  return (
    <div className={`px-5 sm:px-6 py-4 border-b border-border/50 ${accent}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center">
          <Icon className="h-4 w-4" />
        </div>
        <h2 className="font-semibold">{title}</h2>
      </div>
    </div>
  );
}

function EligibilityStep() {
  return (
    <>
      <StepHeader icon={Shield} title="Step 0: Eligibility Check" accent="bg-sand-dark/40" />
      <div className="p-5 sm:p-6 space-y-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          This guide is specifically for <strong className="text-foreground">HQP/PAC permit renewals</strong>{" "}
          under Law 14/2013. Confirm the following before proceeding:
        </p>

        <div className="space-y-2.5">
          {[
            {
              q: "Are you on an HQP/PAC permit (Profesional Altamente Cualificado)?",
              help: "Check your TIE card — it should reference Law 14/2013 or 'movilidad internacional'",
            },
            {
              q: "Are you still with the same employer?",
              help: "If you changed employers, you need a new application, not a renewal",
            },
            {
              q: "Are you still meeting the salary threshold?",
              help: "~€54K for executives, ~€40K for technical/scientific roles",
            },
          ].map((item) => (
            <div key={item.q} className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-background">
              <CheckCircle className="h-4 w-4 text-olive mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">{item.q}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.help}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-amber-warm/30 bg-amber-soft/30 p-4">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Not sure about your permit type?</p>
              <p className="text-xs mt-1 text-amber-700">
                Look at your TIE card for references to Law 14/2013, &quot;PAC&quot;,
                &quot;highly qualified&quot;, or &quot;movilidad internacional&quot;. If your initial
                application was processed through UGE (not a local office), you&apos;re
                likely on this permit type.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AuthStep() {
  return (
    <>
      <StepHeader icon={Shield} title="Step 1: Authentication Setup" accent="bg-sand-dark/40" />
      <div className="p-5 sm:p-6 space-y-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          You need an FNMT digital certificate and AutoFirma to access the
          portal and sign your application.
        </p>

        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-border bg-background space-y-2">
            <p className="text-sm font-semibold">FNMT Digital Certificate</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Free to obtain. Takes about 1-2 days (requires identity
              verification in person or via video call at €2.99+IVA).
            </p>
            <a
              href={PORTAL.FNMT}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-terracotta hover:text-terracotta-dark font-medium underline underline-offset-2"
            >
              Get certificate <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="p-4 rounded-xl border border-border bg-background space-y-2">
            <p className="text-sm font-semibold">AutoFirma</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Software for electronically signing documents. Download and
              install before submission day.
            </p>
            <a
              href={PORTAL.AUTOFIRMA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-terracotta hover:text-terracotta-dark font-medium underline underline-offset-2"
            >
              Download AutoFirma <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="rounded-xl border border-olive-light/30 bg-olive-light/10 p-4 text-sm">
          <p className="font-medium text-olive flex items-center gap-1.5">
            <Info className="h-4 w-4" /> Pro tip
          </p>
          <p className="text-xs mt-1 text-olive/80 leading-relaxed">
            Test your certificate on the portal BEFORE submission day. Use the
            same computer and browser for requesting, downloading, and using the certificate.
          </p>
        </div>
      </div>
    </>
  );
}

function PaymentStep() {
  return (
    <>
      <StepHeader icon={CreditCard} title="Step 2: Pay the Fee" accent="bg-amber-soft/40" />
      <div className="p-5 sm:p-6 space-y-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Pay the renewal fee <strong className="text-foreground">before</strong> starting the application.
          You&apos;ll need the payment reference number (NRC) during submission.
        </p>

        <div className="rounded-xl border-2 border-dashed border-terracotta/20 bg-terracotta/5 p-6 text-center space-y-3">
          <p className="text-4xl font-bold text-terracotta">&euro;{FEE.AMOUNT_EUR}</p>
          <p className="text-sm text-muted-foreground">{FEE.DESCRIPTION}</p>
          <a
            href={PORTAL.FEE_PAYMENT}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-terracotta hover:bg-terracotta-dark text-white">
              Pay Online <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </a>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">After payment:</h4>
          <ol className="space-y-2">
            <li className="flex items-start gap-3 text-sm">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-terracotta/10 text-terracotta text-xs font-bold shrink-0 mt-0.5">1</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Save the receipt PDF</strong> — you&apos;ll upload it as one of your 4 required documents
              </span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-terracotta/10 text-terracotta text-xs font-bold shrink-0 mt-0.5">2</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Note the NRC</strong> (Número de Referencia Completo) — you&apos;ll enter it in the application form
              </span>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}

function DocumentsStep() {
  return (
    <>
      <StepHeader icon={FileText} title="Step 3: Gather Documents" accent="bg-olive-light/15" />
      <div className="p-5 sm:p-6 space-y-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          You only need <strong className="text-foreground">4 documents</strong>. Much simpler than most
          guides suggest. All must be in PDF format, total under 24MB.
        </p>

        <DocumentChecklist />

        <div className="rounded-xl border border-border/50 bg-sand/60 p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">Not required (despite what you may read online):</p>
          <p className="text-xs text-muted-foreground/70">
            TIE card copy, company qualification proof, payslips, Vida Laboral,
            criminal record certificate (unless absent from Spain 6+ months).
          </p>
        </div>
      </div>
    </>
  );
}

function SubmitStep() {
  return (
    <>
      <StepHeader icon={Send} title="Step 4: Submit Application" accent="bg-terracotta/8" />
      <div className="p-5 sm:p-6 space-y-5">
        <a
          href={PORTAL.SUBMIT}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="w-full bg-terracotta hover:bg-terracotta-dark text-white h-11">
            Open Submission Portal <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </a>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-terracotta" />
            Form walkthrough
          </h4>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="text-xs text-muted-foreground font-mono w-4 shrink-0 mt-0.5">1.</span>
              <span>Authenticate with your digital certificate</span>
            </li>
            <li className="flex gap-3">
              <span className="text-xs text-muted-foreground font-mono w-4 shrink-0 mt-0.5">2.</span>
              <div>
                <span className="font-medium">Type of Application:</span>
                <div className="mt-1 ml-2 space-y-0.5 text-xs text-muted-foreground">
                  <p>Applicant: <strong className="text-foreground">HOLDER (Titular)</strong></p>
                  <p>Type: <strong className="text-foreground">RENEWAL (Renovación)</strong></p>
                  <p>Subtype: <strong className="text-foreground">HOLDER OF INT&apos;L MOBILITY RESIDENCE PERMIT</strong></p>
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-xs text-muted-foreground font-mono w-4 shrink-0 mt-0.5">3.</span>
              <div>
                <span className="font-medium">Authorization:</span>
                <div className="mt-1 ml-2 space-y-0.5 text-xs text-muted-foreground">
                  <p>Type: <strong className="text-foreground">HIGHLY QUALIFIED NATIONAL PROFESSIONAL</strong></p>
                  <p>Subtype: <strong className="text-foreground">GRADUATES/POSTGRADUATES/SPECIALISTS</strong></p>
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-xs text-muted-foreground font-mono w-4 shrink-0 mt-0.5">4.</span>
              <span>Fill in personal details (name, NIE, passport, address)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-xs text-muted-foreground font-mono w-4 shrink-0 mt-0.5">5.</span>
              <span>Enter the <strong>NRC</strong> from your fee payment</span>
            </li>
            <li className="flex gap-3">
              <span className="text-xs text-muted-foreground font-mono w-4 shrink-0 mt-0.5">6.</span>
              <span>Fill in company details (name, NIF/CIF)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-xs text-muted-foreground font-mono w-4 shrink-0 mt-0.5">7.</span>
              <span>Select <strong>&quot;I agree&quot;</strong> for electronic notifications (recommended)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-xs text-muted-foreground font-mono w-4 shrink-0 mt-0.5">8.</span>
              <span>Upload your 4 documents</span>
            </li>
            <li className="flex gap-3">
              <span className="text-xs text-muted-foreground font-mono w-4 shrink-0 mt-0.5">9.</span>
              <span>Review, submit, and sign with AutoFirma</span>
            </li>
          </ol>
        </div>

        <div className="rounded-xl border border-terracotta/25 bg-terracotta/8 p-4 text-sm">
          <p className="font-semibold text-terracotta-dark flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" />
            Critical: Save both PDFs
          </p>
          <p className="text-xs mt-1.5 text-terracotta-dark/80 leading-relaxed">
            After submission you&apos;ll receive an <strong>Acuse de Recibo</strong>{" "}
            (receipt) containing your <strong>Número de registro</strong>{" "}
            and an application details PDF. Download and save both immediately &mdash;
            they&apos;re your proof of submission.
          </p>
        </div>
      </div>
    </>
  );
}

function DoneStep() {
  return (
    <div className="bg-olive-light/10">
      <div className="px-5 sm:px-6 py-4 border-b border-olive/15 bg-olive/8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center">
            <PartyPopper className="h-4 w-4 text-olive" />
          </div>
          <div>
            <h2 className="font-semibold text-olive-dark">Step 5: Done! Now What?</h2>
            <p className="text-xs text-olive/70">Congratulations on submitting!</p>
          </div>
        </div>
      </div>
      <div className="p-5 sm:p-6 space-y-5">
        <div className="space-y-2 text-sm leading-relaxed">
          <ul className="space-y-2">
            <li className="flex items-start gap-2.5">
              <CheckCircle className="h-4 w-4 text-olive mt-0.5 shrink-0" />
              <span>Your current TIE remains valid while the application is being processed</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="h-4 w-4 text-olive mt-0.5 shrink-0" />
              <span>UGE-CE has <strong>20 business days</strong> to respond</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="h-4 w-4 text-olive mt-0.5 shrink-0" />
              <span>No response + no document request = <strong>auto-approved</strong> (silencio administrativo positivo)</span>
            </li>
          </ul>
        </div>

        <a href="/status" className="block">
          <Button className="w-full bg-olive hover:bg-olive/90 text-white h-11">
            Track My Application Status
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </a>

        <div className="rounded-xl bg-olive-light/15 p-4">
          <p className="text-xs font-medium text-olive mb-1.5">While you wait:</p>
          <ul className="space-y-1 text-xs text-olive/70">
            <li>&#8227; Check the portal periodically for status updates</li>
            <li>&#8227; Send an SMS with your NIE to {CONTACT.SMS} for a quick check</li>
            <li>&#8227; If you get a &quot;requerimiento&quot;, respond within 10 business days</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
