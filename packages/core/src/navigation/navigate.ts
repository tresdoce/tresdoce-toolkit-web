import { navigate as reachNavigate } from '@reach/router';

import { getAppConfig } from '../config';

export const getBasepath = () => {
    const { config } = getAppConfig();
    return config.appBasepath && config.appBasepath[0] !== '/'
        ? `/${config.appBasepath}`
        : config.appBasepath;
};

export function normalizeUrl(url) {
    return url
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ /g, '-')
        .toLowerCase();
}

export function navigate(to, options?, normalize = true, absolute = false) {
    if (!absolute && to[0] === '/') {
        to = getBasepath() + to;
    }

    reachNavigate(normalize ? normalizeUrl(to) : to, options);
}
