import axios, { AxiosRequestConfig, Canceler } from 'axios';
import * as Logger from '../logger';
import lscache from 'ls-cache';
import { FetchError } from '../error';
import { getAppConfig } from '../config';
import {
    Interceptor,
    Response,
    InterceptorRecipe,
} from './http-client-typings';
import { BasicInterceptors } from './basic-interceptor';
import idx from 'idx';

interface Options extends AxiosRequestConfig {
    cancel?: (cancel: Canceler) => void;
    requestInterceptors?: Interceptor[];
    responseInterceptors?: Interceptor[];
    interceptorsRecipe?: InterceptorRecipe;
    api?: string;
    cache?: boolean;
    cacheMinutes?: number;
}

export const fetch = async (
    url,
    {
        interceptorsRecipe = BasicInterceptors,
        cancel,
        requestInterceptors,
        responseInterceptors,
        headers = {},
        api,
        method,
        params,
        cache,
        cacheMinutes = 30,
        ...otherOptions
    }: Options = {}
): Promise<Response<any>> => {
    const { config } = await getAppConfig();
    if (api) {
        if (idx(config, _ => _.api[api].basepath) !== undefined) {
            url = config.api[api].basepath + url;
        } else {
            throw new Error(`No existe configuración para la API ${api}`);
        }
    }
    // Get data from local-storage if it's already saved and if request method is only a GET
    if (cache && method === 'get' && lscache.get(JSON.stringify([url, params]))) {
        return lscache.get(JSON.stringify([url, params]));
    }

    const instance = axios.create();

    (requestInterceptors
            ? requestInterceptors
            : interceptorsRecipe.requestInterceptors
    ).forEach(([resolve, reject]) => {
        instance.interceptors.request.use(resolve, reject);
    });

    (responseInterceptors
            ? responseInterceptors
            : interceptorsRecipe.responseInterceptors
    ).forEach(([resolve, reject]) => {
        instance.interceptors.response.use(resolve, reject);
    });

    headers = {
        id_channel: idx(config, _ => _.channelId),
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json',
        Accept: `application/vnd.iman.v1+json, application/json, text/plain, */*`,
        Pragma: 'no-cache',
        ...headers,
    };

    try {
        const response = (await instance.request({
            url,
            headers,
            cancelToken: cancel ? new axios.CancelToken(cancel) : null,
            method,
            params,
            ...otherOptions,
        })) as any;

        if (cache && method === 'get') {
            return lscache.set(JSON.stringify([url, params]), response, cacheMinutes);
        }

        return response;
    } catch (err) {
        if (axios.isCancel(err)) {
            throw new FetchError({ type: FetchError.CANCEL, baseError: err });
        } else {
            Logger.debug(`HttpClient: something went wrong when trying to fetch`);
            throw err;
        }
    }
};

const makeMethod = (method: string) => (url, options: Options = {}) =>
    fetch(url, {
        ...options,
        method,
    });

export const get = makeMethod('get');

export const post = makeMethod('post');

export const put = makeMethod('put');

export const del = makeMethod('delete');
