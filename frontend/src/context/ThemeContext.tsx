import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ThemeContextType {
  dark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({ dark: false, toggleTheme: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState<boolean>(() =>
    localStorage.getItem('theme') === 'dark'
  )
  useEffect(() => {
    document.body.classList.toggle('dark', dark)
  }, [dark])
  const toggleTheme = () => {
    setDark(d => {
      const next = !d
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }
  return <ThemeContext.Provider value={{ dark, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() { return useContext(ThemeContext) }
