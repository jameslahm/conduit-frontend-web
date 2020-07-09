import qs from "qs";

// const BASEURL = "http://localhost:5000/api";
const BASEURL = "https://conduit.productionready.io/api";

export interface LoginRequestBody {
  user: {
    email: string;
    password: string;
  };
}

export interface RegisterRequestBody {
  user: {
    username: string;
    email: string;
    password: string;
  };
}

export interface UpdateUserRequestBody {
  user: {
    email?: string;
    username?: string;
    password?: string;
    image?: string;
    bio?: string;
  };
}

export interface GetAllArticlesRequestQueryType {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: number;
  offset?: number;
}

export interface GetFeedArticlesRequestQueryType {
  limit?: number;
  offset?: number;
}

export interface CreateArticleRequestBodyType {
  article: {
    title: string;
    description: string;
    body: string;
    tagList: string[];
  };
}

export interface UpdateArticleRequestBodyType {
  article: {
    title: string;
    description: string;
    body: string;
  };
}

export interface AddCommentRequestBodyType {
  comment: {
    body: string;
  };
}

export interface UserResponseType {
  user: {
    email: string;
    token: string;
    username: string;
    bio: string;
    image: string;
  };
}

export interface ProfileResponseType {
  profile: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
}

export interface ArticleResponseType {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: ProfileResponseType["profile"];
}

export interface CommentResponseType {
  id: string;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: ProfileResponseType["profile"];
}

export interface TagsResponseType {
  tags: string[];
}

export interface ErrorResponseType {
  statusCode: number;
}

// 401
const AuthenticationMessage = "Authentication Error";
// 404
const NotFoundMessage = "Not Found";
// 500
const InternalServerErrorMessage = "Internal Server Error";
// 422
const NotUniqueMessage = "Already Taken";

const parseResponse = async <T extends Response>(res: T) => {
  if (!res.ok) {
    // eslint-disable-next-line no-throw-literal
    switch (res.status) {
      case 401:
        throw new Error(AuthenticationMessage);
      case 404:
        throw new Error(NotFoundMessage);
      case 422:
        throw new Error(NotUniqueMessage);
      case 500:
        throw new Error(InternalServerErrorMessage);
    }
  }
  const data = await res.json();
  return data;
};

const api = {
  login({ payload }: { payload: LoginRequestBody }) {
    return fetch(`${BASEURL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then<UserResponseType>(parseResponse);
  },
  register({ payload }: { payload: RegisterRequestBody }) {
    return fetch(`${BASEURL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then<UserResponseType>(parseResponse);
  },
  getCurrentUser({ token }: { token: string }) {
    return fetch(`${BASEURL}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }).then<UserResponseType>(parseResponse);
  },
  updateUser({
    payload,
    token,
  }: {
    payload: UpdateUserRequestBody;
    token: string;
  }) {
    return fetch(`${BASEURL}/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Token ${token}` : "",
      },
      body: JSON.stringify(payload),
    }).then<UserResponseType>(parseResponse);
  },
  getProfile({
    payload,
    token,
  }: {
    payload: string;
    token: string | undefined;
  }) {
    return fetch(`${BASEURL}/profiles/${payload}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Token ${token}` : "",
      },
    }).then<ProfileResponseType>(parseResponse);
  },

  followUser({ payload, token }: { payload: string; token: string }) {
    return fetch(`${BASEURL}/profiles/${payload}/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Token ${token}` : "",
      },
    }).then<ProfileResponseType>(parseResponse);
  },
  unfollowUser({ payload, token }: { payload: string; token: string }) {
    return fetch(`${BASEURL}/profiles/${payload}/follow`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Token ${token}` : "",
      },
    }).then<ProfileResponseType>(parseResponse);
  },
  getAllArticles({
    payload,
    token,
  }: {
    payload: GetAllArticlesRequestQueryType;
    token: string | undefined;
  }) {
    return fetch(`${BASEURL}/articles?${qs.stringify(payload)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Token ${token}` : "",
      },
    }).then<{ articles: ArticleResponseType[]; articlesCount: number }>(
      parseResponse
    );
  },
  getFeedArticles({
    payload,
    token,
  }: {
    payload: GetFeedArticlesRequestQueryType;
    token: string;
  }) {
    return fetch(`${BASEURL}/articles/feed?${qs.stringify(payload)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Token ${token}` : "",
      },
    }).then<{ articles: ArticleResponseType[]; articlesCount: number }>(
      parseResponse
    );
  },
  getArticle({ payload }: { payload: string }) {
    return fetch(`${BASEURL}/articles/${payload}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then<{ article: ArticleResponseType }>(parseResponse);
  },
  createArticle({
    payload,
    token,
  }: {
    payload: CreateArticleRequestBodyType;
    token: string;
  }) {
    return fetch(`${BASEURL}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Token ${token}` : "",
      },
      body: JSON.stringify(payload),
    }).then<{ article: ArticleResponseType }>(parseResponse);
  },
  updateArticle({
    slug,
    payload,
    token,
  }: {
    slug: string;
    payload: UpdateArticleRequestBodyType;
    token: string;
  }) {
    return fetch(`${BASEURL}/articles/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Token ${token}` : "",
      },
      body: JSON.stringify(payload),
    }).then<{ article: ArticleResponseType }>(parseResponse);
  },
  deleteArticle({ payload, token }: { payload: string; token: string }) {
    return fetch(`${BASEURL}/articles/${payload}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Token ${token}` : "",
      },
    }).then<{ article: ArticleResponseType }>(parseResponse);
  },
  addComment({
    slug,
    payload,
    token,
  }: {
    slug: string;
    payload: AddCommentRequestBodyType;
    token: string;
  }) {
    return fetch(`${BASEURL}/articles/${slug}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Token ${token}` : "",
      },
      body: JSON.stringify(payload),
    }).then<{ comment: CommentResponseType }>(parseResponse);
  },
  getComments({
    payload,
    token,
  }: {
    payload: string;
    token: string | undefined;
  }) {
    return fetch(`${BASEURL}/articles/${payload}/comments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Token ${token}` : "",
      },
    }).then<{ comments: CommentResponseType[] }>(parseResponse);
  },
  deleteComment({
    slug,
    id,
    token,
  }: {
    slug: string;
    id: string;
    token: string;
  }) {
    return fetch(`${BASEURL}/articles/${slug}/comments/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Token ${token}` : "",
      },
    }).then<{ comment: CommentResponseType }>(parseResponse);
  },
  favoriteArticle({ payload, token }: { payload: string; token: string }) {
    return fetch(`${BASEURL}/articles/${payload}/favorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Token ${token}` : "",
      },
    }).then<{ article: ArticleResponseType }>(parseResponse);
  },
  unfavoriteArticle({ payload, token }: { payload: string; token: string }) {
    return fetch(`${BASEURL}/articles/${payload}/favorite`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Token ${token}` : "",
      },
    }).then<{ article: ArticleResponseType }>(parseResponse);
  },
  getTags() {
    return fetch(`${BASEURL}/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then<TagsResponseType>(parseResponse);
  },
};

export { api };
