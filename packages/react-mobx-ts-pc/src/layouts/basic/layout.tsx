import {useCallback, Suspense} from 'react';
import {HashRouter, Redirect, Route, Switch as RouteSwitch} from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, ConfigProvider} from 'antd';
import {Page} from './page';
import {i18n, setLocale} from '../../i18n';

import {RouteItem} from '../../common';
import {NotFound} from '../../components';
import {Sidebar} from './sidebar';
import {Header} from './header';
import './style.scss';
import {Breadcrumbs} from './breadcrumbs';

const Loading = () => <div>loading...</div>;

interface BasicLayoutProps {
    routes?: RouteItem[];
}

const locale = i18n.locale;
const localeDict = {};

export const BasicLayout = (props: BasicLayoutProps) => {
    const handleLocaleChange = useCallback((locale: string) => {
        setLocale(locale);
    }, []);

    const renderRoute = (route: RouteItem) => {
        return <Route key={route.key} {...route} />;
    };

    const renderHeader = () => {
        return (
            <Header />
        );
    };

    const renderSidebar = () => {
        return (
            <Sidebar />
        );
    };

    const renderBreadcrumb = () => {
        return <Breadcrumbs />;
    };

    const renderContent = () => {
        const {routes} = props;
        if (!routes) {
            return null;
        }
        const firstRoutes = routes[0];
        return (
            <div className="app-content">
                <Suspense fallback={<Loading />}>
                    <RouteSwitch>
                        <Redirect exact from="/" to={firstRoutes.path} />
                        {routes.map(renderRoute)}
                        <Route path={'/*'} component={NotFound} />
                    </RouteSwitch>
                </Suspense>
            </div>
        );
    };

    const renderFooter = () => {
        return (
            <div>Footer</div>
        );
    };

    return (
        <HashRouter>
            <ConfigProvider locale={{locale: locale, localeDict: localeDict}}>
                <Page
                    className={'app-page'}
                    renderHeader={renderHeader}
                    renderSidebar={renderSidebar}
                    renderBreadcrumb={renderBreadcrumb}
                    renderContent={renderContent}
                    renderFooter={renderFooter}
                />
            </ConfigProvider>
        </HashRouter>
    );
};

