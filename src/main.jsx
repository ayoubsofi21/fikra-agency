import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './context/ThemeProvider'
import { LangProvider } from './context/LangProvider'
import App from './App'
import { AdminAuthProvider } from './admin/context/AdminAuthContext'
import { ToastProvider } from './admin/components/Toast'
import './index.css'

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <BrowserRouter>
      <ThemeProvider>
        <LangProvider>
          <AdminAuthProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </AdminAuthProvider>
        </LangProvider>
      </ThemeProvider>
    </BrowserRouter>
  </HelmetProvider>
)
