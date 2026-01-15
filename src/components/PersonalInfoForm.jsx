import { useLanguage } from '../i18n/LanguageContext'
import './PersonalInfoForm.css'

function PersonalInfoForm({ personalInfo, onInfoChange, onAddressChange, onAddAddress, onRemoveAddress, onEmailChange, onAddEmail, onRemoveEmail, onWebsiteChange, onAddWebsite, onRemoveWebsite }) {
  const { t } = useLanguage()
  
  const fields = [
    { key: 'fullName', labelKey: 'fullName', placeholderKey: 'placeholderFullName', type: 'text' },
    { key: 'phoneNumber', labelKey: 'phoneNumber', placeholderKey: 'placeholderPhoneNumber', type: 'tel' },
    { key: 'whatsappNumber', labelKey: 'whatsappNumber', placeholderKey: 'placeholderWhatsAppNumber', type: 'tel' },
    { key: 'linkedIn', labelKey: 'linkedIn', placeholderKey: 'placeholderLinkedIn', type: 'url' }
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
        
        {/* Dynamic Email Fields */}
        <div className="addresses-section">
          <label className="addresses-label">{t('emails')}</label>
          {personalInfo.emails.map((email, index) => (
            <div key={index} className="address-group">
              <div className="address-header">
                <label htmlFor={`email-${index}`}>{t('email')} {index + 1}</label>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => onRemoveEmail(index)}
                    className="remove-address-btn"
                    title={t('removeEmail')}
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="input-wrapper">
                <input
                  type="email"
                  id={`email-${index}`}
                  value={email}
                  onChange={(e) => onEmailChange(index, e.target.value)}
                  placeholder={t('placeholderPersonalEmail')}
                  className="form-input"
                />
                {index === personalInfo.emails.length - 1 && personalInfo.emails.length < 10 && (
                  <button
                    type="button"
                    onClick={onAddEmail}
                    className="add-item-btn"
                    title={t('addEmail')}
                  >
                    <span className="plus-icon-small">+</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Dynamic Website Fields */}
        <div className="addresses-section">
          <label className="addresses-label">{t('websites')}</label>
          {personalInfo.websites.map((website, index) => (
            <div key={index} className="address-group">
              <div className="address-header">
                <label htmlFor={`website-${index}`}>{t('website')} {index + 1}</label>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => onRemoveWebsite(index)}
                    className="remove-address-btn"
                    title={t('removeWebsite')}
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="input-wrapper">
                <input
                  type="url"
                  id={`website-${index}`}
                  value={website}
                  onChange={(e) => onWebsiteChange(index, e.target.value)}
                  placeholder={t('placeholderTrainingWebsite')}
                  className="form-input"
                />
                {index === personalInfo.websites.length - 1 && personalInfo.websites.length < 10 && (
                  <button
                    type="button"
                    onClick={onAddWebsite}
                    className="add-item-btn"
                    title={t('addWebsite')}
                  >
                    <span className="plus-icon-small">+</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Dynamic Address Fields */}
        <div className="addresses-section">
          <label className="addresses-label">{t('addresses')}</label>
          {personalInfo.addresses.map((address, index) => (
            <div key={index} className="address-group">
              <div className="address-header">
                <label htmlFor={`address-${index}`}>{t('address')} {index + 1}</label>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => onRemoveAddress(index)}
                    className="remove-address-btn"
                    title={t('removeAddress')}
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="input-wrapper">
                <textarea
                  id={`address-${index}`}
                  value={address}
                  onChange={(e) => onAddressChange(index, e.target.value)}
                  placeholder={t('placeholderBangladeshAddress')}
                  className="form-input form-textarea"
                  rows="3"
                />
                {index === personalInfo.addresses.length - 1 && personalInfo.addresses.length < 10 && (
                  <button
                    type="button"
                    onClick={onAddAddress}
                    className="add-item-btn"
                    title={t('addAddress')}
                  >
                    <span className="plus-icon-small">+</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  )
}

export default PersonalInfoForm

