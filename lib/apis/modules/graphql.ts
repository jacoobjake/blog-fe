import type { ApiFetcher, ApiFetchInit } from "../core/types";

export type GraphQLError = {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
};

export type GraphQLResponse<TData> = {
  data?: TData;
  errors?: GraphQLError[];
};

type GraphQLRequestBody<TVariables> = {
  query: string;
  variables?: TVariables;
  operationName?: string;
};

export type GraphQLRequestOptions = {
  /** Defaults to NEXT_PUBLIC_GRAPHQL_PATH or "/graphql" */
  path?: string;
  /** Pass-through fetch init overrides */
  fetchInit?: ApiFetchInit;
  /** Additional headers */
  headers?: HeadersInit;
};

export function createGraphqlClient(fetcher: ApiFetcher) {
  return {
    async request<TData, TVariables = Record<string, unknown>>(
      query: string,
      variables?: TVariables,
      options?: GraphQLRequestOptions,
    ): Promise<TData> {
      const path =
        options?.path ?? process.env.NEXT_PUBLIC_GRAPHQL_PATH ?? "/graphql";

      const body: GraphQLRequestBody<TVariables> = { query };
      if (variables !== undefined) {
        body.variables = variables;
      }

      const res = await fetcher<
        GraphQLResponse<TData>,
        GraphQLRequestBody<TVariables>
      >({
        path,
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
          ...(options?.headers ?? {}),
        },
        fetchInit: options?.fetchInit,
      });

      if (res.errors?.length) {
        const msg = res.errors.map((e) => e.message).join("\n");
        throw new Error(msg);
      }

      if (res.data === undefined) {
        throw new Error("GraphQL response missing `data`.");
      }

      return res.data;
    },
  };
}
