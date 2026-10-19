import type { Blog, GraphqlResponseWithPaginatorInfo } from "@/lib/types";

export type AdminDashboardBlog = Pick<
  Blog,
  "slug" | "title" | "is_published" | "updated_at" | "author_profile"
>;

export type AdminDashboard = {
  total: number;
  published: number;
  drafts: number;
  recent: AdminDashboardBlog[];
};
import type { CreateBlogDto, UpdateBlogDto } from "@/lib/schemas";
import type {
  BlogListFilters,
  BlogOrderByClause,
} from "@/lib/utils/blog-filters";
import { orderByToGraphql } from "@/lib/utils/blog-filters";

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
  is_published?: boolean;
  orderBy?: BlogOrderByClause[];
};

/**
 * Blog module factory.
 *
 * Callers can pass either a browser fetcher or a server fetcher.
 */
const authorProfileFields = `
  author_profile {
    id
    name
    bio
  }
`;

const heroAssetFields = `
  hero_asset {
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
`;

export function createBlogApi(fetcher: ApiFetcher) {
  const gql = createGraphqlClient(fetcher);
  const { post, put, del } = createHttpMethods(fetcher);

  const blogListQuery = `
    query Blogs($first: Int!, $page: Int!, $tags: [String!], $title: String, $author: String, $isPublished: Boolean, $orderBy: [QueryBlogsOrderByOrderByClause!]) {
        blogs(first: $first, page: $page, hasTags: $tags, title: $title, author: $author, is_published: $isPublished, orderBy: $orderBy) {
            data {
                slug
                title
                description
                ${authorProfileFields}
                is_published
                tags {
                    name
                }
                created_by {
                    id
                    name
                }
                updated_by {
                    id
                    name
                }
                ${heroAssetFields}
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
    query PublicBlogs($first: Int!, $page: Int!, $tags: [String!], $title: String, $author: String, $orderBy: [QueryBlogsPublicOrderByOrderByClause!]) {
      blogsPublic(first: $first, page: $page, hasTags: $tags, title: $title, author: $author, orderBy: $orderBy) {
        data {
          slug
          title
          description
          ${authorProfileFields}
          tags {
            name
          }
          ${heroAssetFields}
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
        description
        ${authorProfileFields}
        json_content
        is_published
        ${heroAssetFields}
        tags {
          name
        }
        created_by {
          id
          name
        }
        updated_by {
          id
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
        description
        ${authorProfileFields}
        json_content
        is_published
        ${heroAssetFields}
        tags {
          name
        }
        created_at
        updated_at
      }
    }
  `;

  const blogTagsQuery = `
    query BlogTags {
      blogTags {
        id
        name
      }
    }
  `;

  const publicBlogTagsQuery = `
    query PublicBlogTags {
      blogTagsPublic {
        id
        name
      }
    }
  `;

  const adminDashboardQuery = `
    query AdminDashboard($orderBy: [QueryBlogsOrderByOrderByClause!]) {
      total: blogs(first: 0, page: 1) {
        paginatorInfo { total }
      }
      published: blogs(first: 0, page: 1, is_published: true) {
        paginatorInfo { total }
      }
      drafts: blogs(first: 0, page: 1, is_published: false) {
        paginatorInfo { total }
      }
      recent: blogs(first: 5, page: 1, orderBy: $orderBy) {
        data {
          slug
          title
          is_published
          updated_at
          author_profile { name }
        }
      }
    }
  `;

  const buildListVariables = (variables: BlogListQueryVariables) => ({
    first: variables.first,
    page: variables.page,
    tags: variables.tags,
    title: variables.title,
    author: variables.author,
    isPublished: variables.is_published,
    orderBy: orderByToGraphql(variables.orderBy),
  });

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
      }>(blogListQuery, buildListVariables(variables));
      return response.blogs;
    },
    listPublicBlogs: async (
      variables: BlogListQueryVariables = { first: 10, page: 1 },
    ) => {
      const response = await gql.request<{
        blogsPublic: GraphqlResponseWithPaginatorInfo<Blog>;
      }>(publicBlogListQuery, {
        first: variables.first,
        page: variables.page,
        tags: variables.tags,
        title: variables.title,
        author: variables.author,
        orderBy: orderByToGraphql(variables.orderBy),
      });
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
    getAdminDashboard: async (): Promise<AdminDashboard> => {
      const response = await gql.request<{
        total: { paginatorInfo: { total: number } };
        published: { paginatorInfo: { total: number } };
        drafts: { paginatorInfo: { total: number } };
        recent: { data: AdminDashboardBlog[] };
      }>(adminDashboardQuery, {
        orderBy: orderByToGraphql([{ column: "updated_at", order: "DESC" }]),
      });

      return {
        total: response.total.paginatorInfo.total,
        published: response.published.paginatorInfo.total,
        drafts: response.drafts.paginatorInfo.total,
        recent: response.recent.data,
      };
    },
    listBlogTags: async () => {
      const response = await gql.request<{
        blogTags: { id: string; name: string }[];
      }>(blogTagsQuery);
      return response.blogTags;
    },
    listPublicBlogTags: async () => {
      const response = await gql.request<{
        blogTagsPublic: { id: string; name: string }[];
      }>(publicBlogTagsQuery);
      return response.blogTagsPublic;
    },
  };
}
