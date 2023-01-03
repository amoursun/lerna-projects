import {Dayjs} from 'dayjs';
import React from 'react';
import {Pagination, PaginationProps} from 'antd';

export {Dayjs};
export declare type TypeYN = 'Y' | 'N';
export declare type TypeSN = string | number;
export declare type BaseObject = Record<string, any>;
export interface BaseOption {
    id?: string;
    label?: React.ReactNode;
    value?: string | number;
}

export interface StringIndexedObject<T = string> {
    [key: string]: T;
}

export declare type LayoutType = 'vertical' | 'horizontal';
export declare type LocaleLanguageType = 'ZHS' | 'US';

export declare type PaginationObject = Pick<PaginationProps, 'pageSize' | 'current' | 'total'>;

export interface PersonItemObject {
    personId: string;
    employeeName: string;
    orgName: string;
    email: string;

    [key: string]: number | string;
}
