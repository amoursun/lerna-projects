import {ReactNode} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {SITE_MAP_MAIN} from '../entries/main/site-map';
import {SITE_MAP_OTHER} from '../entries/other/site-map';
/* plop.append:SITE_MAP_ENTRY_IMPORT */

export interface SiteNode {
    /**
     * 权限 key，不是必须的，没有则会调过权限校验
     */
    permissionKey?: string;

    /**
     * 显示名称
     */
    label?: ReactNode | ((routeProps: RouteComponentProps) => ReactNode);

    /**
     * icon，仅支持第一层有 icon
     */
    icon?: ReactNode;

    /**
     * 站内资源 path
     */
    path?: string;

    /**
     * 站内资源所属模块
     */
    entry?: string;

    /**
     * 站外资源地址
     */
    url?: string;

    /**
     * 子项
     */
    children?: SiteNode[];

    /**
     * 是否在 menu 中隐去
     */
    isAbsentFromMenu?: boolean;
}

export const PAGE_ERP_HOME = {
    title: () => 'ERP 首页',
    // 走全局配置
    url: '',
};

export const PAGE_HOME = {
    title: () => '首页',
};

export const SITE_MAP: SiteNode = {
    children: [
        SITE_MAP_MAIN,
        SITE_MAP_OTHER,
        /* plop.append:SITE_MAP_ENTRY_NODE */
    ],
};
