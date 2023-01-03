import {useCallback} from 'react';
import { Button, message } from 'antd';

import {t} from '../../../i18n';

import './style.mod.scss';

export function OtherHomePage() {
    const handleClickBtn = useCallback(() => {
        message.success('Good to go');
    }, []);

    return (
        <div styleName={'home-page'}>
            <h3>{t('common.module_other.page_home')}</h3>
            <h4>{t('other.greeting_words', '同学')}</h4>
            <Button onClick={handleClickBtn} type={'primary'}>GO!</Button>
        </div>
    );
}

export default OtherHomePage;
