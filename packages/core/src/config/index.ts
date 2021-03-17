declare global {
    interface Window {
        __NEXT_DATA__: any;
    }
}

export { getAppConfig, addConfig } from './getAppConfig';
export * from './utils'
