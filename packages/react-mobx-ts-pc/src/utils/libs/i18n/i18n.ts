import {cloneDeep, codeWarningOnce, merge, snakeCase} from '../tools';
import {Cookies} from '../cookies';

export const I18N_DEFAULT_LOCALE = 'zh_cn';
export const I18N_DEFAULT_EXPIRED_DAY = 365;
export const I18N_LOCALE_COOKIE_KEY = 'befe_lib_i18n_locale';

type LocaleTextHandler = (...args: any[]) => string;
export type LocaleText = string | LocaleTextHandler;

/**
 * 字典通用结构（预留）
 *
 * localeDict.level_0.level_1.level_2.level_...
 */
export interface CommonDict {
    [key: string]: LocaleText | CommonDict;
}

/**
 * _locale 字典结构
 */
export interface LocaleDict {
    [key: string]: LocaleText;
}

/**
 * i18n 字典标准结构
 * @public
 */
export interface I18nDict {
    [locale: string]: LocaleDict;
}

/**
 * @public
 */
export interface I18nOptions {
    /**
     * 语言地区
     * @default zh_cn
     */
    locale?: string;

    /**
     * 词库集
     */
    dict?: I18nDict;

    /**
     * cookie 记录 locale 设置值的时效
     *
     * @default 365
     */
    expiredDay?: number;
}

/**
 * @public
 */
export type I18nAPI = Partial<{
    /**
     * 语言地区
     */
    readonly locale: string;

    /**
     * 词库集
     */
    readonly dict: I18nDict;

    /**
     * @deprecated 0.1.19
     *
     * use t instead
     */
    i: (key: string, ...args: any[]) => string;

    /**
     * 获取国际化文本
     *
     * aka getLocalText
     */
    t: (key: string, ...args: any[]) => string;

    /**
     * 获取国际化文本
     */
    getLocalText: (key: string, ...args: any[]) => string;

    /**
     * 设置当前 locale
     *
     * 标准为 snake_case，设置前会自行进行转换
     */
    setLocale: (locale: string, localeDictToExtend?: LocaleDict) => void;

    /**
     * 扩展词库
     */
    extendDict: (dict: I18nDict) => void;

    /**
     * 覆盖设置词库
     */
    setDict: (dict: I18nDict) => void;

    /**
     * 扩展当前 locale 词库
     */
    extendLocaleDict: (localeDict: LocaleDict) => void;

    /**
     * 覆盖当前 locale 词库
     */
    setLocaleDict: (localeDict: LocaleDict) => void;
}>;

export class I18n implements I18nAPI {
    private _locale = I18N_DEFAULT_LOCALE;
    private _dict: I18nDict = {
        [I18N_DEFAULT_LOCALE]: {},
    };
    readonly _expiredDay: number = I18N_DEFAULT_EXPIRED_DAY;

    get locale() {
        return this._locale;
    }

    get dict() {
        return this._dict;
    }

    constructor(options: I18nOptions = {}) {
        const {
            locale = Cookies.get(I18N_LOCALE_COOKIE_KEY) || I18N_DEFAULT_LOCALE,
            dict,
            expiredDay = I18N_DEFAULT_EXPIRED_DAY,
        } = options;

        this._expiredDay = expiredDay;
        this.setLocale(locale);
        if (dict) {
            this.extendDict(dict);
        }

        // this.setLocale = this.setLocale.bind(this);
        // this.getLocaleText = this.getLocaleText.bind(this);
        // this.i = this.i.bind(this);
        // this.t = this.t.bind(this);
    }

    get localeDict() {
        return this._dict[this._locale] || {};
    }

    private updateCookie() {
        Cookies.set(I18N_LOCALE_COOKIE_KEY, this._locale, {
            expires: this._expiredDay,
            path: '',
        });
    }

    setLocale = (locale: string, localeDictToExtend?: LocaleDict) => {
        const _locale = snakeCase(locale);
        this._locale = _locale;
        if (typeof localeDictToExtend === 'object') {
            this.extendLocaleDict(localeDictToExtend);
        }
        this.updateCookie();
    };

    extendDict = (dict: I18nDict) => {
        merge(this._dict, dict);
    };

    setDict = (dict: I18nDict) => {
        this._dict = cloneDeep(dict);
    };

    setLocaleDict = (localeDict: LocaleDict) => {
        this._dict[this._locale] = cloneDeep(localeDict);
    };

    extendLocaleDict = (localeDict: LocaleDict) => {
        if (this._dict[this._locale]) {
            merge(this._dict[this._locale], localeDict);
        } else {
            this.setLocaleDict(localeDict);
        }
    };

    getLocaleText = (key: string, ...args: any[]) => {
        const text = this.localeDict[key];


        codeWarningOnce(
            key in this.localeDict,
            `[i18n]: \`${key}\` is not found in \`dict.${this._locale}\``,
        );

        if (typeof text === 'function') {
            return text(...args);
        }

        if (typeof text === 'string') {
            return text.replace(
                /\$\{(\d+)\}/g,
                (match, p) => args[parseInt(p, 10) - 1] as string,
            );
        }

        return `__${key}__`;
    };

    /* istanbul ignore next */
    i = (key: string, ...args: any[]) => {
        return this.getLocaleText(key, ...args);
    };

    t = (key: string, ...args: any[]) => {
        return this.getLocaleText(key, ...args);
    };
}
