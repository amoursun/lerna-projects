import {Dayjs} from 'dayjs';

export {Dayjs};
export declare type BaseObject = Record<string, any>;
export interface StringIndexedObject<T = string> {
    [key: string]: T;
}