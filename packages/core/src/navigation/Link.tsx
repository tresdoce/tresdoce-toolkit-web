import React from 'react';
import {Link as ReachLink} from '@reach/router';
import { getBasepath, normalizeUrl } from './navigate';

export const Link = ({
                         to = '',
                         children,
                         absolute,
                         normalize = true,
                         ...props
                     }) => {
    if (!absolute && to[0] === '/') {
        to = getBasepath() + to;
    }

    return (
        <ReachLink {...props} to={normalize ? normalizeUrl(to) : to}>
            {children}
        </ReachLink>
    );
};
