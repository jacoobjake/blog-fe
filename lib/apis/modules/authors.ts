import type { AuthorProfile, GraphqlResponseWithPaginatorInfo } from "@/lib/types";
import type {
  CreateAuthorProfileDto,
  UpdateAuthorProfileDto,
  UpdateOwnAuthorProfileDto,
} from "@/lib/schemas/author-profile";

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
  const { get, post, put, del } = createHttpMethods(fetcher);

  const authorProfilesQuery = `
    query AuthorProfiles($first: Int!, $page: Int!, $name: String) {
      authorProfiles(first: $first, page: $page, name: $name, orderBy: [{ column: NAME, order: ASC }]) {
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

  return {
    listAuthors: async () => {
      const response = await get<{ data: { authors: AuthorProfile[] } }>(
        AUTHORS_PATH,
      );
      return response.data.authors;
    },

    listAuthorProfiles: async (
      variables: { first?: number; page?: number; name?: string } = {},
    ) => {
      const response = await gql.request<{
        authorProfiles: GraphqlResponseWithPaginatorInfo<AuthorProfile>;
      }>(authorProfilesQuery, {
        first: variables.first ?? 50,
        page: variables.page ?? 1,
        name: variables.name,
      });

      return response.authorProfiles;
    },

    getAuthor: async (id: string) => {
      const response = await get<{ data: { author: AuthorProfile } }>(
        `${AUTHORS_PATH}/${id}`,
      );
      return response.data.author;
    },

    getMyAuthorProfile: async () => {
      const response = await get<{ data: { author: AuthorProfile } }>(
        `${AUTHORS_PATH}/me`,
      );
      return response.data.author;
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
