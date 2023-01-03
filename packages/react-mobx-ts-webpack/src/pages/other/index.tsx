import React, { Component } from 'react';
import './style.less';

interface Props {
}

class Other extends Component<Props> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <main className="other">
                {'other page'}
            </main>
        );
    }
}

export default Other;
