import { cn } from "@heroui/styles";
import type { ComponentProps, ReactNode } from "react";

type AdminPageSectionProps = ComponentProps<"div"> & {
  children: ReactNode;
};

/**
 * Opt-in slot container for AdminPage. Pass `data-slot-container` on this
 * element so AdminPage can hoist nested `data-slot` children into the header
 * without recursing through every descendant.
 *
 * @example
 * <AdminPageSection data-slot-container>
 *   <Button data-slot="extra-actions">Save</Button>
 *   <MyForm />
 * </AdminPageSection>
 */
export default function AdminPageSection({
  children,
  className,
  ...props
}: AdminPageSectionProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {children}
    </div>
  );
}
