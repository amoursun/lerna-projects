import React, { Component } from 'react';
import './style.less';

interface Props {
}

class Home extends Component<Props> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <main className="home">
                {'home page'}
            </main>
        );
    }
}

export default Home;
