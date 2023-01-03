import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { DatePicker } from 'antd';
import { store } from './store';

import './style.less';

interface Props {}
@observer
class Home extends Component<Props> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div>数量: {store.amount}</div>
                <button onClick={() => store.add('amount')}>add</button>
                <button onClick={() => store.reduce('amount')}>reduce</button>
                <div>价格: {store.price}</div>
                <button onClick={() => store.add('price')}>add</button>
                <button onClick={() => store.reduce('price')}>reduce</button>
                <div>总花费: {store.total}</div>

                <DatePicker />
            </div>
        );
    }
}

export default Home;
