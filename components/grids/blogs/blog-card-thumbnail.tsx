"use client";

import { useMemo, useState } from "react";
import { getBlogHeroThumbnailCandidates } from "@/lib/utils/media-url";

type BlogCardThumbnailProps = {
  media?: {
    url?: string;
    thumbnail_200?: string;
    thumbnail_100?: string;
  } | null;
  alt: string;
};

export function BlogCardThumbnail({ media, alt }: BlogCardThumbnailProps) {
  const candidates = useMemo(
    () => getBlogHeroThumbnailCandidates(media),
    [media],
  );
  const [candidateIndex, setCandidateIndex] = useState(0);
  const src = candidates[Math.min(candidateIndex, candidates.length - 1)];

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="h-full w-full object-cover"
      onError={() => {
        setCandidateIndex((current) =>
          current < candidates.length - 1 ? current + 1 : current,
        );
      }}
    />
  );
}
