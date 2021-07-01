export const isSSR = () => typeof window === 'undefined'
interface CustomScript extends HTMLScriptElement{
    onreadystatechange : any
}
export const loadScript = url =>
    new Promise((resolve, reject) => {
        let ready = false;
        if (!document) {
            reject(new Error('Document was not defined'));
        }
        const tag = document.getElementsByTagName('script')[0];
        const script = document.createElement('script') as CustomScript;

        script.type = 'text/javascript';
        script.src = url;
        script.async = true;
        script.onreadystatechange = (a) => {
            if (!ready && (!a.readyState || a.readyState === 'complete')) {
                ready = true;
                resolve(script);
            }
        };
        script.onload = script.onreadystatechange;

        script.onerror = msg => {
            reject(new Error('Error loading script.'));
        };

        script.onabort = msg => {
            reject(new Error('Script loading aboirted.'));
        };

        if (tag.parentNode != null) {
            tag.parentNode.insertBefore(script, tag);
        }
    });
