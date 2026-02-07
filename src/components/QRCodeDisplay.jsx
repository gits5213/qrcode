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
    if (personalInfo.websites && personalInfo.websites.some(website => website.trim())) {
      labels.push('Website')
    }
    return labels
  }
  
  const qrLabels = getQRLabels()
  
  // Check if there's data based on QR code type
  const hasData = qrCodeType === 'socialMedia' 
    ? // For social media: check LinkedIn, Facebook, or websites
      (personalInfo.linkedIn?.trim() || 
       personalInfo.facebook?.trim() || 
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
                canvas.width = img.width
                canvas.height = img.height
                ctx.drawImage(img, 0, 0)
                const pngFile = canvas.toDataURL('image/png')
                const downloadLink = document.createElement('a')
                downloadLink.download = 'personal-qrcode.png'
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

