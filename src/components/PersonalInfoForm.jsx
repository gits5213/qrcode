import { useLanguage } from '../i18n/LanguageContext'
import './PersonalInfoForm.css'

function PersonalInfoForm({ qrCodeType, onQrCodeTypeChange, personalInfo, onInfoChange, onAddressChange, onAddAddress, onRemoveAddress, onEmailChange, onAddEmail, onRemoveEmail, onWebsiteChange, onAddWebsite, onRemoveWebsite }) {
  const { t } = useLanguage()
  
  // Determine dynamic heading based on QR code type and content
  const getDynamicHeading = () => {
    if (qrCodeType === 'textMessage') {
      return t('headingTextMessageInformation')
    }
    
    if (qrCodeType === 'socialMedia') {
      // Check what fields are actually filled
      const hasLinkedIn = personalInfo.linkedIn && personalInfo.linkedIn.trim()
      const hasFacebook = personalInfo.facebook && personalInfo.facebook.trim()
      const hasWebsites = personalInfo.websites && personalInfo.websites.some(website => website.trim())
      
      // Count how many fields are filled
      const filledCount = [hasLinkedIn, hasFacebook, hasWebsites].filter(Boolean).length
      
      // If nothing is filled yet, show default
      if (filledCount === 0) {
        return t('headingSocialMediaInformation')
      }
      
      // If only one field is filled
      if (filledCount === 1) {
        if (hasLinkedIn) return t('headingLinkedInInformation')
        if (hasFacebook) return t('headingFacebookInformation')
        if (hasWebsites) return t('headingWebsiteInformation')
      }
      
      // If two fields are filled
      if (filledCount === 2) {
        if (hasLinkedIn && hasFacebook) return t('headingLinkedInFacebookInformation')
        if (hasLinkedIn && hasWebsites) return t('headingLinkedInWebsiteInformation')
        if (hasFacebook && hasWebsites) return t('headingFacebookWebsiteInformation')
      }
      
      // If all three are filled
      if (filledCount === 3) {
        return t('headingAllSocialMediaInformation')
      }
      
      return t('headingSocialMediaInformation')
    }
    return t('headingPersonalInformation')
  }
  
  const formHeading = getDynamicHeading()
  
  const fields = [
    { key: 'fullName', labelKey: 'fullName', placeholderKey: 'placeholderFullName', type: 'text' },
    { key: 'phoneNumber', labelKey: 'phoneNumber', placeholderKey: 'placeholderPhoneNumber', type: 'tel' },
    { key: 'whatsappNumber', labelKey: 'whatsappNumber', placeholderKey: 'placeholderWhatsAppNumber', type: 'tel' },
    { key: 'linkedIn', labelKey: 'linkedIn', placeholderKey: 'placeholderLinkedIn', type: 'url' },
    { key: 'facebook', labelKey: 'facebook', placeholderKey: 'placeholderFacebook', type: 'url' }
  ]

  return (
    <div className="form-container">
      <h2>{formHeading}</h2>
      <form className="personal-info-form">
        {/* QR Code Type Dropdown */}
        <div className="form-group">
          <label htmlFor="qrCodeType">{t('qrCodeType')}</label>
          <select
            id="qrCodeType"
            value={qrCodeType}
            onChange={(e) => onQrCodeTypeChange(e.target.value)}
            className="form-input form-select"
          >
            <option value="phoneContact">{t('qrCodeTypePhoneContact')}</option>
            <option value="socialMedia">{t('qrCodeTypeSocialMedia')}</option>
            <option value="textMessage">{t('qrCodeTypeTextMessage')}</option>
          </select>
        </div>
        
        {fields.map(field => {
          // Show/hide fields based on QR code type
          // For social media: hide fullName, phone and WhatsApp fields
          if (qrCodeType === 'socialMedia' && (field.key === 'fullName' || field.key === 'phoneNumber' || field.key === 'whatsappNumber')) {
            return null
          }
          
          // For text message: show only phoneNumber, hide others
          if (qrCodeType === 'textMessage' && (field.key === 'fullName' || field.key === 'whatsappNumber' || field.key === 'linkedIn' || field.key === 'facebook')) {
            return null
          }
          
          return (
            <div key={field.key} className="form-group">
              <label htmlFor={field.key}>{t(field.labelKey)}</label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.key}
                  value={personalInfo[field.key] || ''}
                  onChange={(e) => onInfoChange(field.key, e.target.value)}
                  placeholder={t(field.placeholderKey)}
                  className="form-input form-textarea"
                  rows="3"
                />
              ) : (
                <input
                  type={field.type}
                  id={field.key}
                  value={personalInfo[field.key] || ''}
                  onChange={(e) => onInfoChange(field.key, e.target.value)}
                  placeholder={t(field.placeholderKey)}
                  className="form-input"
                />
              )}
              {/* Show help text for phone number in text message mode */}
              {qrCodeType === 'textMessage' && field.key === 'phoneNumber' && (
                <small className="form-help-text" style={{ 
                  display: 'block', 
                  marginTop: '0.25rem', 
                  color: '#666', 
                  fontSize: '0.85rem' 
                }}>
                  {t('phoneNumberHelpText')}
                </small>
              )}
            </div>
          )
        })}
        
        {/* Dynamic Email Fields - Only show for phone contact */}
        {qrCodeType === 'phoneContact' && (
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
        )}
        
        {/* Dynamic Website Fields - Hide for text message */}
        {qrCodeType !== 'textMessage' && (
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
        )}
        
        {/* Dynamic Address Fields - Only show for phone contact */}
        {qrCodeType === 'phoneContact' && (
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
        )}
      </form>
    </div>
  )
}

export default PersonalInfoForm

