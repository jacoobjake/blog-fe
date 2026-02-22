import type { LoginDto } from "@/lib/schemas";
import type { User } from "@/lib/types";

import { createGraphqlClient } from "./graphql";
import type { ApiFetcher } from "../core/types";
import { createApiClient } from "../core/client";

const AUTH_PATH = "api/admin/auth";

/**
 * Auth module factory.
 *
 * Callers can pass either a browser fetcher or a server fetcher.
 */
export function createAuthApi(fetcher: ApiFetcher) {
  const http = createApiClient(fetcher);
  const gql = createGraphqlClient(fetcher);

  const meQuery = () => `
    query {
      me {
        id
        email
        name
      }
    }
  `;

  return {
    meQuery,

    login: async (dto: LoginDto): Promise<boolean> => {
      await http.post(`${AUTH_PATH}/session`, dto);
      return true;
    },

    logout: async (): Promise<void> => {
      await http.post(`${AUTH_PATH}/invalidate`);
    },

    me: async (): Promise<User> => {
      const data = await gql.request<{ me: User }>(meQuery());
      return data.me;
    },
  };
}
