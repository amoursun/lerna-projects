import React, {useCallback} from 'react';
import c from 'classnames';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu} from 'antd';
import './style.scss';

const { Header, Content, Sider, Footer } = Layout;

interface PageProps {
    className?: string;
    renderHeader: () => React.ReactNode | null;
    renderSidebar: () => React.ReactNode | null;
    renderBreadcrumb: () => React.ReactNode | null;
    renderContent: () => React.ReactNode | null;
    renderFooter: () => React.ReactNode | null;
}

export const Page = (props: PageProps) => {
    const {
        className,
        renderContent,
        renderFooter,
        renderSidebar,
        renderHeader,
        renderBreadcrumb,
    } = props;

    return (
        <div className={c("main-app-wrapper", className)}>
            <Layout>
                <Header className="header">
                    {renderHeader && renderHeader()}
                </Header>
                <Layout>
                    {renderBreadcrumb && renderBreadcrumb()}
                    {renderSidebar && renderSidebar()}
                    <Layout className={'main-app-wrapper-content'}>
                        {renderContent && renderContent()}
                    </Layout>
                </Layout>
                {renderFooter && <Footer>{renderFooter()}</Footer>}
            </Layout>
        </div>
    );
};