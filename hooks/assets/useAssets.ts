"use client";

import { assetApi } from "@/lib/apis";
import { AssetType } from "@/lib/types";
import type { UploadAssetDto } from "@/lib/schemas";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const ASSETS_QUERY_KEY = ["assets"] as const;

type UseAssetsOptions = {
  first?: number;
  page?: number;
  type?: AssetType;
};

export function useAssets(options: UseAssetsOptions = {}) {
  const { first = 20, page = 1, type = AssetType.Image } = options;

  return useQuery({
    queryKey: [...ASSETS_QUERY_KEY, { first, page, type }],
    queryFn: () => assetApi.listAssets({ first, page, type }),
    placeholderData: keepPreviousData,
  });
}

export function useUploadAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UploadAssetDto) => assetApi.uploadAsset(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSETS_QUERY_KEY });
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => assetApi.deleteAsset(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSETS_QUERY_KEY });
    },
  });
}
