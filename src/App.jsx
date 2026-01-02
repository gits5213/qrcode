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
    personalEmail: 'mdzaman.gits@gmail.com',
    jobEmail: 'mdzaman.jobs@gmail.com',
    workEmail: 'md.zaman@gitsics.com',
    bangladeshAddress: 'Kaiyakuri (Baliganj Bazar)\nNakla, Sherpur, Mymensingh\nBangladesh',
    usaAddress1: '202nd Street & Hillside Avenue\nHollis, NY-11423',
    usaAddress2: '87th Street N.\nWest Palm Beach, FL-33412',
    trainingWebsite: '',
    educationalWebsite: '',
    portfolioWebsite: '',
    lisuFoundation: 'https://lisufoundationbd.org/en',
    madrashaOrphanage: ''
  })

  const handleInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateQRData = () => {
    // Format as vCard (vCard format) for better compatibility with contact scanners
    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${personalInfo.fullName || 'N/A'}`,
      `TEL;TYPE=CELL:${personalInfo.phoneNumber || ''}`,
      `TEL;TYPE=CELL,WA:${personalInfo.whatsappNumber || ''}`,
      `EMAIL;TYPE=PERSONAL:${personalInfo.personalEmail || ''}`,
      `EMAIL;TYPE=WORK:${personalInfo.jobEmail || ''}`,
      `EMAIL;TYPE=WORK:${personalInfo.workEmail || ''}`,
      `ADR;TYPE=HOME;LABEL="Bangladesh Address":;;${(personalInfo.bangladeshAddress || '').replace(/\n/g, '; ')};;;`,
      `ADR;TYPE=WORK;LABEL="USA Address 1":;;${(personalInfo.usaAddress1 || '').replace(/\n/g, '; ')};;;`,
      `ADR;TYPE=WORK;LABEL="USA Address 2":;;${(personalInfo.usaAddress2 || '').replace(/\n/g, '; ')};;;`,
      `URL;TYPE=WORK:${personalInfo.trainingWebsite || ''}`,
      `URL;TYPE=WORK:${personalInfo.educationalWebsite || ''}`,
      `URL;TYPE=WORK:${personalInfo.portfolioWebsite || ''}`,
      `URL:${personalInfo.lisuFoundation || ''}`,
      `URL:${personalInfo.madrashaOrphanage || ''}`,
      'END:VCARD'
    ].filter(line => {
      // Remove empty fields
      const value = line.split(':')[1]
      return value && value !== 'N/A' && value.trim() !== ''
    }).join('\n')

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

