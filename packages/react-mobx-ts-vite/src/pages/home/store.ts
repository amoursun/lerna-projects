import { observable, action, computed, makeObservable } from 'mobx';

export interface StoreObject {
    amount: number;
    price: number;
    add: (type: OperateType) => void;
    reduce: (type: OperateType) => void;
    total: number;
}
type OperateType = 'amount' | 'price';

class Store {
    constructor() {
        makeObservable(this);
    }

    @observable amount = 10;
    @observable price = 55;

    @action add = (type: OperateType = 'amount') => {
        this[type] = this[type] + 1;
    };

    @action reduce = (type: OperateType) => {
        this[type] = this[type] - 1;
    };

    @computed get total() {
        return this.price * this.amount;
    }
}
export const store: StoreObject = new Store();
