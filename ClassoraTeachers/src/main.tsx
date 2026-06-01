import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallBack from './components/ErrorFallBack.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode >
    <ErrorBoundary
      FallbackComponent={ErrorFallBack}
      onReset={()=> window.location.replace("/")}>
      <App/>
    </ErrorBoundary>
  </StrictMode>,
)
