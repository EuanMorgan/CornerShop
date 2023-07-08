"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();
  const routes: {
    href: string;
    label: string;
    active?: boolean;
  }[] = [
    {
      href: `/${params.storeId}`,
      label: "Overview"
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards"
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories"
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Sizes"
    },
    {
      href: `/${params.storeId}/colors`,
      label: "Colors"
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings"
    }
  ];
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map(route => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active || pathname === route.href
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
