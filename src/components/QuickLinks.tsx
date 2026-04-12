import { PORTAL, CONTACT } from "@/lib/constants";
import { Globe, Smartphone, Phone, ExternalLink } from "lucide-react";

const links = [
  {
    icon: Globe,
    title: "Law 14/2013 Portal",
    description: "Check status with digital certificate",
    href: PORTAL.STATUS,
    accent: "bg-terracotta/8 hover:bg-terracotta/12",
  },
  {
    icon: Globe,
    title: "infoext2 Portal",
    description: "No certificate needed",
    href: PORTAL.INFOEXT2,
    accent: "bg-olive/8 hover:bg-olive/12",
  },
  {
    icon: Smartphone,
    title: `SMS: ${CONTACT.SMS}`,
    description: '"NIE [number]" or "EXPE [registro]"',
    href: `sms:${CONTACT.SMS.replace(/\s/g, "")}`,
    accent: "bg-amber-warm/15 hover:bg-amber-warm/25",
  },
  {
    icon: Phone,
    title: `Phone: ${CONTACT.PHONE}`,
    description: "24h automated line or call 060",
    href: `tel:${CONTACT.PHONE.replace(/\s/g, "")}`,
    accent: "bg-amber-warm/15 hover:bg-amber-warm/25",
  },
];

export function QuickLinks() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-terracotta" />
        Check Your Status
      </h3>
      <div className="space-y-2">
        {links.map((link) => (
          <a
            key={link.title}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors group ${link.accent}`}
          >
            <link.icon className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{link.title}</p>
              <p className="text-xs text-muted-foreground">{link.description}</p>
            </div>
            <ExternalLink className="h-3 w-3 text-muted-foreground/50 group-hover:text-muted-foreground shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
