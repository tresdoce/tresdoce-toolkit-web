
export interface ApiConfig {
    /** Basepath URI of the api, for example `"https://x.api.domain.com.ar"` */
    basepath: string;
    url?: string;
    withCredentials?: boolean;
}

export interface Config {
    /** Determines if is on debug mode, useful for Logging detailed interactions */
    debug: boolean;
    /** Domain base for services cookies, usually `".domain.com.ar"` on development or production */
    cookieDomain: string;
    /** Distribution Channel, on local development may be `"local-mock"` or `"local-dev"` */
    distributionChannel: string;
    /**
     * Basepath for the SPA
     * example: `""` is for running on base pathname,
     * `"/spa/ini"` is for running the SPA starting at `/spa/ini`
     */
    appBasepath: string;
    /** Basepath for the CDN for Assets */
    cdnBasepath: string;
    /** API Endpoints configuration */
    api: {
        [key: string]: ApiConfig;
    };
}

export interface AppConfig {
    config: Config;
}
