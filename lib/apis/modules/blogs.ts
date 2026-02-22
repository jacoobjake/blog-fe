import type { Blog, GraphqlResponseWithPaginatorInfo, User } from "@/lib/types";

import { createGraphqlClient } from "./graphql";
import type { ApiFetcher } from "../core/types";
import { createApiClient } from "../core/client";

const ADMIN_BLOG_PATH = "api/admin/blog";

type BlogListQueryVariables = {
  first: number;
  page: number;
  tags?: string[];
  title?: string;
  author?: string;
};

/**
 * Blog module factory.
 *
 * Callers can pass either a browser fetcher or a server fetcher.
 */
export function createBlogApi(fetcher: ApiFetcher) {
  const http = createApiClient(fetcher);
  const gql = createGraphqlClient(fetcher);

  const blogListQuery = `
    query Blogs($first: Int!, $page: Int!, $tags: [String!], $title: String, $author: String) {
        blogs(first: $first, page: $page, hasTags: $tags, title: $title, author: $author) {
            data {
                slug
                title
                author
                is_published
                created_at
                updated_at
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

  const blogDetailsQuery = `
    query Blog($slug: String!) {
      blog(slug: $slug) {
        slug
        title
        author
        json_content
        is_published
        tags {
          name
        }
        created_at
        updated_at
      }
    }
  `;

  return {
    // createBlog: async () => {},
    // updateBlog: async () => {},
    // deleteBlog: async () => {},
    listBlogs: async (
      variables: BlogListQueryVariables = { first: 10, page: 1 },
    ) => {
      const response = await gql.request<{
        blogs: GraphqlResponseWithPaginatorInfo<Blog>;
      }>(blogListQuery, variables);
      return response.blogs;
    },
    getBlog: async (slug: string) => {
      const response = await gql.request<{ blog: Blog }>(blogDetailsQuery, {
        slug,
      });
      return response.blog;
    },
  };
}
