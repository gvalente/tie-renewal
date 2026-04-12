import { CheckCircle2 } from "lucide-react";
import { GuideShell, Section, Callout } from "../_layout-shell";

export default function AfterApprovalGuidePage() {
  return (
    <GuideShell
      title="After your renewal is approved"
      subtitle="What happens between a favorable resolution and your new TIE card in hand."
      icon={CheckCircle2}
      iconBg="bg-terracotta/8"
      iconColor="text-terracotta"
    >
      <Section title="The approval isn't the card">
        <p>
          A favorable resolution — whether by express decision or by <em>silencio administrativo
          positivo</em> — means your residency has been extended. But the physical TIE card
          in your pocket hasn&apos;t been updated yet. There are two more steps.
        </p>
      </Section>

      <Section title="Step 1 — Book the fingerprint appointment">
        <p>
          Once the resolution lands, book a <em>cita previa</em> at your local{" "}
          <em>Comisaría de Policía Nacional</em> for the &quot;Toma de huellas / Expedición de
          TIE&quot; service.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            Appointments are booked at{" "}
            <a
              className="text-terracotta underline"
              href="https://icp.administracionelectronica.gob.es"
              target="_blank"
              rel="noopener noreferrer"
            >
              sede.administracionespublicas.gob.es
            </a>
            .
          </li>
          <li>
            Availability is province-specific and tight — keep checking; slots open at
            unpredictable times.
          </li>
          <li>
            If there are zero slots, try neighbouring comisarías — you&apos;re not
            legally obligated to use the one closest to your address.
          </li>
        </ul>
        <Callout tone="warn" title="Don't panic if slots are scarce">
          <p>
            Your legal status is already extended by the favorable resolution. The card is
            administrative — you&apos;re not out of status while you wait for the appointment.
          </p>
        </Callout>
      </Section>

      <Section title="Step 2 — Attend the appointment">
        <p>Bring the following:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Your passport (original).</li>
          <li>Your current (expired or about-to-expire) TIE card.</li>
          <li>The resolution or silencio certificate (printed).</li>
          <li>
            <strong>Tasa 790 modelo 012</strong> payment receipt — this is a
            <em> different </em> tax from the renewal fee. You pay it after the
            resolution, specifically for card issuance. It&apos;s around €16.
          </li>
          <li>One recent passport-style photo (some comisarías ask, some don&apos;t).</li>
          <li>
            <em>Volante de empadronamiento</em> — optional at most comisarías,
            mandatory at some. Bring it if you have it.
          </li>
        </ul>
        <p>
          They&apos;ll take your fingerprints and give you a receipt. The card itself is
          printed centrally and typically ready in 30–45 days.
        </p>
      </Section>

      <Section title="Step 3 — Collect the card">
        <p>
          Collection is the same location as fingerprinting. Some comisarías require
          another <em>cita previa</em>, others let you walk in during collection hours.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Bring the fingerprinting receipt and your passport.</li>
          <li>Cards are only released to the holder — not a representative.</li>
        </ul>
      </Section>

      <Section title="In the meantime — travel and work">
        <Callout tone="good" title="You are legally resident">
          <p>
            The favorable resolution is your legal proof of residence until the card arrives.
            Your right to work is uninterrupted.
          </p>
        </Callout>
        <p>
          For international travel during this window, carry:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Your passport.</li>
          <li>The expired TIE card (do not cut it up).</li>
          <li>
            A printed copy of the resolution and, if possible, the fingerprinting receipt.
          </li>
        </ul>
        <p>
          Airline check-in staff are not immigration officers and may not recognize
          the paperwork — the safest bet is to travel light on borders until the new card
          is in hand. If you must travel, schedule extra time at the gate.
        </p>
      </Section>
    </GuideShell>
  );
}
