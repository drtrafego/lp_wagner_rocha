'use client'

import React, { useState, useEffect } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { getExampleNumber, getCountryCallingCode, isValidPhoneNumber } from 'libphonenumber-js'
import examples from 'libphonenumber-js/examples.mobile.json'

interface Props {
  value: string
  onChange: (value: string, isValid: boolean) => void
  variant?: 'light' | 'dark'
  className?: string
}

export default function PhoneInputWithFlag({ value, onChange, variant = 'light', className }: Props) {
  const [countryCode, setCountryCode] = useState<string>('br')
  const [placeholder, setPlaceholder] = useState<string>('(65) 9 9999-9999')

  const updatePlaceholder = (iso2: string) => {
    try {
      if (!iso2) return
      const phoneNumber = getExampleNumber(iso2.toUpperCase() as Parameters<typeof getExampleNumber>[0], examples)
      setPlaceholder(phoneNumber ? phoneNumber.formatNational() : 'DDD + WhatsApp')
    } catch {
      setPlaceholder('DDD + WhatsApp')
    }
  }

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data?.country_code) {
          const code = data.country_code.toLowerCase()
          setCountryCode(code)
          updatePlaceholder(code)
        }
      })
      .catch(() => {})
  }, [])

  const handleChange = (val: string, data: { dialCode?: string; countryCode?: string; format?: string }) => {
    let phoneValue = val
    if (data?.dialCode && val && !val.startsWith(data.dialCode)) {
      phoneValue = data.dialCode + val
    }

    if (data?.countryCode && data.countryCode !== countryCode) {
      setCountryCode(data.countryCode)
      updatePlaceholder(data.countryCode)
    }

    let isValid = false
    try {
      if (phoneValue) isValid = isValidPhoneNumber('+' + phoneValue)
    } catch {
      const digits = phoneValue.replace(/\D/g, '')
      const ddiLen = data?.dialCode?.length ?? 0
      isValid = digits.length - ddiLen >= 10
    }

    onChange(phoneValue, isValid)
  }

  let displayValue = value
  try {
    if (countryCode && value) {
      const dialCode = getCountryCallingCode(countryCode.toUpperCase() as Parameters<typeof getCountryCallingCode>[0])
      if (value.startsWith(dialCode)) displayValue = value.substring(dialCode.length)
    }
  } catch {}

  const isDark = variant === 'dark'

  return (
    <div className={`phone-flag-wrapper ${className ?? ''}`}>
      <PhoneInput
        country={countryCode}
        value={displayValue}
        onChange={handleChange}
        inputProps={{ name: 'whatsapp', required: true, autoFocus: false }}
        containerClass="!w-full"
        inputClass={
          isDark
            ? '!w-full !h-12 !bg-white/10 !text-white !border-white/20 !rounded !pl-[52px] !text-sm !font-sans focus:!border-borde focus:!outline-none'
            : '!w-full !h-12 !bg-white !text-chumbo !border-chumbo/20 !rounded !pl-[52px] !text-sm !font-sans focus:!border-borde focus:!outline-none'
        }
        buttonClass={
          isDark
            ? '!bg-white/10 !border-white/20 !rounded-l hover:!bg-white/20'
            : '!bg-white !border-chumbo/20 !rounded-l hover:!bg-gray-50'
        }
        dropdownClass={
          isDark
            ? '!bg-slate-800 !text-white !border-slate-700'
            : '!bg-white !text-chumbo !border-chumbo/20'
        }
        specialLabel=""
        placeholder={placeholder}
        enableSearch
        disableSearchIcon={false}
        autoFormat
        preferredCountries={['br', 'pt', 'us']}
        disableCountryCode
        disableCountryGuess
        masks={{ br: '(..) .....-....' }}
      />
      <style jsx global>{`
        .phone-flag-wrapper .react-tel-input .form-control {
          width: 100% !important;
          height: 48px !important;
          font-size: 14px !important;
          padding-left: 52px !important;
          border-radius: 4px !important;
          transition: border-color 0.2s !important;
        }
        .phone-flag-wrapper .react-tel-input .form-control:focus {
          box-shadow: none !important;
        }
        .phone-flag-wrapper .react-tel-input .flag-dropdown {
          border-radius: 4px 0 0 4px !important;
        }
        .phone-flag-wrapper .react-tel-input .selected-flag {
          border-radius: 4px 0 0 4px !important;
          padding: 0 8px !important;
        }
        .phone-flag-wrapper .react-tel-input .country-list {
          border-radius: 4px !important;
          margin-top: 2px !important;
          max-height: 220px !important;
        }
        .phone-flag-wrapper .react-tel-input .country-list .search {
          padding: 8px !important;
        }
      `}</style>
    </div>
  )
}
