import { createInertiaApp  } from '@inertiajs/react';
import type {ResolvedComponent} from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'SMM Poltekpar Palembang';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name: string): ResolvedComponent => {
        const pages = import.meta.glob<ResolvedComponent>('./pages/**/*.tsx', { eager: true });
        const page = pages[`./pages/${name}.tsx`];

        if (!page) {
            throw new Error(`Page not found: ${name}`);
        }

        return page;
    },
    setup({ el, App, props }) {
        if (el) {
            createRoot(el).render(<App {...props} />);
        }
    },
    progress: {
        color: '#4B5563',
    },
});
