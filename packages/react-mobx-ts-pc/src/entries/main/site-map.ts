import {matchPath, RouteComponentProps} from 'react-router-dom';
import {t} from '../../i18n';

export const ENTRY_MAIN = 'main';
export const SITE_NODE_MAIN_HOME = {
    label: () => t('common.module_main.page_home'),
    path: '/home',
    entry: ENTRY_MAIN,
};

export interface SiteNodeMainSomeDetailParams {
    id: string;
}

export const SITE_NODE_MAIN_SOME_DETAIL = {
    label: (props: RouteComponentProps) => {
        const {location} = props;
        const {params} = matchPath<SiteNodeMainSomeDetailParams>(location.pathname, {
            path: SITE_NODE_MAIN_SOME_DETAIL.path,
        }) || {};

        return `${t('common.module_main.page_detail')}_${params!.id}`;
    },
    path: '/detail/:id',
    entry: ENTRY_MAIN,
    isAbsentFromMenu: true,
};

export const SITE_NODE_MAIN_SOME_LIST = {
    label: () => t('common.module_main.page_list'),
    path: '/list',
    entry: ENTRY_MAIN,
    children: [
        SITE_NODE_MAIN_SOME_DETAIL,
    ],
};


export const SITE_MAP_MAIN = {
    entry: ENTRY_MAIN,
    label: () => t('common.module_main'),
    children: [
        SITE_NODE_MAIN_HOME,
        SITE_NODE_MAIN_SOME_LIST,
    ],
};
