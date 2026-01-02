import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './translations'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get saved language from localStorage or default to 'bn' (Bangla)
    return localStorage.getItem('language') || 'bn'
  })

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('language', language)
  }, [language])

  const t = (key) => {
    return translations[language][key] || key
  }

  const changeLanguage = (lang) => {
    setLanguage(lang)
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

