import { Clock } from "lucide-react";
import { GuideShell, Section, Callout } from "../_layout-shell";

export default function SilencioGuidePage() {
  return (
    <GuideShell
      title="Silencio administrativo explained"
      subtitle="The 20-business-day rule — what it is, how it works, and how to use it."
      icon={Clock}
      iconBg="bg-olive-light/15"
      iconColor="text-olive"
    >
      <Section title="What is silencio administrativo positivo?">
        <p>
          Under Spanish administrative law, when a public body doesn&apos;t
          respond to your application within a legally fixed deadline, the
          silence itself counts as a decision. For Law 14/2013 highly-qualified
          renewals (HQP), that decision is <strong>positive</strong>: your
          application is considered approved.
        </p>
        <p>
          The specific deadline for HQP renewals is <strong>20 business days</strong>{" "}
          (días hábiles) from the date of submission, counted from the day
          <em> after </em>
          you filed. Weekends, national holidays, and regional holidays don&apos;t
          count.
        </p>
      </Section>

      <Section title="How the clock actually runs">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Day 0 is the date on your <em>Acuse de Recibo</em> (the &quot;Fecha alta&quot;).</li>
          <li>Day 1 is the next business day after that.</li>
          <li>Weekends don&apos;t count.</li>
          <li>Spanish national holidays don&apos;t count.</li>
          <li>
            Regional holidays (Comunidad and local festivities) also don&apos;t count if
            the office of UGE-CE is in a region celebrating it — for HQP, that&apos;s
            Madrid.
          </li>
        </ul>
        <p>
          Our{" "}
          <a className="text-terracotta underline" href="/status">status tracker</a>{" "}
          does the counting for you and shows the exact date on which the silencio clock expires.
        </p>
      </Section>

      <Section title="What stops the clock">
        <p>
          Two events can pause or restart the 20-day clock:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li>
            <strong>Requerimiento:</strong> if UGE-CE asks for additional documents, the clock
            pauses until you respond.
          </li>
          <li>
            <strong>Pendiente de informes:</strong> when the file is waiting on a report from
            another body (e.g., antecedentes penales), the clock can pause while that report is
            pending.
          </li>
        </ol>
        <Callout tone="warn" title="Watch your notifications">
          <p>
            If a requerimiento has been issued and you miss the 10-business-day response deadline,
            your application can be archived. Check the portal notifications inbox regularly.
          </p>
        </Callout>
      </Section>

      <Section title="Confirming silencio applies">
        <p>
          Once the 20-day threshold has passed with no requerimiento and no resolution, you
          can safely treat the file as approved by silence. In practice, this means:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li>Check the Law 14/2013 portal and <em>infoext2</em> for any notifications.</li>
          <li>
            If both are clean, you can request an{" "}
            <em>acreditación / certificación de silencio positivo</em> from UGE-CE — a written
            document confirming your file was approved by silence.
          </li>
          <li>
            With the certification (or the later formal resolution), book a cita previa at your
            local <em>Comisaría de Policía Nacional</em> for fingerprints and TIE collection.
          </li>
        </ol>
      </Section>

      <Section title="How to request the certification">
        <p>There are four ways, ranked by practicality:</p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li>
            <strong>Email UGE-CE</strong> at{" "}
            <a className="text-terracotta underline" href="mailto:movilidad.internacional@inclusion.gob.es">
              movilidad.internacional@inclusion.gob.es
            </a>{" "}
            — the lowest friction option.
          </li>
          <li>
            <strong>Via Sede Electrónica</strong> using a digital certificate or Cl@ve — see our{" "}
            <a className="text-terracotta underline" href="/guide/authentication">authentication guide</a>.
          </li>
          <li>
            <strong>At any Registro Público</strong> using the 060 network — works without a
            certificate but requires an appointment.
          </li>
          <li>
            <strong>In person at UGE-CE</strong>, Calle de José Abascal 39, Madrid — only if you&apos;re
            nearby and the other channels have failed.
          </li>
        </ol>
      </Section>

      <Callout tone="info" title="Not legal advice">
        <p>
          This guide is informational. If your file is blocked, a requerimiento was issued,
          or the silencio window passed but the portal still shows &quot;en trámite,&quot; consider
          consulting an immigration lawyer.
        </p>
      </Callout>
    </GuideShell>
  );
}
