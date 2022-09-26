import React from 'react';
import { createRoot } from "react-dom/client";
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Auth0ProviderWithHistory from './auth/auth0-provider-with-history';
import App from './App';

// ReactDOM.render(
//   <React.StrictMode>
//     <Router>
//         <Auth0ProviderWithHistory>
//             <App />
//         </Auth0ProviderWithHistory>
//     </Router>
//   </React.StrictMode>,
//   document.getElementById('root')
// );

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <Router>
            <Auth0ProviderWithHistory>
                <App />
            </Auth0ProviderWithHistory>
        </Router>
    </React.StrictMode>
);