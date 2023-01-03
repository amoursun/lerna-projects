/*
 * 私有路由页面
 */

import React, { lazy } from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';
import {withRouter} from 'components/hooks';
import {omit} from 'lodash';

// const Error = lazy(() => import('pages/user/error'));
const Loading = () => <div>loading...</div>;

export interface BaseRouteProps {
    routes?: BaseRouteProps[];
    /**
     * 使用 path="*"" 意味着 "匹配所有路径", 不需要明确地列出别的路径
     */
    path: string;
    index?: boolean;
    element: any; // React.LazyExoticComponent<>;
}
               
export const privateRoute = (route: BaseRouteProps, idx?: number) => {
    const {
        path,
        element: PageComponent,
    } = route;
    const routes = route.routes || [];
    const element = <React.Suspense fallback={<Loading />}>{<PageComponent />}</React.Suspense>;
    const _route = {
        key: path,
        path: path,
        element: element,
    }
    return <Route {..._route}>{routes.map(privateRoute)}</Route>;
};
