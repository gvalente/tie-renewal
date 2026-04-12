import { PORTAL, CONTACT } from "@/lib/constants";
import { CheckCircle, ExternalLink, PartyPopper } from "lucide-react";

export function SilencioGuide() {
  return (
    <div className="rounded-xl border-2 border-olive/30 bg-olive-light/10 overflow-hidden">
      {/* Header */}
      <div className="bg-olive/10 px-5 sm:px-6 py-4 border-b border-olive/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-olive/15 flex items-center justify-center">
            <PartyPopper className="h-5 w-5 text-olive" />
          </div>
          <div>
            <h3 className="font-semibold text-olive-dark flex items-center gap-2">
              Silencio Administrativo Positivo
            </h3>
            <p className="text-xs text-olive/80">
              Your renewal is likely auto-approved
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-6 py-5 space-y-5">
        <p className="text-sm leading-relaxed text-foreground/80">
          More than 20 business days have passed since your submission. Under
          Article 76.1 of Law 14/2013, if UGE-CE has not responded and no
          requerimiento (document request) has been issued, your renewal is
          legally approved through <strong>silencio administrativo positivo</strong>.
        </p>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-olive" />
            What to do now
          </h4>

          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-olive/10 text-olive text-xs font-bold shrink-0 mt-0.5">
                1
              </span>
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Confirm no requerimiento was issued</p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={PORTAL.NOTIFICATIONS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-terracotta hover:text-terracotta-dark underline underline-offset-2"
                  >
                    Portal notifications <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href={PORTAL.INFOEXT2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-terracotta hover:text-terracotta-dark underline underline-offset-2"
                  >
                    Check via infoext2 <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-olive/10 text-olive text-xs font-bold shrink-0 mt-0.5">
                2
              </span>
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Request a certificate of positive silence</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li className="flex items-start gap-1.5">
                    <span className="text-terracotta mt-0.5">&#8227;</span>
                    Email:{" "}
                    <a
                      href={`mailto:${CONTACT.UGE_EMAIL}`}
                      className="text-terracotta underline underline-offset-2"
                    >
                      {CONTACT.UGE_EMAIL}
                    </a>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-terracotta mt-0.5">&#8227;</span>
                    Via Sede Electrónica (with digital certificate)
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-terracotta mt-0.5">&#8227;</span>
                    Via any Registro Público
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-terracotta mt-0.5">&#8227;</span>
                    In person at UGE-CE, Calle de José Abascal 39, Madrid
                  </li>
                </ul>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-olive/10 text-olive text-xs font-bold shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="text-sm font-medium">Wait for formal resolution</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  UGE-CE typically issues the formal favorable resolution shortly
                  after the deadline, citing administrative silence.
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-olive/10 text-olive text-xs font-bold shrink-0 mt-0.5">
                4
              </span>
              <div>
                <p className="text-sm font-medium">Book your TIE card appointment</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Once you have the resolution, book a cita previa at your local
                  Comisaría de Policía Nacional for fingerprints and your new TIE card.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
