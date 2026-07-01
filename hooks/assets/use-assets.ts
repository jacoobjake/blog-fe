"use client";

import { assetApi } from "@/lib/apis/browser";
import type { AssetType } from "@/lib/types";
import type { UploadAssetDto } from "@/lib/schemas";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

type AssetListVariables = {
  first: number;
  page: number;
  type?: AssetType;
};

export const assetQueryKeys = {
  all: ["assets"] as const,
  list: (variables: AssetListVariables) =>
    [...assetQueryKeys.all, "list", variables] as const,
  detail: (uuid: string) => [...assetQueryKeys.all, "detail", uuid] as const,
};

export function useListAssets(
  variables: AssetListVariables = { first: 20, page: 1 },
) {
  return useQuery({
    queryKey: assetQueryKeys.list(variables),
    queryFn: () => assetApi.listAssets(variables),
    placeholderData: keepPreviousData,
  });
}

export function useUploadAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UploadAssetDto) => assetApi.uploadAsset(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assetQueryKeys.all });
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => assetApi.deleteAsset(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assetQueryKeys.all });
    },
  });
}
