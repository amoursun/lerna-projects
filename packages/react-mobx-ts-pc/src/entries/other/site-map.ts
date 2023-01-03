import {t} from '../../i18n';

export const ENTRY_OTHER = 'other';
export const SITE_NODE_OTHER_HOME = {
    label: () => t('common.module_other.page_home'),
    path: '/home',
    entry: ENTRY_OTHER,
};

export const SITE_NODE_OTHER_SOME_LIST = {
    label: () => t('common.module_other.page_list'),
    path: '/list',
    entry: ENTRY_OTHER,
};


export const SITE_MAP_OTHER = {
    entry: ENTRY_OTHER,
    label: () => t('common.module_other'),
    children: [
        SITE_NODE_OTHER_HOME,
        SITE_NODE_OTHER_SOME_LIST,
    ],
};
