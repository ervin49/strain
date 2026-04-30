import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import Index from './Index.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Index />
    </StrictMode>
)