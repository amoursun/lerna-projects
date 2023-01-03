import './style.mod.scss';

import { Anchor } from 'antd';
import {t} from '../../../i18n';
import {urlUtils} from '../../../utils';

const list = ['123', '456'];
const { Link } = Anchor;
export function MainSomeListPage() {
    return (
        <div styleName={'some-list-page'}>
            <h3>{t('common.module_main.page_list')}</h3>
            <ul>
                {list.map(id => (
                    <li key={id}>
                        <Link href={urlUtils.getPageLink(`/detail/${id}`)}>detail_{id}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MainSomeListPage;
