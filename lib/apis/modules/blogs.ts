import type { Blog, GraphqlResponseWithPaginatorInfo } from "@/lib/types";
import type { CreateBlogDto, UpdateBlogDto } from "@/lib/schemas";

import { createGraphqlClient } from "./graphql";
import type { ApiFetcher } from "../core/types";
import { createHttpMethods } from "../core/http";

const ADMIN_BLOG_PATH = "api/admin/blogs";

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
  const gql = createGraphqlClient(fetcher);
  const { post, put, del } = createHttpMethods(fetcher);

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

  const publicBlogListQuery = `
    query PublicBlogs($first: Int!, $page: Int!, $tags: [String!], $title: String, $author: String) {
      blogsPublic(first: $first, page: $page, hasTags: $tags, title: $title, author: $author) {
        data {
          slug
          title
          author
          tags {
            name
          }
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

  const publicBlogSlugListQuery = `
    query PublicBlogSlugs($first: Int!, $page: Int!, $tags: [String!], $title: String, $author: String) {
      blogsPublic(first: $first, page: $page, hasTags: $tags, title: $title, author: $author) {
        data {
          slug
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

  const publicBlogDetailsQuery = `
    query PublicBlog($slug: String!) {
      blogPublic(slug: $slug) {
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
    createBlog: async (data: CreateBlogDto) => {
      const response = await post<{ data: { slug: string } }>(
        ADMIN_BLOG_PATH,
        data,
      );
      return response.data;
    },
    updateBlog: async (slug: string, data: Partial<UpdateBlogDto>) => {
      const response = await put<{ data: { slug: string } }>(
        `${ADMIN_BLOG_PATH}/${slug}`,
        data,
      );
      return response.data;
    },
    deleteBlog: async (slug: string) => {
      const response = await del(`${ADMIN_BLOG_PATH}/${slug}`);
      return response;
    },
    listBlogs: async (
      variables: BlogListQueryVariables = { first: 10, page: 1 },
    ) => {
      const response = await gql.request<{
        blogs: GraphqlResponseWithPaginatorInfo<Blog>;
      }>(blogListQuery, variables);
      return response.blogs;
    },
    listPublicBlogs: async (
      variables: BlogListQueryVariables = { first: 10, page: 1 },
    ) => {
      const response = await gql.request<{
        blogsPublic: GraphqlResponseWithPaginatorInfo<Blog>;
      }>(publicBlogListQuery, variables);
      return response.blogsPublic;
    },
    listPublicBlogSlugs: async (
      variables: BlogListQueryVariables = { first: 10, page: 1 },
    ) => {
      const response = await gql.request<{
        blogsPublic: GraphqlResponseWithPaginatorInfo<Blog>;
      }>(publicBlogSlugListQuery, variables);
      return response.blogsPublic;
    },
    getBlog: async (slug: string) => {
      const response = await gql.request<{ blog: Blog }>(blogDetailsQuery, {
        slug,
      });

      const blog = response.blog;

      // Parse json_content if it's a string
      if (blog?.json_content && typeof blog.json_content === "string") {
        blog.json_content = JSON.parse(blog.json_content);
      }

      return blog;
    },
    getPublicBlog: async (slug: string) => {
      const response = await gql.request<{ blogPublic: Blog }>(publicBlogDetailsQuery, {
        slug,
      });

      const blog = response.blogPublic;

      // Parse json_content if it's a string
      if (blog?.json_content && typeof blog.json_content === "string") {
        blog.json_content = JSON.parse(blog.json_content);
      }

      return blog;
    },
  };
}
