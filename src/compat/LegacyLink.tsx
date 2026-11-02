import type { AnchorHTMLAttributes, ReactNode } from "react";

type LegacyLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: ReactNode;
  prefetch?: boolean;
};

export default function LegacyLink({
  href,
  children,
  prefetch,
  ...props
}: LegacyLinkProps) {
  void prefetch;
  const localizedHref =
    typeof document !== "undefined" &&
    document.documentElement.lang === "en" &&
    href.startsWith("/") &&
    !href.startsWith("//") &&
    !/^\/en(?:\/|$)/.test(href)
      ? `/en${href === "/" ? "/" : href}`
      : href;

  return (
    <a href={localizedHref} {...props}>
      {children}
    </a>
  );
}
