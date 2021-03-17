import { AppConfig } from '../typings';
import merge from 'deepmerge';

const localMockConfig: AppConfig = {
    config: {
        cookieDomain: 'x.y.z',
        debug: false,
        api: {
            refresh: {
                basepath: '',
                withCredentials: true,
            },
            fake: {
                basepath: 'http://localhost',
                withCredentials: true,
            },
        },
        appBasepath: '',
        cdnBasepath: '',
        distributionChannel: 'local-mock'
    },
};

export const addTestConfig = (mergedOptions: object = {}) => {
    window.__NEXT_DATA__ = {
        props: { pageProps: merge(localMockConfig, mergedOptions) },
    };
};
