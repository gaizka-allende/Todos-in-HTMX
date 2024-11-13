import i18next from 'i18next'

import en from './locales/en.json'
import es from './locales/es.json'

export default (async () => {
  await i18next.init({
    resources: {
      en: {
        translation: en,
      },
      es: {
        translation: es,
      },
    },
  })
  return i18next
})()

export let t = i18next.getFixedT('en')
