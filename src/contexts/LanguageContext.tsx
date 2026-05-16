import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Language, Translations, translations } from '@/i18n/translations'
import { loadLanguage, saveLanguage } from '@/services/storageService'

type LanguageContextType = {
  lang: Language
  t: Translations
  setLang: (lang: Language) => Promise<void>
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ja',
  t: translations.ja,
  setLang: async () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ja')

  useEffect(() => {
    loadLanguage().then(stored => {
      if (stored) setLangState(stored)
    })
  }, [])

  const setLang = useCallback(async (newLang: Language) => {
    await saveLanguage(newLang)
    setLangState(newLang)
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
