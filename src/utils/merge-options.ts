export function mergeDefaultAndLoaded<T extends Record<string, unknown>>(loaded: T | undefined, defaults: T): T {
    if (!loaded) {
        return defaults;
    }
    const entries = Object.entries(defaults);
    const res = entries.map(([key, defaultValue]) => [key, loaded[key] !== undefined ? loaded[key] : defaultValue]);
    return Object.fromEntries(res);
}
