import React from 'react';

// 服务 & 左侧跳转系统连接
export interface baseServiceProps {
    code?: string;
    name?: React.ReactNode;
    url?: string;
    path?: string;
    childNodes?: baseServiceProps[];
}
