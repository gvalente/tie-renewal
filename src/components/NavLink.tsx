"use client";

import { usePathname } from "next/navigation";

type Props = {
  href: string;
  label: string;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
};

export function NavLink({ href, label, className = "", activeClassName = "", inactiveClassName = "" }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <a
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`${className} ${isActive ? activeClassName : inactiveClassName}`}
    >
      {label}
    </a>
  );
}
