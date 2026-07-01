import { createGraphqlClient } from "./graphql";
import type { ApiFetcher } from "../core/types";
import { createHttpMethods } from "../core/http";
import type {
  Asset,
  AssetType,
  GraphqlResponseWithPaginatorInfo,
} from "@/lib/types";
import type { UploadAssetDto } from "@/lib/schemas";

const ASSET_PATH = "api/assets";

type AssetListQueryVariables = {
  first: number;
  page: number;
  type?: AssetType;
};

/**
 * Asset module factory.
 *
 * Callers can pass either a browser fetcher or a server fetcher.
 */
export function createAssetApi(fetcher: ApiFetcher) {
  const gql = createGraphqlClient(fetcher);
  const { post, del } = createHttpMethods(fetcher);

  const assetListQuery = `
    query Assets($first: Int!, $page: Int!, $type: AssetType) {
      assets(first: $first, page: $page, type: $type) {
        data {
          uuid
          type
          media {
            file_name
            mime_type
            url
            thumbnail_100
            thumbnail_200
          }
        }
        paginatorInfo {
          count
          currentPage
          firstItem
          hasMorePages
          lastItem
          lastPage
          perPage
          total
        }
      }
    }
  `;

  const assetByUuidQuery = `
    query Asset($uuid: String!) {
      asset(uuid: $uuid) {
        uuid
        type
        media {
          file_name
          mime_type
          url
          thumbnail_100
          thumbnail_200
        }
      }
    }
  `;

  return {
    uploadAsset: async (dto: UploadAssetDto) => {
      const formData = new FormData();
      formData.append("file", dto.file);
      formData.append("type", dto.type);
      const response = await post<{ data: { uuid: string } }>(
        ASSET_PATH,
        formData,
      );
      const assetResponse = await gql.request<{ asset: Asset }>(
        assetByUuidQuery,
        { uuid: response.data.uuid },
      );
      return assetResponse.asset;
    },
    deleteAsset: async (uuid: string) => {
      return del(`${ASSET_PATH}/${uuid}`);
    },
    getAsset: async (uuid: string) => {
      const response = await gql.request<{ asset: Asset }>(assetByUuidQuery, {
        uuid,
      });
      return response.asset;
    },
    listAssets: async (
      variables: AssetListQueryVariables = { first: 10, page: 1 },
    ) => {
      const response = await gql.request<{
        assets: GraphqlResponseWithPaginatorInfo<Asset>;
      }>(assetListQuery, variables);
      return response.assets;
    },
  };
}
