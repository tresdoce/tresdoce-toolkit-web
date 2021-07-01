import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { addTestConfig } from '../test-utils';
import { get } from './';
import { ThrowedErrorInterceptor } from './error-interceptor';

describe('HttpClient Error Interceptors', () => {
    let mock;

    beforeAll(() => {
        mock = new MockAdapter(axios);
    });

    it('returns the error in the response on a 404 response status', async () => {
        mock.onGet('/test').reply(404);
        addTestConfig({ config: { debug: true } });

        const { errors, status, data } = await get('/test', {
            requestInterceptors: [],
            responseInterceptors: [ThrowedErrorInterceptor],
        });
        expect(errors).toHaveLength(1);
        expect(data).toBe(undefined);
        expect(status).toBe(404);
    });

    it('returns the error in the response on a 404 response status', async () => {
        mock.onGet('/test').reply(404, {x: "yes"});
        addTestConfig({ config: { debug: true } });

        const { errors, status, data } = await get('/test', {
            requestInterceptors: [],
            responseInterceptors: [ThrowedErrorInterceptor],
        });
        expect(errors).toHaveLength(1);
        expect(data).toStrictEqual({x: "yes"});
        expect(status).toBe(404);
    });
});
