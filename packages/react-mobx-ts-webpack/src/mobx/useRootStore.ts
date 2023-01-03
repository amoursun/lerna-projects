import React from 'react';
import * as rootStore from 'mobx/rootStore';

const storeContext = React.createContext<IStore>({ ...rootStore });

export const useRootStore = () => {
    const store = React.useContext(storeContext);
    if (!store) {
        throw new Error('useStore must be used within a StoreProvider.');
    }
    return store;
};
