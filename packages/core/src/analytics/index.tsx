/* eslint-disable */
import { globalHistory } from '@reach/router';
import React from 'react';

export type GoogleAnalyticsProps = {
    auth: string;
    preview: string;
    cookies: string;
    measurementId: string;
    debug: boolean;
};

const defaultOptions = { debug: false };

class GoogleAnalytics extends React.Component<GoogleAnalyticsProps> {
    static displayName = 'GoogleAnalytics';

    static defaultProps = {
        debug: false,
    };

    static Events = {
        PAGEVIEW: 'pageview',
        OPERATION_SUCCESS: 'operationSuccess',
    };

    static pageview(to, options = defaultOptions) {
        const w: any = window;

        if (w.ga) {
            if (options.debug) {
                console.info(`GoogleAnalytics - sending pageview for ${to}`);
            }

            w.ga('gtm36.send', GoogleAnalytics.Events.PAGEVIEW, { page: to });
        }
    }

    static event(name, values, options = defaultOptions) {
        const w: any = window;

        if (w.dataLayer) {
            if (options.debug) {
                console.info(`GoogleAnalytics - sending event ${name} for`, values);
            }

            w.dataLayer.push({
                event: name,
                ...values,
            });
        }
    }

    componentDidMount() {
        const w: any = window;

        if (!w.ga) {
            this.loadAnalytics(this.props);
            GoogleAnalytics.pageview(window.location.pathname, {
                debug: this.props.debug,
            });
        }

        globalHistory.listen((url: any) => {
            GoogleAnalytics.pageview(url.location.pathname, {
                debug: this.props.debug,
            });
        });
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.measurementId !== prevProps.measurementId ||
            this.props.auth !== prevProps.auth ||
            this.props.preview !== prevProps.preview
        ) {
            this.loadAnalytics(this.props);
            GoogleAnalytics.pageview(window.location.pathname, {
                debug: this.props.debug,
            });
        }
    }

    loadAnalytics = props => {
        (function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
            let f = d.getElementsByTagName(s)[0],
                j: any = d.createElement(s),
                dl = l !== 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}&gtm_auth=${props.auth}&gtm_preview=${props.preview}&gtm_cookies_win=${props.cookies}`;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', props.measurementId);

        (function(i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            (i[r] =
                i[r] ||
                function() {
                    (i[r].q = i[r].q || []).push(arguments);
                }),
                (i[r].l = 1 * (new Date() as any));
            (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m);
        })(
            window,
            document,
            'script',
            'https://www.google-analytics.com/analytics.js',
            'ga'
        );
    };

    render() {
        return false;
    }
}

export default GoogleAnalytics;
