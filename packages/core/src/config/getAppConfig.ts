import { AppConfig } from '../typings';
import memoizeOne from 'memoize-one';
import idx from 'idx';
import merge from 'deepmerge';
import { isSSR } from './utils';

interface EnvironmentsConfig {
    [key: string]: AppConfig
}

let spaConfig: EnvironmentsConfig | {} = {};

export const addConfig = (config: EnvironmentsConfig) => {
    spaConfig = config;
};

const getDistributionChannel = () => {
    if (isSSR()) {
        return process.env.ENV || 'local-mock';
    } else {
        const distributionChannel = idx(window, _ => _.__NEXT_DATA__.props.pageProps.config.distributionChannel);
        if (distributionChannel) {
            return distributionChannel;
        }
        throw new Error('Distribution channel not specified');
    }
};

export const getAppConfig = memoizeOne(
    (): AppConfig => {
        const distributionChannel = getDistributionChannel();

        if (isSSR()) {
            if (spaConfig[distributionChannel] === undefined) {
                throw new Error(
                    `you must call addConfig with your distribution ${distributionChannel} before any getAppConfig usage`
                );
            }
            return spaConfig[distributionChannel];
        } else {
            const serverSideConfig =
                idx(window, _ => _.__NEXT_DATA__.props.pageProps) || {};

            return merge(serverSideConfig, spaConfig[distributionChannel] || {});
        }
    }
);
