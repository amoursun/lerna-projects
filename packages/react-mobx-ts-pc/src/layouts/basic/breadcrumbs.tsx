import {ReactNode} from 'react';
import {withRouter, Link, RouteComponentProps, matchPath} from 'react-router-dom';
import {pick} from 'src/utils/libs';
import {BaseObject} from 'src/types';
import { Breadcrumb, BreadcrumbProps } from 'antd';

import {SITE_MAP, SiteNode} from '../../common';
import {parsePageUrl, urlUtils} from '../../utils';

interface BreadcrumbsProps extends RouteComponentProps {
    location: any;
}
interface BreadcrumbsRoute {
    path?: string;
    breadcrumbName: string;
    children?: Omit<BreadcrumbsRoute, 'children'>[];
}

export const Breadcrumbs = withRouter((routeProps: BreadcrumbsProps) => {
    const {entry: currentEntry} = parsePageUrl() || {};
    const entrySiteMap = SITE_MAP.children!.find(site => site.entry === currentEntry);
    const data: BreadcrumbsRoute[] = [];
    const {pathname} = routeProps.location;

    const foundCurrentNode = (node: SiteNode): boolean => {
        const {label, entry, path} = node;
        const found = !!(
            node.children && node.children.some(foundCurrentNode)
            || matchPath(pathname, pick(node, ['path']))
        );

        if (found) {
            data.unshift({
                breadcrumbName: (typeof label === 'function' ? label(routeProps) : label) as ReactNode,
                path: entry && path
                    ? urlUtils.getPageLink(path, {}, {entry})
                    : undefined,
            });
        }

        return found;
    };

    entrySiteMap && foundCurrentNode(entrySiteMap);

    function itemRender(route: BreadcrumbsRoute, params: BaseObject, routes: BreadcrumbsRoute[], paths: string[]) {
        const last = routes.indexOf(route) === routes.length - 1;
        return last ? (
          <span>{route.breadcrumbName}</span>
        ) : (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        );
      }

    return <Breadcrumb itemRender={itemRender} routes={data} />;
});
