import type { ChangePasswordDto, ForgotPasswordDto, LoginDto, ResetPasswordDto } from "@/lib/schemas";
import type { User } from "@/lib/types";

import { createGraphqlClient } from "./graphql";
import type { ApiFetcher } from "../core/types";

const AUTH_PATH = "api/admin/auth";

/**
 * Auth module factory.
 *
 * Callers can pass either a browser fetcher or a server fetcher.
 */
export function createAuthApi(fetcher: ApiFetcher) {
  const gql = createGraphqlClient(fetcher);

  const meQuery = () => `
    query {
      me {
        id
        email
        name
        roles
      }
    }
  `;

  return {
    meQuery,

    login: async (dto: LoginDto): Promise<boolean> => {
      await fetcher({
        path: `${AUTH_PATH}/session`,
        method: "POST",
        body: dto,
      });
      return true;
    },

    logout: async (): Promise<void> => {
      await fetcher({ path: `${AUTH_PATH}/invalidate`, method: "POST" });
    },

    me: async (): Promise<User> => {
      const data = await gql.request<{ me: User }>(meQuery());
      return data.me;
    },

    updatePassword: async (dto: ChangePasswordDto): Promise<void> => {
      await fetcher({
        path: "api/admin/profile/password",
        method: "PUT",
        body: dto,
      });
    },

    forgotPassword: async (dto: ForgotPasswordDto): Promise<void> => {
      await fetcher({
        path: `${AUTH_PATH}/forgot-password`,
        method: "POST",
        body: dto,
      });
    },

    resetPassword: async (dto: ResetPasswordDto): Promise<void> => {
      await fetcher({
        path: `${AUTH_PATH}/reset-password`,
        method: "POST",
        body: dto,
      });
    },
  };
}
