import React from 'react';
import {RouteProps} from 'react-router-dom';

export interface RouteItem extends RouteProps {
    key?: string;
    label?: string | (() => string);
    path: string;
    entry?: string;
    component?: React.ComponentType | React.LazyExoticComponent<React.ComponentType<any>>;
}