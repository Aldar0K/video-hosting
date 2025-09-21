"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AppLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  exact?: boolean;
};

const AppLink = ({ href, children, className = "", exact = false }: AppLinkProps) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  const base = "rounded-md px-3 py-2 text-sm font-medium transition-colors";
  const active = "bg-primary text-primary-foreground hover:opacity-90";
  const inactive = "text-foreground/80 hover:bg-muted";

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`${base} ${isActive ? active : inactive} ${className}`}
    >
      {children}
    </Link>
  );
};

export default AppLink;


