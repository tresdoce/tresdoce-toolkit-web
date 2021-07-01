import * as Config from '../config';

const isDebug = () => {
    try {
        const { config } = Config.getAppConfig();
        return config.debug
    } finally {
        return true; // by default is on debug mode
    }
}

export const warn = (...args) => {
    if (isDebug()) {
        console.warn(...args);
    }
};

export const info = (...args) => {
    if (isDebug()) {
        // eslint-disable-next-line no-console
        console.info(...args);
    }
};

export const debug = (...args) => {
    if (isDebug()) {
        // eslint-disable-next-line no-console
        console.debug(...args);
    }
};

export const error = (...args) => {
    if (isDebug()) {
        console.error(...args);
    }
};
