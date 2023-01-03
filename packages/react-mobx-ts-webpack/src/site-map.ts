export const ENTRY_MAIN = 'main';
export const MAIN_HOME = {
    label: () => '首页',
    path: '/home',
    entry: ENTRY_MAIN,
};
export const MAIN_OTHER = {
    label: () => '其他',
    path: '/other',
    entry: ENTRY_MAIN,
};

export const MAIN_SOME_LIST = {
    label: () => '列表',
    path: '/list',
    entry: ENTRY_MAIN,
    children: [
        MAIN_HOME,
        MAIN_OTHER
    ],
};


export const SITE_MAP_MAIN = {
    entry: ENTRY_MAIN,
    label: () => '主页',
    children: [
        MAIN_HOME,
        MAIN_OTHER,
        MAIN_SOME_LIST,
    ],
};
