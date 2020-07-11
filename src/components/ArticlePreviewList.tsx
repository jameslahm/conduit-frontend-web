import React, { useState } from "react";
import { rootStateType } from "../store";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import { ArticlePreview, ArticlePreviewSkeleton } from "./ArticlePreview";
import { api, ArticleResponseType, QueryKeyType } from "../utils";
import { useQuery, queryCache } from "react-query";

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
  const token = useSelector((state: rootStateType) => state.auth.token);
  const [currentPage, setCurrentPage] = useState(1);
  const apiUrl = tag === "FEED" ? "getFeedArticles" : "getAllArticles";

  const apiOptions: ArticleListPropsType = {
    limit: limit,
    offset: (currentPage-1) * limit + offset,
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

  const queryKey: QueryKeyType = [apiUrl, { payload: apiOptions, token }];

  const updateFn = (data: ArticleResponseType) => {
    queryCache.cancelQueries(queryKey);

    const previousData = queryCache.getQueryData(queryKey);

    queryCache.setQueryData(queryKey, (old: any) => {
      const articles = old.articles.map((item: any) => {
        if (item.slug === data.slug) {
          item = { ...data };
        }
        return { ...item };
      });
      return { articles: articles, articlesCount: old.articlesCount };
    });

    return () => queryCache.setQueryData(queryKey, previousData);
  };

  const { data, isLoading } = useQuery(queryKey, (key, { payload, token }) => {
    if (key === "getFeedArticles") {
      return api.getFeedArticles({ payload, token });
    } else {
      return api.getAllArticles({ payload, token });
    }
  });

  return (
    <div className={classes.root}>
      {isLoading || !data
        ? [...Array(10)].map((_, index) => {
            return (
              <ArticlePreviewSkeleton key={index}></ArticlePreviewSkeleton>
            );
          })
        : data.articles.map((article) => {
            return (
              <ArticlePreview
                key={article.slug}
                article={article}
                updateFn={updateFn}
                queryKey={queryKey}
              ></ArticlePreview>
            );
          })}

      {isLoading || !data ? null : (
        <Pagination
          count={Math.ceil(data.articlesCount / 10)}
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
