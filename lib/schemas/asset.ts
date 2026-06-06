import * as z from "zod";
import { AssetType } from "../types";

const ACCEPTED_IMAGE_MIME_TYPES = ["image/png", "image/jpeg"] as const;

export const UploadAssetSchema = z
  .object({
    file: z.instanceof(File),
    type: z.enum([AssetType.Image]),
  })
  .superRefine(({ type, file }, ctx) => {
    if (
      type === AssetType.Image &&
      !ACCEPTED_IMAGE_MIME_TYPES.includes(
        file.type as (typeof ACCEPTED_IMAGE_MIME_TYPES)[number],
      )
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["file"],
        message: `Only ${ACCEPTED_IMAGE_MIME_TYPES.join(" and ")} files are accepted for images`,
      });
    }
  });

export type UploadAssetDto = z.infer<typeof UploadAssetSchema>;
