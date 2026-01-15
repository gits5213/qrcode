import { useState } from 'react'
import PersonalInfoForm from './components/PersonalInfoForm'
import QRCodeDisplay from './components/QRCodeDisplay'
import LanguageSwitcher from './components/LanguageSwitcher'
import { useLanguage } from './i18n/LanguageContext'
import './App.css'

function App() {
  const { t } = useLanguage()
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    phoneNumber: '',
    whatsappNumber: '',
    linkedIn: '',
    emails: [''], // Start with one email (Email 1)
    addresses: [''], // Start with one address (Address 1)
    websites: [''] // Start with one website (Website 1)
  })

  const handleInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddressChange = (index, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      addresses: prev.addresses.map((addr, i) => i === index ? value : addr)
    }))
  }

  const handleAddAddress = () => {
    if (personalInfo.addresses.length < 10) {
      setPersonalInfo(prev => ({
        ...prev,
        addresses: [...prev.addresses, '']
      }))
    }
  }

  const handleRemoveAddress = (index) => {
    if (personalInfo.addresses.length > 1) {
      setPersonalInfo(prev => ({
        ...prev,
        addresses: prev.addresses.filter((_, i) => i !== index)
      }))
    }
  }

  const handleEmailChange = (index, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      emails: prev.emails.map((email, i) => i === index ? value : email)
    }))
  }

  const handleAddEmail = () => {
    if (personalInfo.emails.length < 10) {
      setPersonalInfo(prev => ({
        ...prev,
        emails: [...prev.emails, '']
      }))
    }
  }

  const handleRemoveEmail = (index) => {
    if (personalInfo.emails.length > 1) {
      setPersonalInfo(prev => ({
        ...prev,
        emails: prev.emails.filter((_, i) => i !== index)
      }))
    }
  }

  const handleWebsiteChange = (index, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      websites: prev.websites.map((website, i) => i === index ? value : website)
    }))
  }

  const handleAddWebsite = () => {
    if (personalInfo.websites.length < 10) {
      setPersonalInfo(prev => ({
        ...prev,
        websites: [...prev.websites, '']
      }))
    }
  }

  const handleRemoveWebsite = (index) => {
    if (personalInfo.websites.length > 1) {
      setPersonalInfo(prev => ({
        ...prev,
        websites: prev.websites.filter((_, i) => i !== index)
      }))
    }
  }

  const generateQRData = () => {
    // Format as vCard (vCard format) for better compatibility with contact scanners
    const vCardLines = [
      'BEGIN:VCARD',
      'VERSION:3.0'
    ]

    // Add full name if provided
    if (personalInfo.fullName.trim()) {
      vCardLines.push(`FN:${personalInfo.fullName}`)
    }

    // Add phone numbers if provided
    if (personalInfo.phoneNumber.trim()) {
      vCardLines.push(`TEL;TYPE=CELL:${personalInfo.phoneNumber}`)
    }
    if (personalInfo.whatsappNumber.trim()) {
      vCardLines.push(`TEL;TYPE=CELL,WA:${personalInfo.whatsappNumber}`)
    }

    // Add emails
    personalInfo.emails.forEach((email) => {
      if (email.trim()) {
        vCardLines.push(`EMAIL;TYPE=WORK:${email}`)
      }
    })

    // Add addresses
    personalInfo.addresses.forEach((address, index) => {
      if (address.trim()) {
        vCardLines.push(`ADR;TYPE=WORK;LABEL="Address ${index + 1}":;;${address.replace(/\n/g, '; ')};;;`)
      }
    })

    // Add websites
    personalInfo.websites.forEach((website) => {
      if (website.trim()) {
        vCardLines.push(`URL;TYPE=WORK:${website}`)
      }
    })

    // Add LinkedIn
    if (personalInfo.linkedIn.trim()) {
      vCardLines.push(`URL;TYPE=WORK:${personalInfo.linkedIn}`)
    }

    vCardLines.push('END:VCARD')

    const vCard = vCardLines.join('\n')
    
    // Ensure we always return valid vCard data (at minimum BEGIN and END)
    if (vCardLines.length <= 3) {
      // If only BEGIN, VERSION, and END, add a minimal FN field
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'FN:Contact',
        'END:VCARD'
      ].join('\n')
    }
    
    return vCard
  }

  return (
    <div className="app">
      <div className="container">
        <LanguageSwitcher />
        <header className="header">
          <h1>{t('appTitle')}</h1>
          <p>{t('appSubtitle')}</p>
        </header>
        
        <div className="content">
          <PersonalInfoForm 
            personalInfo={personalInfo}
            onInfoChange={handleInfoChange}
            onAddressChange={handleAddressChange}
            onAddAddress={handleAddAddress}
            onRemoveAddress={handleRemoveAddress}
            onEmailChange={handleEmailChange}
            onAddEmail={handleAddEmail}
            onRemoveEmail={handleRemoveEmail}
            onWebsiteChange={handleWebsiteChange}
            onAddWebsite={handleAddWebsite}
            onRemoveWebsite={handleRemoveWebsite}
          />
          
          <QRCodeDisplay 
            data={generateQRData()}
            personalInfo={personalInfo}
          />
        </div>
      </div>
    </div>
  )
}

export default App

