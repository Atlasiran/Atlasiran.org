/** Accept only web URLs for links supplied by organization data. */
export function safeWebUrl(value) {
    if (typeof value !== 'string') return null;
    const input = value.trim();
    if (!input || /[\u0000-\u001f\u007f]/.test(input)) return null;

    try {
        const url = new URL(input);
        if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password) {
            return null;
        }
        return url.href;
    } catch {
        return null;
    }
}

/** Keep data-driven navigation on a local page. */
export function safeSitePath(value) {
    if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return null;
    if (/[\\\u0000-\u001f\u007f]/.test(value)) return null;

    try {
        const url = new URL(value, 'https://atlasiran.org');
        return url.origin === 'https://atlasiran.org' ? `${url.pathname}${url.search}${url.hash}` : null;
    } catch {
        return null;
    }
}

/** Documents may be absolute web URLs or local site paths. */
export function safeDocumentUrl(value) {
    if (typeof value !== 'string') return null;
    const input = value.trim();
    if (!input || /^[a-z][a-z\d+.-]*:/i.test(input)) return safeWebUrl(input);
    return safeSitePath(input.startsWith('/') ? input : `/${input}`);
}
