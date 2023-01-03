import {matchPath, withRouter} from 'react-router-dom';

import './style.mod.scss';

import {t} from '../../../i18n';
import {SITE_NODE_MAIN_SOME_DETAIL, SiteNodeMainSomeDetailParams} from '../site-map';

export const MainSomeDetailPage = withRouter((props) => {
    const {location} = props;
    const {params} = matchPath<SiteNodeMainSomeDetailParams>(location.pathname, {
        path: SITE_NODE_MAIN_SOME_DETAIL.path,
    }) || {};

    return (
        <div styleName={'some-detail-page'}>
            <h3>{t('common.module_main.page_detail')}</h3>
            <p>hello, it is detail {params!.id}</p>
        </div>
    );
});

export default MainSomeDetailPage;
