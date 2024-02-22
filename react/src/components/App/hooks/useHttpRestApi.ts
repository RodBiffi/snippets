import { useMemo } from 'react';
import { QueryOptions, useQuery } from '@tanstack/react-query';

interface IApi<T> {
  data: T | undefined;
  error: unknown;
  isError: boolean;
  isLoading: boolean;
}

const fetcher =
  <T>(url: string) =>
  async (): Promise<T> => {
    const response = await fetch(url);
    return await response.json();
  };

const useHttpRestApi = <T>(
  key: string,
  url: string,
  defaultValue?: T,
  options?: QueryOptions,
): IApi<T> => {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: [key],
    queryFn: fetcher<T>(url),
    ...options,
  });

  return useMemo(
    () => ({
      data: (data as T) || defaultValue,
      isError,
      isLoading,
      error,
    }),
    [defaultValue, isLoading, isError, data, error],
  );
};

export default useHttpRestApi;
