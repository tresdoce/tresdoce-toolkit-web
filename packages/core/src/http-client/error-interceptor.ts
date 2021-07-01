import { Interceptor } from './http-client-typings';
import idx from 'idx';

export const ThrowedErrorInterceptor: Interceptor = [
    null,
    error => ({
        status: idx(error, _ => _.response.status),
        errors: [error],
        data: idx(error, _ => _.response.data),
    }),
];
