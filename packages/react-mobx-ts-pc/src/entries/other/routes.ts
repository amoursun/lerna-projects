import {lazy} from 'react';
import {RouteItem} from '../../common';
import {
    SITE_NODE_OTHER_HOME,
    SITE_NODE_OTHER_SOME_LIST,
} from './site-map';

export const routes: RouteItem[] = [
    {
        key: 'other-home',
        path: SITE_NODE_OTHER_HOME.path,
        component: lazy(() => import('./home/page')),
    }, {
        key: 'other-some-list',
        path: SITE_NODE_OTHER_SOME_LIST.path,
        component: lazy(() => import('./some-list/page')),
    },
];
