import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Link, useRoutes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { privateRoute, BaseRouteProps } from 'components/private-route';
import { Page } from './page';

interface BasicLayoutProps {
    routes: BaseRouteProps[];
}
export const BasicLayout = (props: BasicLayoutProps) => {
    const renderHeader = () => {
        return <div>Header</div>;
    };

    const renderSidebar = () => {
        return <div>Siderbar</div>;
    };

    const renderContent = () => {
        return (
            <div className="app-content">
                <Outlet />
            </div>
        );
    };

    const renderFooter = () => {
        return <div>Footer</div>;
    };

    return (
        <ConfigProvider locale={{ locale: 'zh' }}>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Page
                            className={'app-page'}
                            renderHeader={renderHeader}
                            renderSidebar={renderSidebar}
                            renderContent={renderContent}
                            renderFooter={renderFooter}
                        />
                    }
                >
                    {props.routes!.map(privateRoute)}
                </Route>
            </Routes>
        </ConfigProvider>
    );
};
