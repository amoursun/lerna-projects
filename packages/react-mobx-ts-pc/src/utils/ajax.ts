import {
    createAjax as _createAjax,
    AjaxError,
    AjaxRequestConfig,
    AjaxResponse,
    AjaxInstance,
} from './libs/ajax';
import {message} from 'antd';

// @todo [sack] 待确定规范
// @todo 根据项目情况处置
const RESPONSE_STATUS_LIST = [
    'ok',
    'fail',
    // 'warning',
    'need-login',
    'need-logout',
    'no-auth',
    'invalid-response',
    'request-failed',
] as const;


interface RequestConfig extends AjaxRequestConfig {
    silent?: boolean;
}

type BaseResponseJson = Omit<ResponseJSON, 'response'>;
type Response = AjaxResponse<BaseResponseJson>;


interface ResponseJSON<Data = Record<string, any>> {
    status?: (typeof RESPONSE_STATUS_LIST)[number];
    data: Data;
    message?: string;
    error?: AjaxError | Error;
    response?: Response;
}

function isInvalidResponse(response?: Response) {
    const data = response?.data;
    return (!data
        || typeof data !== 'object'
        || !Object.keys(data).length
        || (data.status && !RESPONSE_STATUS_LIST.includes(data.status)));
}

export function createAjax(config: RequestConfig) {
    const decoratedAjax = _createAjax<Omit<ResponseJSON, 'response'>, RequestConfig>(config);
    decoratedAjax.interceptors.response.use(
        // @ts-ignore 把结构改成我们习惯的 ResponseJson
        response => {
            const data = (response.data || {}) as BaseResponseJson;
            const config = response.config;
            const result = {
                ...data,
                response,
            } as unknown as AjaxInstance;

            if (isInvalidResponse(response)) {
                data.status = 'invalid-response';
            }
            if (data.status === 'need-login') {
                // @todo 根据项目情况处置
            }
            if (data.status === 'need-logout') {
                // @todo 根据项目情况处置
            }
            if (data.status === 'no-auth') {
                // @todo 根据项目情况处置
            }
            if (data.status !== 'ok') {
                !config.silent && message.error(data.message || '请求失败');
                return Promise.reject(result);
            }

            return result;
        },
        (error: AjaxError | Error) => {
            return Promise.reject({
                status: 'request-failed',
                error,
            });
        });

    return decoratedAjax;
}
