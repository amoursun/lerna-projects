import {useEffect} from 'react';
import ReactMarkdown from 'react-markdown';

import './style.mod.scss';

import readme from '!!raw-loader!../../../../README.md';


export const MainHomePage = () => {
    return (
        <div styleName={'home-page'}>
            <ReactMarkdown>{readme}</ReactMarkdown>
        </div>
    );
};

export default MainHomePage;
