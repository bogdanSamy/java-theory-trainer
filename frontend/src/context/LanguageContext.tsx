import { createContext, useContext, useState, ReactNode } from 'react'

export type Language = 'en' | 'ro'

interface LanguageContextType {
  lang: Language
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextType>({ lang: 'en', toggleLang: () => {} })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() =>
    (localStorage.getItem('lang') as Language) || 'en'
  )
  const toggleLang = () => {
    setLang(l => {
      const next = l === 'en' ? 'ro' : 'en'
      localStorage.setItem('lang', next)
      return next
    })
  }
  return <LanguageContext.Provider value={{ lang, toggleLang }}>{children}</LanguageContext.Provider>
}

export function useLang() { return useContext(LanguageContext) }
