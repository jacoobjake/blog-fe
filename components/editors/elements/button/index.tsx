import { useNode } from "@craftjs/core";
import { buttonVariants, cn } from "@heroui/react";
import Link from "next/link";
import { ButtonElementSettings } from "./settings";
import type { ButtonElementProps } from "./types";

export type { ButtonElementProps } from "./types";

export const ButtonElement = ({
  label,
  href,
  target = "_self",
  onClick,
  size,
  variant,
  color,
  className,
}: ButtonElementProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  const classes = cn(
    buttonVariants({
      size,
      variant,
    }),
    "inline-flex items-center justify-center",
    className,
  );

  const style = { color };

  if (href) {
    const isExternal = href.startsWith("http://") || href.startsWith("https://");

    if (isExternal) {
      return (
        <a
          ref={(ref) => {
            if (ref) connect(drag(ref));
          }}
          href={href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className={classes}
          style={style}
        >
          {label}
        </a>
      );
    }

    return (
      <Link
        ref={(ref) => {
          if (ref) connect(drag(ref as unknown as HTMLElement));
        }}
        href={href}
        target={target}
        className={classes}
        style={style}
      >
        {label}
      </Link>
    );
  }

  return (
    <button
      ref={(ref) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      onClick={onClick}
      className={classes}
      style={style}
      type="button"
    >
      {label}
    </button>
  );
};

ButtonElement.craft = {
  displayName: "Button",
  props: {
    label: "Button",
    href: "",
    target: "_self",
    size: "md",
    variant: "primary",
  },
  related: {
    settings: ButtonElementSettings,
  },
};
