import React, { useCallback } from 'react';
import c from 'classnames';
import './style.less';

interface PageProps {
    className?: string;
    renderHeader: () => React.ReactNode | null;
    renderSidebar: () => React.ReactNode | null;
    renderContent: () => React.ReactNode | null;
    renderFooter: () => React.ReactNode | null;
}

export const Page = (props: PageProps) => {
    const { className, renderContent, renderFooter, renderSidebar, renderHeader } = props;

    return (
        <div className={c('main-app-wrapper', className)}>
            <div className="main-app-header">{renderHeader && renderHeader()}</div>
            <div className="main-app-content-wrap">
                <div className="main-app-sidebar">{renderSidebar && renderSidebar()}</div>
                <div className="main-app-content">{renderContent && renderContent()}</div>
            </div>
            <div className="main-app-footer">{renderFooter && renderFooter()}</div>
        </div>
    );
};
