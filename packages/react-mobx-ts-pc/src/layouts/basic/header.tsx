import {Ref, useCallback, forwardRef} from 'react';
import {Menu, Avatar} from 'antd';
import {safeInvoke} from 'src/utils/libs';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import subHead from './subhead.svg';
import {useMenu} from './menu';

interface HeaderContentProps {
}

interface InnerHeaderContentProps extends HeaderContentProps, RouteComponentProps {
    refHeader?: Ref<HTMLDivElement>;
}

const InnerHeaderContent = withRouter((props: InnerHeaderContentProps) => {
    const {menu, selectedIds} = useMenu(props);

    const logout = useCallback(() => {
        // console.log('logout')
        // @todo 根据项目情况处置
        console.log('logout 未实现');
    }, []);
    const userMenu = [
        {
            id: 'lang',
            label: '语言/Language',
            children: [
                {
                    id: 'zh_cn',
                    label: '中文',
                    selected: props.locale === 'zh_cn',
                    onClick: () => {
                        safeInvoke(props.onChangeLocale, 'zh_cn');
                    },
                },
                {
                    id: 'en_us',
                    label: 'English',
                    selected: props.locale === 'en_us',
                    onClick: () => {
                        safeInvoke(props.onChangeLocale, 'en_us');
                    },
                },
            ],
        },
        {
            id: 'logout',
            label: '退出/Logout',
            onClick: logout,
        },
    ];
    return (
        <div className="app-header" ref={props.refHeader}>
            <div>头部信息</div>
            <Menu theme="dark" mode="horizontal" selectedKeys={selectedIds} items={menu} />
        </div>
    );
});

export const Header = forwardRef<HTMLDivElement, HeaderContentProps>(
    (props, ref) => <InnerHeaderContent refHeader={ref} {...props} />
);
Header.displayName = 'Header';
