/**
 * @file isPromiseLike
 */
export function isPromiseLike<T = any>(maybePromise: any): maybePromise is Promise<T> {
    return (typeof maybePromise === 'object' || typeof maybePromise === 'function')
        && typeof maybePromise.then === 'function'
        && typeof maybePromise.finally === 'function'
}
