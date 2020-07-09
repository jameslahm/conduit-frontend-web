import React, { useState } from "react";
import { rootStateType } from "../store";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import { ArticlePreview, ArticlePreviewSkeleton } from "./ArticlePreview";
import { api } from "../utils";
import { useQuery } from "react-query";

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
  tag: string;
}

const ArticlePreviewList: React.FC<ArticleListPropsType> = ({ tag }) => {
  const classes = useStyles();
  const token = useSelector((state: rootStateType) => state.auth.token);
  const [currentPage, setCurrentPage] = useState(1);
  const apiUrl = tag === "FEED" ? "getFeedArticles" : "getAllArticles";
  const apiOptions = {
    limit: 10,
    offset: (currentPage - 1) * 10,
    ...(tag === "GLOBAL" || tag === "FEED" ? {} : { tag: tag }),
  };

  const { data, isLoading } = useQuery(
    [apiUrl, { payload: apiOptions, token }],
    (key, { payload, token }) => {
      if (key === "getFeedArticles") {
        return api.getFeedArticles({ payload, token });
      } else {
        return api.getAllArticles({ payload, token });
      }
    }
  );

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
                queryKey={[apiUrl, { payload: apiOptions, token }]}
              ></ArticlePreview>
            );
          })}

      {isLoading || !data ? null : (
        <Pagination
          count={data.articlesCount / 10}
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
