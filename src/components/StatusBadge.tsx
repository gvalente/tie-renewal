"use client";

import { Badge } from "@/components/ui/badge";
import { STATUSES, STATUS_LABELS, type StatusType } from "@/lib/constants";

const variants: Record<StatusType, string> = {
  [STATUSES.SUBMITTED]: "bg-sand-dark text-clay border-sand-dark",
  [STATUSES.EN_TRAMITE]: "bg-amber-soft text-amber-700 border-amber-warm/30",
  [STATUSES.PENDIENTE_INFORMES]: "bg-amber-warm/20 text-amber-800 border-amber-warm/30",
  [STATUSES.REQUERIDO]: "bg-terracotta/10 text-terracotta-dark border-terracotta/20",
  [STATUSES.RESUELTO_FAVORABLE]: "bg-olive-light/20 text-olive border-olive-light/30",
  [STATUSES.RESUELTO_NO_FAVORABLE]: "bg-red-100 text-red-800 border-red-200",
  [STATUSES.SILENCIO_POSITIVO]: "bg-olive-light/20 text-olive border-olive-light/30",
};

export function StatusBadge({ status }: { status: StatusType }) {
  return (
    <Badge variant="outline" className={`${variants[status]} font-medium`}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
