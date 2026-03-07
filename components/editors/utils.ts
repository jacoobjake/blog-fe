export const SELECTED_CLASS_NAMES = "border border-accent";

export const HOVERED_CLASS_NAMES =
  "hover:outline hover:outline-dashed hover:outline-accent";

export const getHighlightedClassNames = (selected: boolean) =>
  selected ? SELECTED_CLASS_NAMES : HOVERED_CLASS_NAMES;
