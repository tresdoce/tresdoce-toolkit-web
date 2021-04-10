import {AppConfig} from '../typings';

const LocalMockConfig: AppConfig = {
    config: {
        cookieDomain: 'x.y.z',
        debug: false,
        api: {},
        appBasepath: '/',
        cdnBasepath: '',
        distributionChannel: 'local-mock'
    }
};

const mockSSR = () => {
    jest.mock('./utils.ts', () => ({
        isSSR: jest.fn(() => true),
    }));
};

describe('config test', () => {
    beforeEach(() => jest.mock('memoize-one', () => jest.fn((_) => (...args) => _(...args))))

    afterEach(() => jest.unmock('./utils.ts'));

    test('calling getAppConfig on SSR with no addConfig should throw', async () => {
        mockSSR();
        const {getAppConfig} = await import('./getAppConfig');
        expect(() => getAppConfig()).toThrow(
            'you must call addConfig with your distribution local-mock before any getAppConfig usage'
        );
    });

    test('calling addConfig on SSR will make getAppConfig not to throw', async () => {
        mockSSR();
        const {getAppConfig, addConfig} = await import('./getAppConfig');
        addConfig({'local-mock': LocalMockConfig});
        expect(getAppConfig()).toStrictEqual(LocalMockConfig);
    });

});
