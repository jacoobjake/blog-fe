export function parseObjectPosition(position?: string) {
  const [xStr = "50%", yStr = "50%"] = (position ?? "50% 50%").split(" ");
  return {
    x: parseFloat(xStr) / 100,
    y: parseFloat(yStr) / 100,
  };
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;

export function clampImageScale(scale: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

export type CoverLayout = {
  width: number;
  height: number;
  left: number;
  top: number;
};

/**
 * Compute absolute image placement for object-fit:cover-style framing where the
 * focal point stays anchored to the same spot in the container as width changes.
 */
export function computeCoverLayout(
  containerWidth: number,
  containerHeight: number,
  naturalWidth: number,
  naturalHeight: number,
  scale: number,
  focalX: number,
  focalY: number,
): CoverLayout {
  if (
    containerWidth <= 0 ||
    containerHeight <= 0 ||
    naturalWidth <= 0 ||
    naturalHeight <= 0
  ) {
    return { width: 0, height: 0, left: 0, top: 0 };
  }

  const imageAspect = naturalWidth / naturalHeight;
  const containerAspect = containerWidth / containerHeight;

  let baseWidth: number;
  let baseHeight: number;

  if (imageAspect > containerAspect) {
    baseHeight = containerHeight;
    baseWidth = baseHeight * imageAspect;
  } else {
    baseWidth = containerWidth;
    baseHeight = baseWidth / imageAspect;
  }

  const width = baseWidth * scale;
  const height = baseHeight * scale;
  const left = containerWidth * focalX - width * focalX;
  const top = containerHeight * focalY - height * focalY;

  return { width, height, left, top };
}

export function loadImageDimensions(
  src: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };
    image.onerror = () => reject(new Error("Failed to load image dimensions"));
    image.src = src;
  });
}
