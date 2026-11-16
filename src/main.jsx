import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './context/ThemeProvider'
import { LangProvider } from './context/LangProvider'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <BrowserRouter>
      <ThemeProvider>
        <LangProvider>
          <App />
        </LangProvider>
      </ThemeProvider>
    </BrowserRouter>
  </HelmetProvider>
)
