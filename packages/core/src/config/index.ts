declare global {
    interface Window {
        __NEXT_DATA__: any;
        IsStandAlone:any;
        ENV:any
    }
}

export { getAppConfig, addConfig } from './getAppConfig';
export * from './utils'
