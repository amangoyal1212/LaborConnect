import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <LanguageProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </LanguageProvider>
    </React.StrictMode>,
)
