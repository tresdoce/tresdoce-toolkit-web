import { AxiosResponse } from 'axios';
import {
    Interceptor,
    Response,
    InterceptorRecipe,
} from './http-client-typings';
import { navigate } from '../navigation';

export const NavigateOnErrorInterceptor = (url:string): Interceptor => [
    null,
    error => navigate(url, { state: { error } }),
];

export const BasicResponseTransformInterceptor: Interceptor = [
    (response: AxiosResponse): Response<any> => ({
        status: response.status,
        data: response.data,
        errors: [],
    }),
    null,
];

export const BasicInterceptors: InterceptorRecipe = {
    requestInterceptors: [],
    responseInterceptors: [BasicResponseTransformInterceptor],
};
