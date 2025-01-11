/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** @format int32 */
export enum ActivityStatus {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

export interface AnswerOption {
  /** @format int32 */
  optionId?: number;
  option?: string | null;
  isCorrect?: boolean;
}

export interface KataAnswerDto {
  /** @format int64 */
  kataId?: number;
  /** @format int32 */
  optionId?: number;
}

/** @format int32 */
export enum KataDifficulty {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
  Value7 = 7,
  Value20 = 20,
}

export interface KataDto {
  /** @format int64 */
  id?: number;
  title?: string | null;
  programmingLanguage?: ProgrammingLanguage;
  kataDifficulty?: KataDifficulty;
  kataType?: KataType;
  kataJsonContent?: KataJsonContent;
  /** @format int64 */
  authorId?: number;
}

export interface KataJsonContent {
  kataDescription?: string | null;
  sourceCode?: string | null;
  answerOptionsRawJson?: string | null;
  answerOptions?: AnswerOption[] | null;
}

export interface KataSolveResultDto {
  isAnswerCorrect?: boolean;
  error?: string | null;
}

/** @format int32 */
export enum KataType {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

export interface LeaderboardPositionDto {
  /** @format int64 */
  userId?: number;
  username?: string | null;
  rank?: Rank;
  /** @format int64 */
  rating?: number;
}

export interface LoginDto {
  username?: string | null;
  password?: string | null;
}

export interface ProfileInfoDto {
  username?: string | null;
  avatarUrl?: string | null;
  description?: string | null;
  activityStatus?: ActivityStatus;
  /** @format int64 */
  userId?: number;
}

/** @format int32 */
export enum ProgrammingLanguage {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
}

/** @format int32 */
export enum Rank {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
  Value7 = 7,
  Value20 = 20,
}

export interface RegisterDto {
  email?: string | null;
  username?: string | null;
  password?: string | null;
}

export interface TokenDto {
  accessToken?: string | null;
  /** @format int64 */
  userId?: number | null;
}

export interface UserDto {
  username?: string | null;
  password?: string | null;
  email?: string | null;
  /** @format date-time */
  registrationDate?: string;
  rank?: Rank;
  /** @format int64 */
  rating?: number;
  /** @format int64 */
  gitHubProfileId?: number | null;
  /** @format int64 */
  userProfileId?: number | null;
  /** @format int64 */
  roleId?: number | null;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title My API
 * @version v1
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Auth
     * @name AuthLoginCreate
     * @request POST:/api/auth/login
     */
    authLoginCreate: (data: LoginDto, params: RequestParams = {}) =>
      this.request<TokenDto, any>({
        path: `/api/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthLoginGithubCreate
     * @request POST:/api/auth/login/github
     */
    authLoginGithubCreate: (data: string, params: RequestParams = {}) =>
      this.request<TokenDto, any>({
        path: `/api/auth/login/github`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthRegisterCreate
     * @request POST:/api/auth/register
     */
    authRegisterCreate: (data: RegisterDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags KataAdministration
     * @name KataAdministrationCreate
     * @request POST:/api/kata-administration
     */
    kataAdministrationCreate: (data: KataDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/kata-administration`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags KataAdministration
     * @name KataAdministrationUpdate
     * @request PUT:/api/kata-administration
     */
    kataAdministrationUpdate: (data: KataDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/kata-administration`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags KataAdministration
     * @name KataAdministrationDelete
     * @request DELETE:/api/kata-administration
     */
    kataAdministrationDelete: (
      query?: {
        /** @format int64 */
        kataId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/kata-administration`,
        method: "DELETE",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags KataSearch
     * @name KataSearchDetail
     * @request GET:/api/kata-search/{kataId}
     */
    kataSearchDetail: (kataId: number, params: RequestParams = {}) =>
      this.request<KataDto, any>({
        path: `/api/kata-search/${kataId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags KataSearch
     * @name KataSearchList
     * @request GET:/api/kata-search
     */
    kataSearchList: (
      query?: {
        kataLanguage?: ProgrammingLanguage;
        kataType?: KataType;
        kataDifficulty?: KataDifficulty;
      },
      params: RequestParams = {},
    ) =>
      this.request<KataDto[], any>({
        path: `/api/kata-search`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags KataSolve
     * @name KataSolveUpdate
     * @request PUT:/api/kata-solve
     */
    kataSolveUpdate: (data: KataAnswerDto, params: RequestParams = {}) =>
      this.request<KataSolveResultDto, any>({
        path: `/api/kata-solve`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Leaderboard
     * @name LeaderboardList
     * @request GET:/api/leaderboard
     */
    leaderboardList: (params: RequestParams = {}) =>
      this.request<LeaderboardPositionDto[], any>({
        path: `/api/leaderboard`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProfileInfo
     * @name ProfileInfoDetail
     * @request GET:/api/profile-info/{userId}
     */
    profileInfoDetail: (userId: number, params: RequestParams = {}) =>
      this.request<ProfileInfoDto, any>({
        path: `/api/profile-info/${userId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserList
     * @request GET:/api/user
     */
    userList: (
      query?: {
        /** @format int64 */
        userId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserDto, any>({
        path: `/api/user`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
}
