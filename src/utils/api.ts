import { ApolloClient } from "apollo-client";
import {
  InMemoryCache,
  NormalizedCacheObject,
  defaultDataIdFromObject,
} from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import gql from "graphql-tag";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import { createPersistedQueryLink } from "apollo-link-persisted-queries";
import { toIdValue } from "apollo-utilities";

const authLink = setContext((_, { headers }) => {
  const auth = localStorage.getItem("auth");
  const state = auth ? JSON.parse(auth) : { token: "" };
  const token = state.token;
  return {
    headers: {
      ...headers,
      authorization: token ? `Token ${token}` : "",
    },
  };
});

const httplink = createHttpLink({
  uri: "https://conduit-graphql.netlify.app/graphql",
  useGETForQueries: true,
});

const cache: any = new InMemoryCache({
  dataIdFromObject: (object) => {
    switch (object.__typename) {
      case "Article":
        // @ts-ignore
        return object.__typename + ":" + object.slug;
      default:
        return defaultDataIdFromObject(object);
    }
  },
  cacheRedirects: {
    Query: {
      getArticle: (_, args) =>
        toIdValue(
          cache.config.dataIdFromObject({
            __typename: "Article",
            slug: args.slug,
          })
        ),
    },
  },
});

const link = ApolloLink.from([
  authLink,
  createPersistedQueryLink({ useGETForHashedQueries: true }),
  httplink,
]);

const client = new ApolloClient<NormalizedCacheObject>({
  link: link,
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

export const UserFragment = gql`
  fragment UserFragment on User {
    id
    username
    token
    bio
    image
    email
  }
`;

export const ProfileFragment = gql`
  fragment ProfileFragment on Profile {
    id
    username
    bio
    image
    following
  }
`;

export const CommentFragment = gql`
  fragment CommentFragment on Comment {
    id
    body
    createdAt
    updatedAt
  }
`;

export const ArticleFragment = gql`
  fragment ArticleFragment on Article {
    id
    slug
    title
    description
    body
    tagList
    createdAt
    updatedAt
    favorited
    favoritesCount
  }
`;

export const GET_ARTICLE = gql`
  query GetArticle($slug: String!) {
    getArticle(slug: $slug) {
      ...ArticleFragment
      author {
        ...ProfileFragment
      }
    }
  }
  ${ArticleFragment}
  ${ProfileFragment}
`;

export const GET_COMMENTS = gql`
  query GetComments($slug: String!) {
    getComments(slug: $slug) {
      comments {
        ...CommentFragment
        author {
          ...ProfileFragment
        }
      }
    }
  }
  ${ProfileFragment},
  ${CommentFragment}
`;

export const ADD_COMMENT = gql`
  mutation AddComment($slug: String!, $input: AddCommentInput!) {
    addComment(slug: $slug, input: $input) {
      ...CommentFragment
      author {
        ...ProfileFragment
      }
    }
  }
  ${CommentFragment}
  ${ProfileFragment}
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id) {
      ...CommentFragment
      author {
        ...ProfileFragment
      }
    }
  }
  ${CommentFragment}
  ${ProfileFragment}
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($username: String!) {
    follow(username: $username) {
      ...ProfileFragment
    }
  }
  ${ProfileFragment}
`;

export const UNFOLLOW_USER = gql`
  mutation UnFollowUser($username: String!) {
    unfollow(username: $username) {
      ...ProfileFragment
    }
  }
  ${ProfileFragment}
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      ...UserFragment
    }
  }
  ${UserFragment}
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ...UserFragment
    }
  }
  ${UserFragment}
`;

export const FAVORITE_ARTICLE = gql`
  mutation FavoriteArticle($slug: String!) {
    favoriteArticle(slug: $slug) {
      ...ArticleFragment
      author {
        ...ProfileFragment
      }
    }
  }
  ${ArticleFragment}
  ${ProfileFragment}
`;

export const UNFAVORITE_ARTICLE = gql`
  mutation UnFavoriteArticle($slug: String!) {
    unfavoriteArticle(slug: $slug) {
      ...ArticleFragment
      author {
        ...ProfileFragment
      }
    }
  }
  ${ArticleFragment}
  ${ProfileFragment}
`;

export const DELETE_ARTICLE = gql`
  mutation DeleteArticle($slug: String!) {
    deleteArticle(slug: $slug) {
      ...ArticleFragment
      author {
        ...ProfileFragment
      }
    }
  }
  ${ArticleFragment}
  ${ProfileFragment}
`;

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      ...UserFragment
    }
  }
  ${UserFragment}
`;

export const CREATE_ARTICLE = gql`
  mutation CreateArticle($input: CreateArticleInput!) {
    createArticle(input: $input) {
      ...ArticleFragment
      author {
        ...ProfileFragment
      }
    }
  }
  ${ArticleFragment}
  ${ProfileFragment}
`;

export const GET_TAGS = gql`
  query GetTags {
    getTags
  }
`;

export const GET_PROFILE = gql`
  query GetProfile($username: String!) {
    getProfile(username: $username) {
      ...ProfileFragment
    }
  }
  ${ProfileFragment}
`;

export const GET_FEED_ARTICLES = gql`
  query GetFeedArticles($input: GetFeedArticlesInput!) {
    getFeedArticles(input: $input) {
      articles {
        ...ArticleFragment
        author {
          ...ProfileFragment
        }
      }
      articlesCount
    }
  }
  ${ArticleFragment}
  ${ProfileFragment}
`;

export const GET_ALL_ARTICLES = gql`
  query GetAllArticles($input: GetAllArticlesInput!) {
    getAllArticles(input: $input) {
      articles {
        ...ArticleFragment
        author {
          ...ProfileFragment
        }
      }
      articlesCount
    }
  }
  ${ArticleFragment}
  ${ProfileFragment}
`;

export { client };
