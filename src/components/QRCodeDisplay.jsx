import { QRCodeSVG } from 'qrcode.react'
import { useLanguage } from '../i18n/LanguageContext'
import './QRCodeDisplay.css'

function QRCodeDisplay({ data, personalInfo, qrCodeType }) {
  const { t } = useLanguage()
  
  // Get labels for social media QR codes
  const getQRLabels = () => {
    if (qrCodeType !== 'socialMedia') return []
    
    const labels = []
    if (personalInfo.linkedIn && personalInfo.linkedIn.trim()) {
      labels.push('LinkedIn')
    }
    if (personalInfo.facebook && personalInfo.facebook.trim()) {
      labels.push('Facebook')
    }
    if (personalInfo.instagram && personalInfo.instagram.trim()) {
      labels.push('Instagram')
    }
    if (personalInfo.twitter && personalInfo.twitter.trim()) {
      labels.push('Twitter')
    }
    if (personalInfo.websites && personalInfo.websites.some(website => website.trim())) {
      labels.push('Website')
    }
    return labels
  }
  
  const qrLabels = getQRLabels()
  
  // Check if there's data based on QR code type
  const hasData = qrCodeType === 'textMessage'
    ? // For text message: check phone number only
      personalInfo.phoneNumber?.trim()
    : qrCodeType === 'socialMedia' 
    ? // For social media: check LinkedIn, Facebook, Instagram, Twitter, or websites
      (personalInfo.linkedIn?.trim() || 
       personalInfo.facebook?.trim() || 
       personalInfo.instagram?.trim() ||
       personalInfo.twitter?.trim() ||
       personalInfo.websites?.some(website => website.trim()))
    : // For phone contact: check all fields
      Object.entries(personalInfo).some(([key, value]) => {
        if (key === 'addresses' || key === 'emails' || key === 'websites') {
          return Array.isArray(value) && value.some(item => item.trim() !== '')
        }
        return typeof value === 'string' && value.trim() !== ''
      })

  if (!hasData) {
    return (
      <div className="qr-container">
        <div className="qr-placeholder">
          <p>{t('fillFormMessage')}</p>
        </div>
      </div>
    )
  }

  // Ensure data is valid
  const qrData = data || ''
  
  // Get display name for QR code (shown in bottom left corner)
  const getQRCodeDisplayName = () => {
    if (qrCodeType === 'textMessage') {
      return 'Text Message'
    }
    
    if (qrCodeType === 'socialMedia') {
      const labels = []
      if (personalInfo.linkedIn?.trim()) labels.push('LinkedIn')
      if (personalInfo.facebook?.trim()) labels.push('Facebook')
      if (personalInfo.instagram?.trim()) labels.push('Instagram')
      if (personalInfo.twitter?.trim()) labels.push('Twitter')
      if (personalInfo.websites?.some(website => website.trim())) labels.push('Website')
      
      if (labels.length > 0) {
        return labels.join(', ')
      }
      return 'Social Media'
    }
    
    // For phone contact
    return personalInfo.fullName?.trim() || 'Contact Card'
  }
  
  // Generate dynamic filename based on QR code type and content
  const getDownloadFilename = () => {
    if (qrCodeType === 'textMessage') {
      const phone = personalInfo.phoneNumber?.trim() || 'phone'
      // Clean phone number for filename (remove special characters)
      const cleanPhone = phone.replace(/[^0-9+]/g, '')
      return `qr-code-text-message-${cleanPhone}.png`
    }
    
    if (qrCodeType === 'socialMedia') {
      const labels = []
      if (personalInfo.linkedIn?.trim()) labels.push('linkedin')
      if (personalInfo.facebook?.trim()) labels.push('facebook')
      if (personalInfo.instagram?.trim()) labels.push('instagram')
      if (personalInfo.twitter?.trim()) labels.push('twitter')
      if (personalInfo.websites?.some(website => website.trim())) labels.push('website')
      
      if (labels.length > 0) {
        return `qr-code-${labels.join('-')}.png`
      }
      return 'qr-code-social-media.png'
    }
    
    // For phone contact
    const name = personalInfo.fullName?.trim() || 'contact'
    // Clean name for filename (remove special characters, spaces become hyphens)
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    return `qr-code-contact-${cleanName || 'card'}.png`
  }
  
  return (
    <div className="qr-container">
      <h2>{t('yourQRCode')}</h2>
      <div className="qr-code-wrapper">
        {/* Display labels above QR code for social media */}
        {qrCodeType === 'socialMedia' && qrLabels.length > 0 && (
          <div className="qr-labels">
            {qrLabels.map((label, index) => (
              <span key={index} className="qr-label">{label}</span>
            ))}
          </div>
        )}
        {qrData ? (
          <QRCodeSVG
            value={qrData}
            size={300}
            level="H"
            includeMargin={true}
          />
        ) : (
          <div className="qr-placeholder">
            <p>No data to encode</p>
          </div>
        )}
      </div>
      <div className="qr-info">
        <p className="qr-instructions">
          {t('scanInstructions')}
        </p>
        <button 
          className="download-btn"
          onClick={() => {
            const svg = document.querySelector('.qr-code-wrapper svg')
            if (svg) {
              const svgData = new XMLSerializer().serializeToString(svg)
              const canvas = document.createElement('canvas')
              const ctx = canvas.getContext('2d')
              const img = new Image()
              img.onload = () => {
                // Set canvas size with extra space at bottom for text
                const padding = 40
                canvas.width = img.width
                canvas.height = img.height + padding
                
                // Draw white background
                ctx.fillStyle = '#ffffff'
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                
                // Draw QR code image
                ctx.drawImage(img, 0, 0)
                
                // Draw text in bottom left corner
                const displayName = getQRCodeDisplayName()
                ctx.fillStyle = '#333333'
                ctx.font = 'bold 14px Arial, sans-serif'
                ctx.textAlign = 'left'
                ctx.textBaseline = 'bottom'
                
                // Add text shadow for better visibility
                ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
                ctx.shadowBlur = 4
                ctx.shadowOffsetX = 1
                ctx.shadowOffsetY = 1
                
                // Draw text with padding from edges
                const textX = 15
                const textY = canvas.height - 10
                ctx.fillText(displayName, textX, textY)
                
                // Reset shadow
                ctx.shadowColor = 'transparent'
                ctx.shadowBlur = 0
                ctx.shadowOffsetX = 0
                ctx.shadowOffsetY = 0
                
                const pngFile = canvas.toDataURL('image/png')
                const downloadLink = document.createElement('a')
                downloadLink.download = getDownloadFilename()
                downloadLink.href = pngFile
                downloadLink.click()
              }
              img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
            }
          }}
        >
          {t('downloadQRCode')}
        </button>
      </div>
    </div>
  )
}

export default QRCodeDisplay

