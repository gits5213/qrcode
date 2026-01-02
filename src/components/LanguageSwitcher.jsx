import { useLanguage } from '../i18n/LanguageContext'
import './LanguageSwitcher.css'

function LanguageSwitcher() {
  const { language, changeLanguage, t } = useLanguage()

  return (
    <div className="language-switcher">
      <label htmlFor="language-select">{t('language')}:</label>
      <select
        id="language-select"
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-select"
      >
        <option value="en">English</option>
        <option value="bn">বাংলা</option>
      </select>
    </div>
  )
}

export default LanguageSwitcher

