import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'src/custom.scss';
import App from 'src/View/App';
import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
);
