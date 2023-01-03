import './style.mod.scss';
import { SearchOutlined } from '@ant-design/icons';
import {Button} from 'antd';
import {t} from '../../../i18n';

export function OtherSomeListPage() {
    return (
        <div styleName={'some-list-page'}>
            <h3>{t('common.module_other.page_list')}</h3>
            <Button icon={<SearchOutlined />}>查询</Button>
        </div>
    );
}

export default OtherSomeListPage;
