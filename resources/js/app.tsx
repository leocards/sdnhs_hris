import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider } from './hooks/themeProvider';

const appName = import.meta.env.VITE_APP_NAME || 'HRIS';

createInertiaApp({
    title: (title) => `${appName} ${title? '| '+title: ''}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider defaultTheme="light" storageKey="hris-theme">
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: 'transparent'//'#854d0e',
    },
});
