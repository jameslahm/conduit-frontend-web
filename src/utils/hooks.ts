import { api, ErrorResponseType } from "./api";
import { useState, useRef } from "react";

type RequestType = keyof typeof api;
type ThenArg<T> = T extends Promise<infer U> ? U : T;


// NOTE: Experimental Unused
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useApi = <T extends RequestType>(
  type: T,
  ...args: Parameters<typeof api[T]>
) => {
  const [data, setData] = useState<ThenArg<ReturnType<typeof api[T]>> | null>(
    null
  );
  const isLoadingContainer = useRef(true);
  const [error, setError] = useState<null | ErrorResponseType>(null);
  const isValidContainer = useRef(true);

  if (isValidContainer.current === true) {
    // isLoadingContainer.current = true;
    const request = (api[type] as (
      ...args: Parameters<typeof api[T]>
    ) => ReturnType<typeof api[T]>)(...args);

    (request as Promise<ThenArg<ReturnType<typeof api[T]>>>)
      .then((data) => {
        isValidContainer.current = false;
        isLoadingContainer.current = false;
        setData(data);
        isValidContainer.current = true;
      })
      .catch((error) => {
        isValidContainer.current = false;
        isLoadingContainer.current = false;
        setError(error);
        isValidContainer.current = true;
      });
  }
  return { data, error, isLoading: isLoadingContainer.current };
};

