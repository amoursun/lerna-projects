import React, {ReactNode, useMemo, useCallback} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import {useMenu} from './menu';

type MenuItem = Required<MenuProps>['items'][number];
// key,
// icon,
// children,
// label,
// type,
interface MenuRouteItem {
    id: string;
    key: string | number;
    label?: string | ReactNode;
    path?: string;
    entry?: string;
    children?: MenuRouteItemChildren;
}

type MenuRouteItemChildren = MenuRouteItem[];
interface SideMenuProps {
    location: any;
}

function getItem(item: MenuRouteItem): MenuItem {
    const {
        id,
        label,
        key,
        children,
    } = item;
    return {
      key: id || key,
      children: (children || []).map(it => getItem(it)),
      label,
      type: 'group',
    } as MenuItem;
  }

export const Sidebar = withRouter((routeProps: SideMenuProps) => {
    const {menu, selectedIds} = useMenu(routeProps);

    const items: MenuItem[] = useMemo(() => {
        return menu.map((item: MenuRouteItem) => getItem(item));
    }, [menu]);

    // 待 '/' 重定向到  '/xxx' 后再进行第一次渲染，以保证默认展开，
    return routeProps.location.pathname !== '/' ? (
        <Menu
            selectedKeys={selectedIds}
            openKeys={selectedIds}
            mode="inline"
            items={items}
        />
    ) : null;
});

Sidebar.displayName = 'Sidebar';
