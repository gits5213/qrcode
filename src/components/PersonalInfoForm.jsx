import { useLanguage } from '../i18n/LanguageContext'
import './PersonalInfoForm.css'

function PersonalInfoForm({ personalInfo, onInfoChange }) {
  const { t } = useLanguage()
  
  const fields = [
    { key: 'fullName', labelKey: 'fullName', placeholderKey: 'placeholderFullName', type: 'text' },
    { key: 'phoneNumber', labelKey: 'phoneNumber', placeholderKey: 'placeholderPhoneNumber', type: 'tel' },
    { key: 'whatsappNumber', labelKey: 'whatsappNumber', placeholderKey: 'placeholderWhatsAppNumber', type: 'tel' },
    { key: 'personalEmail', labelKey: 'personalEmail', placeholderKey: 'placeholderPersonalEmail', type: 'email' },
    { key: 'jobEmail', labelKey: 'jobEmail', placeholderKey: 'placeholderJobEmail', type: 'email' },
    { key: 'workEmail', labelKey: 'workEmail', placeholderKey: 'placeholderWorkEmail', type: 'email' },
    { key: 'bangladeshAddress', labelKey: 'bangladeshAddress', placeholderKey: 'placeholderBangladeshAddress', type: 'textarea' },
    { key: 'usaAddress1', labelKey: 'usaAddress1', placeholderKey: 'placeholderUsaAddress1', type: 'textarea' },
    { key: 'usaAddress2', labelKey: 'usaAddress2', placeholderKey: 'placeholderUsaAddress2', type: 'textarea' },
    { key: 'trainingWebsite', labelKey: 'trainingWebsite', placeholderKey: 'placeholderTrainingWebsite', type: 'url' },
    { key: 'educationalWebsite', labelKey: 'educationalWebsite', placeholderKey: 'placeholderEducationalWebsite', type: 'url' },
    { key: 'portfolioWebsite', labelKey: 'portfolioWebsite', placeholderKey: 'placeholderPortfolioWebsite', type: 'url' },
    { key: 'lisuFoundation', labelKey: 'lisuFoundation', placeholderKey: 'placeholderLisuFoundation', type: 'url' },
    { key: 'madrashaOrphanage', labelKey: 'madrashaOrphanage', placeholderKey: 'placeholderMadrashaOrphanage', type: 'url' }
  ]

  return (
    <div className="form-container">
      <h2>{t('personalInformation')}</h2>
      <form className="personal-info-form">
        {fields.map(field => (
          <div key={field.key} className="form-group">
            <label htmlFor={field.key}>{t(field.labelKey)}</label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.key}
                value={personalInfo[field.key]}
                onChange={(e) => onInfoChange(field.key, e.target.value)}
                placeholder={t(field.placeholderKey)}
                className="form-input form-textarea"
                rows="3"
              />
            ) : (
              <input
                type={field.type}
                id={field.key}
                value={personalInfo[field.key]}
                onChange={(e) => onInfoChange(field.key, e.target.value)}
                placeholder={t(field.placeholderKey)}
                className="form-input"
              />
            )}
          </div>
        ))}
      </form>
    </div>
  )
}

export default PersonalInfoForm

