import { action, observable, makeObservable } from 'mobx';

export default class BasicStore {
    constructor() {
        makeObservable(this);
    }
    @observable isLoading = false;

    @action changeLoading(bool: boolean) {
        this.isLoading = bool;
    }
}

