// 路由配置文件
import { lazy } from 'react';

import {
    MAIN_HOME,
    MAIN_SOME_LIST,
    MAIN_OTHER,
} from './site-map';

const Other = lazy(() => import('pages/other'));
const Home = lazy(() => import('pages/home'));

export const routes = [
    {
        path: MAIN_HOME.path,
        index: true,
        element: Home
    },
    {
        path: MAIN_OTHER.path,
        element: Other,
        routes: [
            {
                path: 'home',
                element: Home
            }
        ]
    },
    {
        path: MAIN_SOME_LIST.path,
        element: Home
    },
    // {
    //     path: 'error',
    //     element: Error
    // }
];
