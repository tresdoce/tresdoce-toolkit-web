import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { get } from './';
import { addTestConfig } from '../test-utils';

describe('HttpClient Basic Interceptors', () => {
    let mock;

    beforeAll(() => {
        mock = new MockAdapter(axios);
    });

    it('works fine on a 200 get request', async () => {
        const data = { jsonData: true };
        mock.onGet('/test').reply(200, data);

        addTestConfig();

        expect(await get('/test')).toEqual({ status: 200, data: data, errors: [] });
    });

    it('throws when a 500 is returned', async done => {
        mock.onGet('/test').reply(500);
        addTestConfig();
        try {
            await get('/test');
        } catch (error) {
            if (error.response.status === 500) {
                done();
                return;
            }
        }
        throw new Error('it should have failed with a 500 status');
    });

    it('accepts an api from config', async () => {
        const responseMock = jest.fn(() => [200]);
        mock.onGet('http://localhost/test').reply(responseMock);
        addTestConfig();
        await get('/test', { api: 'fake' });
        expect(responseMock).toHaveBeenCalledTimes(1);
    });

    it('throws when an incorrect api is set', async () => {
        addTestConfig();

        expect(get('/any', { api: 'non-existent' })).rejects.toEqual(
            new Error('No existe configuración para la API non-existent')
        );
    });

    it('cache\'s the response', async () => {
        const responseMock = jest.fn(() => [200]);
        mock.onGet('/test').reply(responseMock);
        addTestConfig();
        await get('/test', {cache: true});
        expect(responseMock).toHaveBeenCalledTimes(1);
        await get('/test', {cache: true});
        expect(responseMock).toHaveBeenCalledTimes(1);
    });
});
