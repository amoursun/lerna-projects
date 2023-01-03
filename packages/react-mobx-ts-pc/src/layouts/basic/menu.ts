import {ReactNode} from 'react';
import {matchPath, RouteComponentProps} from 'react-router-dom';
import {pick} from 'src/utils/libs';
import {parsePageUrl, urlUtils} from '../../utils';
import {SITE_MAP, SiteNode} from '../../common';

const getMenuItemKey = (entry: string, path: string) => `${entry}${path}`;

interface MenuResult {
    menu: any[];
    selectedIds: string[];
}

export const useMenu = (routeProps: RouteComponentProps): MenuResult => {
    const {entry: currentEntry} = parsePageUrl() || {};
    const makeMenuItem = (siteNode: SiteNode): any => {
        const {label, children, icon, path = '', entry = ''} = siteNode;
        const id = getMenuItemKey(entry, path);

        const _children = children && children.filter(n => !n.isAbsentFromMenu).map(makeMenuItem);

        const sideNavProps: any = {
            id,
            icon,
            children: _children && _children.length ? _children : undefined,
            label: (typeof label === 'function' ? label(routeProps) : label) as ReactNode,
            href: path ? urlUtils.getPageLink(path, {}, {entry}) : undefined,
        };

        return sideNavProps;
    };

    const selectedIds: string[] = [];
    const findSelected = ((siteNode: SiteNode): boolean => {
        const found = !!(
            siteNode.children && siteNode.children.some(findSelected)
            || matchPath(routeProps.location.pathname, pick(siteNode, ['path']))
        );
        if (found && !selectedIds.length && !siteNode.isAbsentFromMenu) {
            selectedIds.push(getMenuItemKey(siteNode.entry!, siteNode.path!));
        }

        return found;
    });

    findSelected(SITE_MAP.children!.find(siteNode => siteNode.entry === currentEntry)!);

    return {
        menu: SITE_MAP.children!.filter(n => !n.isAbsentFromMenu).map(makeMenuItem).filter(Boolean),
        selectedIds,
    };
};
