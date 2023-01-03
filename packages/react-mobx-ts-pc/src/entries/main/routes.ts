import React from 'react';
import {RouteItem} from '../../common';
import {
    SITE_NODE_MAIN_HOME,
    SITE_NODE_MAIN_SOME_LIST,
    SITE_NODE_MAIN_SOME_DETAIL,
} from './site-map';

export const routes: RouteItem[] = [
    {
        key: 'main-home',
        path: SITE_NODE_MAIN_HOME.path,
        component: React.lazy(() => import('./home/page')),
    }, {
        key: 'main-some-list',
        path: SITE_NODE_MAIN_SOME_LIST.path,
        component: React.lazy(() => import('./some-list/page')),
    }, {
        key: 'main-some-detail',
        path: SITE_NODE_MAIN_SOME_DETAIL.path,
        component: React.lazy(() => import('./some-detail/page')),
    },
];
