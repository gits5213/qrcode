import { useEffect, useState } from 'react'
import './ContactLanding.css'

function ContactLanding() {
  const [contactData, setContactData] = useState(null)
  const [linkedInUrl, setLinkedInUrl] = useState('')

  useEffect(() => {
    // Get data from URL parameters
    const params = new URLSearchParams(window.location.search)
    const encodedData = params.get('data')
    const linkedInEncoded = params.get('linkedin') || ''

    if (encodedData) {
      try {
        // Decode the contact data
        const decoded = JSON.parse(decodeURIComponent(atob(encodedData)))
        setContactData(decoded)
        
        // Decode LinkedIn URL and ensure it's properly formatted
        let linkedIn = linkedInEncoded ? decodeURIComponent(linkedInEncoded) : ''
        
        // Ensure URL has protocol
        if (linkedIn && !linkedIn.startsWith('http://') && !linkedIn.startsWith('https://')) {
          linkedIn = 'https://' + linkedIn
        }
        
        console.log('LinkedIn URL:', linkedIn) // Debug log
        setLinkedInUrl(linkedIn)

        // Generate and download vCard
        generateAndDownloadVCard(decoded)

        // If LinkedIn URL exists, open it after a short delay
        if (linkedIn) {
          setTimeout(() => {
            console.log('Attempting to open LinkedIn:', linkedIn) // Debug log
            // Use window.open for better compatibility, fallback to location.href
            try {
              const linkedInWindow = window.open(linkedIn, '_blank')
              if (!linkedInWindow || linkedInWindow.closed || typeof linkedInWindow.closed === 'undefined') {
                // If popup blocked, use location.href
                console.log('Popup blocked, using location.href') // Debug log
                window.location.href = linkedIn
              }
            } catch (error) {
              console.error('Error opening LinkedIn:', error) // Debug log
              // Fallback to location.href
              window.location.href = linkedIn
            }
          }, 1500) // 1.5 second delay to allow contact save
        }
      } catch (error) {
        console.error('Error decoding contact data:', error)
      }
    }
  }, [])

  const generateAndDownloadVCard = (data) => {
    const vCardLines = ['BEGIN:VCARD', 'VERSION:3.0']

    if (data.fullName) {
      vCardLines.push(`FN:${data.fullName}`)
    }

    if (data.phoneNumber) {
      vCardLines.push(`TEL;TYPE=CELL:${data.phoneNumber}`)
    }

    if (data.whatsappNumber) {
      vCardLines.push(`TEL;TYPE=CELL,WA:${data.whatsappNumber}`)
    }

    if (data.emails && Array.isArray(data.emails)) {
      data.emails.forEach((email) => {
        if (email.trim()) {
          vCardLines.push(`EMAIL;TYPE=WORK:${email}`)
        }
      })
    }

    if (data.addresses && Array.isArray(data.addresses)) {
      data.addresses.forEach((address, index) => {
        if (address.trim()) {
          vCardLines.push(`ADR;TYPE=WORK;LABEL="Address ${index + 1}":;;${address.replace(/\n/g, '; ')};;;`)
        }
      })
    }

    if (data.websites && Array.isArray(data.websites)) {
      data.websites.forEach((website) => {
        if (website.trim()) {
          vCardLines.push(`URL;TYPE=WORK:${website}`)
        }
      })
    }

    vCardLines.push('END:VCARD')

    const vCard = vCardLines.join('\n')
    const blob = new Blob([vCard], { type: 'text/vcard' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${data.fullName || 'contact'}.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (!contactData) {
    return (
      <div className="contact-landing">
        <div className="landing-content">
          <p>Loading contact information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="contact-landing">
      <div className="landing-content">
        <h1>Contact Information</h1>
        <div className="contact-details">
          {contactData.fullName && <p><strong>Name:</strong> {contactData.fullName}</p>}
          {contactData.phoneNumber && <p><strong>Phone:</strong> {contactData.phoneNumber}</p>}
          {contactData.whatsappNumber && <p><strong>WhatsApp:</strong> {contactData.whatsappNumber}</p>}
          {contactData.emails && contactData.emails.length > 0 && (
            <p><strong>Email:</strong> {contactData.emails.filter(e => e.trim()).join(', ')}</p>
          )}
        </div>
        <p className="saving-message">Saving contact to your device...</p>
        {linkedInUrl && (
          <>
            <p className="redirect-message">Opening LinkedIn profile...</p>
            <button 
              className="linkedin-btn"
              onClick={() => {
                window.open(linkedInUrl, '_blank')
              }}
            >
              Open LinkedIn Profile
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ContactLanding
