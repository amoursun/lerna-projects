import {ajax} from './ajax';

/**
 * 获取用户信息
 * @todo 根据项目情况处置
 */
export const getUserContext = () => {
    return ajax.post('/bprouting/rest/api/user/context');
};
