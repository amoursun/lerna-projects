import {API_CONTEXT} from '../constants';
import {createAjax} from '../utils';

/**
 * 通用 ajax
 */
export const ajax = createAjax({
    baseURL: API_CONTEXT,
});

// 如有需要，定制其他主题 ajax
// export const ajaxSomeTheme = createAjax({})
