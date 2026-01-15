import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { LanguageProvider } from './i18n/LanguageContext'
import './index.css'

// Suppress browser extension messaging errors (harmless but noisy)
const originalError = console.error
console.error = (...args) => {
  const errorMessage = args[0]?.toString() || ''
  // Filter out common browser extension messaging errors
  if (
    errorMessage.includes('Could not establish connection') ||
    errorMessage.includes('Receiving end does not exist') ||
    errorMessage.includes('message channel closed') ||
    errorMessage.includes('asynchronous response')
  ) {
    return // Suppress these errors
  }
  originalError.apply(console, args)
}

// Also suppress runtime.lastError warnings
const originalWarn = console.warn
console.warn = (...args) => {
  const warnMessage = args[0]?.toString() || ''
  if (
    warnMessage.includes('runtime.lastError') ||
    warnMessage.includes('message channel closed') ||
    warnMessage.includes('asynchronous response')
  ) {
    return // Suppress these warnings
  }
  originalWarn.apply(console, args)
}

// Suppress unhandled promise rejections from browser extensions
window.addEventListener('unhandledrejection', (event) => {
  const errorMessage = event.reason?.message || event.reason?.toString() || ''
  if (
    errorMessage.includes('Could not establish connection') ||
    errorMessage.includes('Receiving end does not exist') ||
    errorMessage.includes('message channel closed') ||
    errorMessage.includes('asynchronous response')
  ) {
    event.preventDefault() // Suppress these unhandled rejections
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
)

