import {ComponentType, LazyExoticComponent} from 'react';
import {render} from 'react-dom';
import {RouteProps} from 'react-router-dom';
import {configure} from 'mobx';
import {DictLoader, loadI18nAssentsAsync} from '../i18n';

export interface RouteItem extends RouteProps {
    key?: string;
    path: string;
    component?: ComponentType | LazyExoticComponent<ComponentType<any>>;
}

configure({enforceActions: 'always'});

export async function start(App: ComponentType, dict?: DictLoader) {
    dict && await loadI18nAssentsAsync(dict);
    render(
        <App />,
        document.getElementById('app')
    );
}
