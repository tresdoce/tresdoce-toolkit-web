import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { get } from './';
import { addTestConfig } from '../test-utils';

describe('HttpClient Interceptors', () => {
    let mock;

    beforeAll(() => {
        mock = new MockAdapter(axios);
    });

    it('add a basic interceptors', async () => {
        const data = { jsonData: true };
        mock.onGet('/test').reply(200, data);

        const resolve = jest.fn(identity => identity);
        const reject = jest.fn(identity => identity);

        addTestConfig();

        await get('/test', {
            requestInterceptors: [[resolve, reject]],
            responseInterceptors: [[resolve, reject]],
        });

        expect(resolve).toHaveBeenCalledTimes(2);
        expect(reject).toHaveBeenCalledTimes(0);
    });

    it('add a basic failing request interceptors', async () => {
        mock.onGet('/test').reply(500);

        const resolve = jest.fn(identity => identity);
        const reject = jest.fn(identity => identity);

        addTestConfig();
        try {
            await get('/test', {
                requestInterceptors: [[resolve, reject]],
                responseInterceptors: [[resolve, reject]],
            });
        } catch (error) {}

        expect(resolve).toHaveBeenCalledTimes(1);
        expect(reject).toHaveBeenCalledTimes(1);
    });
});
