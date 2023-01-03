import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { BasicLayout } from 'components/layout/layput';
import { routes } from './routes';

const App = () => <BasicLayout routes={routes} />;

const container: Element | DocumentFragment | null = document.getElementById('root');
const root = createRoot(container as Element | DocumentFragment);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
