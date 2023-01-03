/**
 * @file pick
 */
import {pick as _pick} from 'lodash-es'

export function pick<T extends unknown, K extends Array<keyof T>>(obj: T, keys: K) {
    return _pick(obj as Record<string, any>, keys) as Pick<T, K[number]>
}

