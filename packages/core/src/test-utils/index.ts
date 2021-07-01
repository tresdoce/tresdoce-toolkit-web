import { AppConfig } from '../typings';
import lodash from 'lodash';

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
            'bff-channel': {
                basepath: '',
                withCredentials: true,
            },
        },
        appBasepath: '',
        cdnBasepath: '',
        channelId: 'onb',
        distributionChannel: 'local-mock'
    }
};

export const addTestConfig = (mergedOptions: object = {}) => {
    window.__NEXT_DATA__ = {
        props: { pageProps: lodash.merge(localMockConfig, mergedOptions) },
    };
};
