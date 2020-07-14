import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import { ArticlePreview, ArticlePreviewSkeleton } from "./ArticlePreview";
import { useQuery } from "@apollo/react-hooks";
import { GetArticle } from "../utils/__generated__/GetArticle";
import {
  GetAllArticles,
  GetAllArticlesVariables,
} from "../utils/__generated__/GetAllArticles";
import {
  GetFeedArticles,
  GetFeedArticlesVariables,
} from "../utils/__generated__/GetFeedArticles";
import { GET_FEED_ARTICLES, GET_ALL_ARTICLES } from "../utils";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2)}px`,
    display: "grid",
    gridRowGap: `${theme.spacing(3)}px`,
  },
  pagination: {
    marginTop: `${theme.spacing(2)}px`,
  },
}));

interface ArticleListPropsType {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: number;
  offset?: number;
}

const ArticlePreviewList: React.FC<ArticleListPropsType> = ({
  tag,
  author,
  favorited,
  limit = 10,
  offset = 0,
}) => {
  const classes = useStyles();
  const [currentPage, setCurrentPage] = useState(1);

  const apiOptions: ArticleListPropsType = {
    limit: limit,
    offset: (currentPage - 1) * limit + offset,
  };
  if (tag && tag !== "GLOBAL" && tag !== "FEED") {
    apiOptions.tag = tag;
  }
  if (author) {
    apiOptions.author = author;
  }
  if (favorited) {
    apiOptions.favorited = favorited;
  }

  const { loading: allloading, data: allArticlesData } = useQuery<
    GetAllArticles,
    GetAllArticlesVariables
  >(GET_ALL_ARTICLES, {
    variables: {
      input: {
        ...apiOptions,
      },
    },
    skip: tag === "FEED",
  });

  const { loading: feedloading, data: feedArticlesData } = useQuery<
    GetFeedArticles,
    GetFeedArticlesVariables
  >(GET_FEED_ARTICLES, {
    variables: {
      input: {
        limit: limit,
        offset: offset,
      },
    },
    skip: tag === "GLOBAL",
  });

  const isLoading = tag === "FEED" ? feedloading : allloading;

  let articles: GetArticle["getArticle"][];
  let articlesCount: number;

  if (tag === "FEED") {
    articles = feedArticlesData?.getFeedArticles?.articles || [];
    articlesCount = feedArticlesData?.getFeedArticles?.articlesCount || 0;
  } else {
    articles = allArticlesData?.getAllArticles?.articles || [];
    articlesCount = allArticlesData?.getAllArticles?.articlesCount || 0;
  }

  return (
    <div className={classes.root}>
      {isLoading || !articles
        ? [...Array(10)].map((_, index) => {
            return (
              <ArticlePreviewSkeleton key={index}></ArticlePreviewSkeleton>
            );
          })
        : articles.map((article) => {
            if (article) {
              return (
                <ArticlePreview
                  key={article.slug}
                  article={article}
                ></ArticlePreview>
              );
            } else {
              return null;
            }
          })}

      {isLoading || !articles ? null : (
        <Pagination
          count={Math.ceil(articlesCount / 10)}
          defaultPage={1}
          size="large"
          page={currentPage}
          onChange={(e, page) => {
            setCurrentPage(page);
          }}
          className={classes.pagination}
          color="primary"
        ></Pagination>
      )}
    </div>
  );
};

export default ArticlePreviewList;
