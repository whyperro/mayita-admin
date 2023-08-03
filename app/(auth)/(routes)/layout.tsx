import { LayoutProps } from "@/.next/types/app/layout";

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="flex items-center justify-center h-full">{children}</div>
  );
}
