import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'src/custom.scss';
import App from 'src/View/App';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
