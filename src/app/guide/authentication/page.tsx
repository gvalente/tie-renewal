import { KeyRound } from "lucide-react";
import { GuideShell, Section, Callout } from "../_layout-shell";

export default function AuthenticationGuidePage() {
  return (
    <GuideShell
      title="Authentication setup"
      subtitle="Getting the digital identity you need to file your renewal online."
      icon={KeyRound}
      iconBg="bg-amber-soft/50"
      iconColor="text-amber-700"
    >
      <Section title="Why you need it">
        <p>
          The Law 14/2013 portal and the Sede Electrónica require one of two digital
          identities: <strong>Cl@ve</strong> or an <strong>FNMT digital certificate</strong>.
          Without one, you can&apos;t submit the online form, pay the tax, or check the
          status of your file.
        </p>
        <p>
          For TIE renewal, a digital certificate is usually the better option — it also
          enables Autofirma (used to sign the submission PDF).
        </p>
      </Section>

      <Section title="Option A — FNMT digital certificate (recommended)">
        <p>
          The FNMT (Fábrica Nacional de Moneda y Timbre) issues software certificates
          that install into your browser / keychain. Here&apos;s the flow:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li>
            Go to{" "}
            <a
              className="text-terracotta underline"
              href="https://www.sede.fnmt.gob.es"
              target="_blank"
              rel="noopener noreferrer"
            >
              sede.fnmt.gob.es
            </a>{" "}
            and request a &quot;Certificado de Persona Física.&quot;
          </li>
          <li>
            The site gives you a request code. <strong>Don&apos;t change browsers or clear
            cookies</strong> after this step — the private key is stored in your browser.
          </li>
          <li>
            Book an in-person identity check at an acreditación office (most Agencia
            Tributaria branches work). Bring your passport and your current TIE.
          </li>
          <li>
            After the identity check, return to the FNMT site on the{" "}
            <em>same browser</em> and download the certificate. Export it to a{" "}
            <code>.p12</code>/<code>.pfx</code> file and back it up.
          </li>
          <li>
            Import the certificate into Safari / Chrome / Firefox to use it on web portals.
          </li>
        </ol>
        <Callout tone="warn" title="Backup the file">
          <p>
            Once downloaded, save the <code>.p12</code> somewhere safe (password manager,
            encrypted drive). If you lose it, you have to restart the whole process.
          </p>
        </Callout>
      </Section>

      <Section title="Option B — Cl@ve PIN / Cl@ve Permanente">
        <p>
          Cl@ve is a lighter-weight option that doesn&apos;t require browser certificate
          handling. It comes in two flavours:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Cl@ve PIN:</strong> one-off PIN sent via SMS or the Cl@ve app —
            good for occasional logins.
          </li>
          <li>
            <strong>Cl@ve Permanente:</strong> username + password with a second factor —
            better for ongoing use.
          </li>
        </ul>
        <p>
          Registration can be done online if you have an FNMT certificate already, or
          in person at a registration office. Many Oficinas de Información at the
          Agencia Tributaria, Seguridad Social, and SEPE work.
        </p>
        <p>
          Start at{" "}
          <a
            className="text-terracotta underline"
            href="https://clave.gob.es"
            target="_blank"
            rel="noopener noreferrer"
          >
            clave.gob.es
          </a>
          .
        </p>
      </Section>

      <Section title="Autofirma — the signing tool">
        <p>
          For TIE renewal submissions you&apos;ll also need <strong>Autofirma</strong> — the
          official signing desktop app. It uses your installed certificate to sign the
          submission form with a legal digital signature.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            Download:{" "}
            <a
              className="text-terracotta underline"
              href="https://firmaelectronica.gob.es/Home/Descargas.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              firmaelectronica.gob.es/Home/Descargas
            </a>
          </li>
          <li>Available for macOS, Windows, and Linux.</li>
          <li>
            On macOS, allow it in System Settings → Privacy & Security after the first
            launch is blocked by Gatekeeper.
          </li>
        </ul>
      </Section>

      <Section title="Quick troubleshooting">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Browser doesn&apos;t see the certificate:</strong> re-import the{" "}
            <code>.p12</code> into the browser&apos;s certificate store and restart it.
          </li>
          <li>
            <strong>Autofirma &quot;no se puede iniciar&quot;:</strong> reinstall, and on
            macOS right-click the app → Open to bypass Gatekeeper the first time.
          </li>
          <li>
            <strong>Portal says &quot;certificado no válido&quot;:</strong> the certificate
            may have expired (they&apos;re valid 2–4 years). Renew before it lapses.
          </li>
        </ul>
      </Section>

      <Callout tone="info">
        <p>
          Once authentication is sorted, you&apos;re ready to submit — head back to the{" "}
          <a className="text-terracotta underline" href="/renew">renewal guide</a>.
        </p>
      </Callout>
    </GuideShell>
  );
}
