/**
 * @file omit
 */
import {omit as _omit} from 'lodash-es'

export function omit<T extends unknown, K extends Array<keyof T>>(obj: T, keys: K) {
    return _omit(obj as Record<string, any>, keys) as Omit<T, K[number]>
}
