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
  
  // Extract username from URL (helper function)
  const extractUsernameFromUrl = (url, platform) => {
    if (!url || !url.trim()) return null
    
    try {
      let cleanUrl = url.trim()
      // Add https:// if missing
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl
      }
      
      const urlObj = new URL(cleanUrl)
      const pathname = urlObj.pathname
      
      // Remove leading and trailing slashes
      const pathParts = pathname.split('/').filter(part => part.length > 0)
      
      if (pathParts.length > 0) {
        // Get the last meaningful part (usually the username)
        let username = pathParts[pathParts.length - 1]
        
        // Clean username (remove query params, hash, etc.)
        username = username.split('?')[0].split('#')[0]
        
        // For some platforms, the username might be in a different position
        if (platform === 'linkedin' && pathParts.length > 1 && pathParts[0] === 'in') {
          username = pathParts[1]
        }
        
        return username || null
      }
    } catch (e) {
      // If URL parsing fails, try simple regex extraction
      const match = url.match(/(?:linkedin\.com\/in\/|facebook\.com\/|instagram\.com\/|twitter\.com\/|x\.com\/)([^\/\?\#\s]+)/i)
      if (match && match[1]) {
        return match[1]
      }
    }
    
    return null
  }
  
  // Get display name for QR code (shown in bottom left corner)
  const getQRCodeDisplayName = () => {
    if (qrCodeType === 'textMessage') {
      return 'Text Message'
    }
    
    if (qrCodeType === 'socialMedia') {
      const labels = []
      
      // Extract usernames and create labels with usernames
      if (personalInfo.linkedIn?.trim()) {
        const username = extractUsernameFromUrl(personalInfo.linkedIn, 'linkedin')
        labels.push(username ? `LinkedIn: ${username}` : 'LinkedIn')
      }
      
      if (personalInfo.facebook?.trim()) {
        const username = extractUsernameFromUrl(personalInfo.facebook, 'facebook')
        labels.push(username ? `Facebook: ${username}` : 'Facebook')
      }
      
      if (personalInfo.instagram?.trim()) {
        const username = extractUsernameFromUrl(personalInfo.instagram, 'instagram')
        labels.push(username ? `Instagram: ${username}` : 'Instagram')
      }
      
      if (personalInfo.twitter?.trim()) {
        const username = extractUsernameFromUrl(personalInfo.twitter, 'twitter')
        labels.push(username ? `Twitter: ${username}` : 'Twitter')
      }
      
      if (personalInfo.websites?.some(website => website.trim())) {
        // For websites, try to extract domain name
        const website = personalInfo.websites.find(w => w.trim())
        if (website) {
          try {
            let cleanUrl = website.trim()
            if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
              cleanUrl = 'https://' + cleanUrl
            }
            const urlObj = new URL(cleanUrl)
            const domain = urlObj.hostname.replace('www.', '')
            labels.push(`Website: ${domain}`)
          } catch (e) {
            labels.push('Website')
          }
        } else {
          labels.push('Website')
        }
      }
      
      if (labels.length > 0) {
        return labels.join(', ')
      }
      return 'Social Media'
    }
    
    // For phone contact
    return personalInfo.fullName?.trim() || 'Contact Card'
  }
  
  // Generate dynamic filename based on QR code type and content (prefixed with GITS)
  const getDownloadFilename = () => {
    const gitsPrefix = 'GITS-'
    if (qrCodeType === 'textMessage') {
      const phone = personalInfo.phoneNumber?.trim() || 'phone'
      // Clean phone number for filename (remove special characters)
      const cleanPhone = phone.replace(/[^0-9+]/g, '')
      return `${gitsPrefix}qr-code-text-message-${cleanPhone}.png`
    }
    
    if (qrCodeType === 'socialMedia') {
      const usernames = []
      
      // Extract usernames from URLs
      if (personalInfo.linkedIn?.trim()) {
        const username = extractUsernameFromUrl(personalInfo.linkedIn, 'linkedin')
        if (username) {
          usernames.push(`linkedin-${username}`)
        } else {
          usernames.push('linkedin')
        }
      }
      
      if (personalInfo.facebook?.trim()) {
        const username = extractUsernameFromUrl(personalInfo.facebook, 'facebook')
        if (username) {
          usernames.push(`facebook-${username}`)
        } else {
          usernames.push('facebook')
        }
      }
      
      if (personalInfo.instagram?.trim()) {
        const username = extractUsernameFromUrl(personalInfo.instagram, 'instagram')
        if (username) {
          usernames.push(`instagram-${username}`)
        } else {
          usernames.push('instagram')
        }
      }
      
      if (personalInfo.twitter?.trim()) {
        const username = extractUsernameFromUrl(personalInfo.twitter, 'twitter')
        if (username) {
          usernames.push(`twitter-${username}`)
        } else {
          usernames.push('twitter')
        }
      }
      
      if (personalInfo.websites?.some(website => website.trim())) {
        // For websites, try to extract domain name
        const website = personalInfo.websites.find(w => w.trim())
        if (website) {
          try {
            let cleanUrl = website.trim()
            if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
              cleanUrl = 'https://' + cleanUrl
            }
            const urlObj = new URL(cleanUrl)
            const domain = urlObj.hostname.replace('www.', '').split('.')[0]
            usernames.push(`website-${domain}`)
          } catch (e) {
            usernames.push('website')
          }
        } else {
          usernames.push('website')
        }
      }
      
      if (usernames.length > 0) {
        // Clean usernames for filename (remove special characters)
        const cleanUsernames = usernames.map(u => u.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, ''))
        return `${gitsPrefix}qr-code-${cleanUsernames.join('-')}.png`
      }
      return `${gitsPrefix}qr-code-social-media.png`
    }
    
    // For phone contact
    const name = personalInfo.fullName?.trim() || 'contact'
    // Clean name for filename (remove special characters, spaces become hyphens)
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    return `${gitsPrefix}qr-code-contact-${cleanName || 'card'}.png`
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
          <>
            <QRCodeSVG
              value={qrData}
              size={300}
              level="H"
              includeMargin={true}
            />
            <span className="qr-static-gits">GITS</span>
          </>
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
                
                // Draw text in bottom left corner (display name)
                const displayName = getQRCodeDisplayName()
                ctx.fillStyle = '#333333'
                // Use smaller font if text is long to fit better
                const fontSize = displayName.length > 50 ? 12 : 14
                ctx.font = `bold ${fontSize}px Arial, sans-serif`
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
                
                // If text is too long, wrap it or truncate
                const maxWidth = canvas.width - 30 // Leave margin on right for GITS
                const metrics = ctx.measureText(displayName)
                
                if (metrics.width > maxWidth) {
                  // Try to fit text by reducing font size or wrapping
                  ctx.font = `bold 11px Arial, sans-serif`
                  ctx.fillText(displayName, textX, textY)
                } else {
                  ctx.fillText(displayName, textX, textY)
                }
                
                // Reset shadow
                ctx.shadowColor = 'transparent'
                ctx.shadowBlur = 0
                ctx.shadowOffsetX = 0
                ctx.shadowOffsetY = 0
                
                // Draw static "GITS" in bottom right corner (included in downloaded image)
                ctx.fillStyle = '#333333'
                ctx.font = 'bold 14px Arial, sans-serif'
                ctx.textAlign = 'right'
                ctx.textBaseline = 'bottom'
                ctx.fillText('GITS', canvas.width - 15, canvas.height - 10)
                
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

