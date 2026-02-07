import { NAV_ROUTES } from "@/lib/routes";
import { Link } from "@heroui/react";

export default function PublicFooter() {
  return (
    <footer className="bg-accent-soft-hover text-accent py-4 space-y-4">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME}.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}
