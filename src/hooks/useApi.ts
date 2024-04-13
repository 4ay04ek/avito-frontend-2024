import axios from "axios";
import { setupCache } from "axios-cache-interceptor";
import axiosRetry from "axios-retry";
import isDeepEqual from "fast-deep-equal/react";
import qs from "qs";
import { useEffect, useRef, useState } from "react";
import {
  Images,
  ManyMovies,
  Movie,
  PossibleValues,
  Reviews,
  Seasons,
} from "../entities/entities";

type ApiParams = Record<string, string>;
type ApiResult<T> = {
  error: boolean;
  loading: boolean;
  data?: T;
};

const instance = axios.create();
const api = setupCache(instance);
axiosRetry(api, { retries: 3 });

export const useApiMovies = (
  params?: ApiParams,
  mock?: boolean
): ApiResult<ManyMovies> => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [paramsRef, setParams] = useState(params);
  const firstTimeMock = useRef<boolean>();
  firstTimeMock.current ??= Boolean(mock);
  if (!isDeepEqual(paramsRef, params)) setParams(params);
  useEffect(() => {
    if (firstTimeMock.current) {
      firstTimeMock.current = false;
      return;
    }
    const source = axios.CancelToken.source();
    setLoading(true);
    setError(false);
    api
      .get(`https://api.kinopoisk.dev/v1.4/movie`, {
        cancelToken: source.token,
        headers: {
          "X-API-KEY": process.env.TOKEN || "",
        },
        params: paramsRef,
      })
      .then((res) => {
        setLoading(false);
        res.data && setData(res.data);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [paramsRef]);
  return firstTimeMock.current
    ? { loading: false, data: undefined, error: false }
    : { loading, data, error };
};

export const useApiMovie = (id: string): ApiResult<Movie> => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const source = axios.CancelToken.source();
    setLoading(true);
    setError(false);
    api
      .get(`https://api.kinopoisk.dev/v1.4/movie/${id}`, {
        cancelToken: source.token,
        headers: {
          "X-API-KEY": process.env.TOKEN || "",
        },
      })
      .then((res) => {
        setLoading(false);
        res.data && setData(res.data);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [id]);
  return { loading, data, error };
};

export const useApiSearch = (
  params?: ApiParams,
  mock?: boolean
): ApiResult<ManyMovies> => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [paramsRef, setParams] = useState(params);
  const firstTimeMock = useRef<boolean>();
  firstTimeMock.current ??= Boolean(mock);
  if (!isDeepEqual(paramsRef, params)) setParams(params);
  useEffect(() => {
    if (firstTimeMock.current) {
      firstTimeMock.current = false;
      return;
    }
    const source = axios.CancelToken.source();
    setLoading(true);
    setError(false);
    api
      .get(`https://api.kinopoisk.dev/v1.4/movie/search`, {
        cancelToken: source.token,
        headers: {
          "X-API-KEY": process.env.TOKEN || "",
        },
        params: paramsRef,
      })
      .then((res) => {
        setLoading(false);
        res.data && setData(res.data);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [paramsRef]);
  return firstTimeMock.current
    ? { loading: false, data: undefined, error: false }
    : { loading, data, error };
};

export const useApiReviews = (
  id: string,
  page?: number,
  limit?: number
): ApiResult<Reviews> => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const source = axios.CancelToken.source();
    setLoading(true);
    setError(false);
    api
      .get(`https://api.kinopoisk.dev/v1.4/review`, {
        cancelToken: source.token,
        headers: {
          "X-API-KEY": process.env.TOKEN || "",
        },
        params: {
          movieId: id,
          page,
          limit,
        },
      })
      .then((res) => {
        setLoading(false);
        res.data && setData(res.data);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [id, page, limit]);
  return { loading, data, error };
};

export const useApiImages = (id: string, page?: number): ApiResult<Images> => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const source = axios.CancelToken.source();
    setLoading(true);
    setError(false);
    api
      .get(`https://api.kinopoisk.dev/v1.4/image`, {
        cancelToken: source.token,
        headers: {
          "X-API-KEY": process.env.TOKEN || "",
        },
        params: {
          movieId: id,
          page,
        },
      })
      .then((res) => {
        setLoading(false);
        res.data && setData(res.data);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [id, page]);
  return { loading, data, error };
};

export const useApiSeasons = (
  id: string,
  page?: number,
  limit?: number
): ApiResult<Seasons> => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const source = axios.CancelToken.source();
    setLoading(true);
    setError(false);
    api
      .get(`https://api.kinopoisk.dev/v1.4/season`, {
        cancelToken: source.token,
        headers: {
          "X-API-KEY": process.env.TOKEN || "",
        },
        params: {
          movieId: id,
          sortField: "number",
          sortType: 1,
          page,
          limit,
        },
      })
      .then((res) => {
        setLoading(false);
        res.data && setData(res.data);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [id, page, limit]);
  return { loading, data, error };
};

export const useApiRandom = (params?: ApiParams): ApiResult<Movie> => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [paramsRef, setParams] = useState(params);
  if (!isDeepEqual(paramsRef, params)) setParams(params);
  useEffect(() => {
    const source = axios.CancelToken.source();
    setLoading(true);
    setError(false);
    const copy = structuredClone(paramsRef);
    delete copy?.force;
    axios
      .get(`https://api.kinopoisk.dev/v1.4/movie/random`, {
        cancelToken: source.token,
        headers: {
          "X-API-KEY": process.env.TOKEN || "",
        },
        params: {
          ...copy,
          notNullFields: ["name", "description", "poster.url"],
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then((res) => {
        setLoading(false);
        res.data ? setData(res.data) : setError(true);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [paramsRef]);
  return { loading, data, error };
};

export const useApiGenres = (): ApiResult<PossibleValues[]> => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const source = axios.CancelToken.source();
    setLoading(true);
    setError(false);
    axios
      .get(`https://api.kinopoisk.dev/v1/movie/possible-values-by-field`, {
        cancelToken: source.token,
        headers: {
          "X-API-KEY": process.env.TOKEN || "",
        },
        params: {
          field: "genres.name",
        },
      })
      .then((res) => {
        setLoading(false);
        res.data && setData(res.data);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);
  return { loading, data, error };
};
