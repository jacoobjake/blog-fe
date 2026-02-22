import { cn } from "@heroui/styles";
import {
  ReactNode,
  ReactElement,
  Children,
  isValidElement,
  cloneElement,
} from "react";

/**
 * PageContainer component for admin pages with support for slotted actions.
 *
 * @example
 * // Direct child slots
 * <PageContainer title="Blog Details">
 *   <BackButton href="/admin/blogs" data-slot="pre-action" />
 *   <BlogDetailsForm blog={blog} />
 * </PageContainer>
 *
 * @example
 * // Nested slots with container marker
 * <PageContainer title="Create Blog">
 *   <BlogForm data-slot-container>
 *     <BackButton data-slot="pre-action" />
 *     <Button data-slot="extra-actions" data-slot-priority={10}>Save Draft</Button>
 *     <Button data-slot="extra-actions" data-slot-priority={20}>Publish</Button>
 *   </BlogForm>
 * </PageContainer>
 *
 * @example
 * // Multiple sources with priorities
 * <PageContainer title="Edit Blog">
 *   <Toolbar data-slot-container>
 *     <Button data-slot="extra-actions" data-slot-priority={5}>Preview</Button>
 *   </Toolbar>
 *   <BlogForm data-slot-container>
 *     <Button data-slot="extra-actions" data-slot-priority={10}>Save</Button>
 *     <Button data-slot="extra-actions" data-slot-priority={15}>Publish</Button>
 *   </BlogForm>
 * </PageContainer>
 *
 * Slot Types:
 * - `data-slot="pre-action"`: Renders before the title (e.g., back buttons)
 * - `data-slot="extra-actions"`: Renders in the header's action area (e.g., save, delete buttons)
 *
 * Attributes:
 * - `data-slot`: The slot name ("pre-action" | "extra-actions")
 * - `data-slot-container`: Mark an element as containing slotted children (for performance)
 * - `data-slot-priority`: Number to control render order (lower = first, default = 0)
 */
interface PageContainerProps {
  title: string;
  children: ReactNode;
  contentClassName?: string;
}

interface SlottedElement {
  element: ReactNode;
  priority: number;
}

// Recursively extract and remove slotted elements from children
function extractSlots(children: ReactNode) {
  const slots: Record<string, SlottedElement[]> = {
    "pre-action": [],
    "extra-actions": [],
  };

  function processChild(child: ReactNode): ReactNode {
    if (!isValidElement(child)) {
      return child;
    }

    const element = child as ReactElement<any>;
    const slot = element.props?.["data-slot"];
    const isSlotContainer = element.props?.["data-slot-container"] === true;
    const priority =
      typeof element.props?.["data-slot-priority"] === "number"
        ? element.props["data-slot-priority"]
        : 0;

    // If this element has a slot, extract it
    if (slot && slots[slot] !== undefined) {
      slots[slot].push({ element, priority });
      return null; // Remove from original position
    }

    // Only recurse into children if this element is marked as a slot container
    if (element.props?.children && isSlotContainer) {
      const processedChildren = Children.map(
        element.props.children,
        processChild,
      );

      // Check if any children were extracted (would be null)
      const hasChanges = Children.toArray(processedChildren).some(
        (c, i) => c !== Children.toArray(element.props.children)[i],
      );

      // Only clone if children changed
      if (hasChanges) {
        return cloneElement(element, {}, processedChildren);
      }
    }

    return element;
  }

  // Process all direct children (root level is always processed)
  const processedChildren = Children.map(children, processChild);

  // Sort slots by priority (lower priority = rendered first)
  const sortedPreActions = slots["pre-action"]
    .sort((a, b) => a.priority - b.priority)
    .map((s) => s.element);

  const sortedExtraActions = slots["extra-actions"]
    .sort((a, b) => a.priority - b.priority)
    .map((s) => s.element);

  return {
    preAction: sortedPreActions.length > 0 ? sortedPreActions : null,
    extraActions: sortedExtraActions.length > 0 ? sortedExtraActions : null,
    content: processedChildren,
  };
}

export default function PageContainer({
  title,
  children,
  contentClassName,
}: PageContainerProps) {
  const { preAction, extraActions, content } = extractSlots(children);

  return (
    <div className="h-full flex flex-col w-full space-y-4 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {preAction}
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <div>{extraActions}</div>
      </div>
      <div className={cn("grow", contentClassName)}>{content}</div>
    </div>
  );
}
