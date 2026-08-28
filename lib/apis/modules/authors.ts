import type { AuthorProfile, GraphqlResponseWithPaginatorInfo } from "@/lib/types";
import type {
  CreateAuthorProfileDto,
  UpdateAuthorProfileDto,
  UpdateOwnAuthorProfileDto,
} from "@/lib/schemas/author-profile";

import { createApiError } from "../core/errors";
import { createGraphqlClient } from "./graphql";
import type { ApiFetcher } from "../core/types";
import { createHttpMethods } from "../core/http";

const AUTHORS_PATH = "api/admin/authors";

const authorFields = `
  id
  name
  bio
  user {
    id
    name
    email
  }
`;

export function createAuthorApi(fetcher: ApiFetcher) {
  const gql = createGraphqlClient(fetcher);
  const { post, put, del } = createHttpMethods(fetcher);

  const authorProfilesQuery = `
    query AuthorProfiles($first: Int!, $page: Int!, $name: String, $orderBy: [QueryAuthorProfilesOrderByOrderByClause!]) {
      authorProfiles(first: $first, page: $page, name: $name, orderBy: $orderBy) {
        data {
          ${authorFields}
        }
        paginatorInfo {
          count
          currentPage
          hasMorePages
          lastPage
          perPage
          total
        }
      }
    }
  `;

  const authorProfileQuery = `
    query AuthorProfile($id: ID!) {
      authorProfile(id: $id) {
        ${authorFields}
      }
    }
  `;

  const myAuthorProfileQuery = `
    query MyAuthorProfile {
      me {
        author_profile {
          ${authorFields}
        }
      }
    }
  `;

  return {
    listAuthorProfiles: async (
      variables: {
        first?: number;
        page?: number;
        name?: string;
        orderBy?: { column: string; order: "ASC" | "DESC" }[];
      } = {},
    ) => {
      const response = await gql.request<{
        authorProfiles: GraphqlResponseWithPaginatorInfo<AuthorProfile>;
      }>(authorProfilesQuery, {
        first: variables.first ?? 50,
        page: variables.page ?? 1,
        name: variables.name,
        orderBy: variables.orderBy ?? [{ column: "NAME", order: "ASC" }],
      });

      return response.authorProfiles;
    },

    getAuthor: async (id: string) => {
      const response = await gql.request<{ authorProfile: AuthorProfile }>(
        authorProfileQuery,
        { id },
      );

      return response.authorProfile;
    },

    getMyAuthorProfile: async () => {
      const response = await gql.request<{
        me: { author_profile: AuthorProfile | null };
      }>(myAuthorProfileQuery);

      const profile = response.me.author_profile;

      if (!profile) {
        throw createApiError("Author profile not found.", 404);
      }

      return profile;
    },

    createAuthor: async (data: CreateAuthorProfileDto) => {
      const response = await post<{ data: { author: AuthorProfile } }>(
        AUTHORS_PATH,
        data,
      );
      return response.data.author;
    },

    updateAuthor: async (id: string, data: UpdateAuthorProfileDto) => {
      const response = await put<{ data: { author: AuthorProfile } }>(
        `${AUTHORS_PATH}/${id}`,
        data,
      );
      return response.data.author;
    },

    updateMyAuthorProfile: async (data: UpdateOwnAuthorProfileDto) => {
      const response = await put<{ data: { author: AuthorProfile } }>(
        `${AUTHORS_PATH}/me`,
        data,
      );
      return response.data.author;
    },

    deleteAuthor: async (id: string) => {
      await del(`${AUTHORS_PATH}/${id}`);
    },
  };
}
