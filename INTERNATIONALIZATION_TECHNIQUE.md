# Internationalization (i18n) Technique - English to Arabic Translation

## Overview
This project uses a **React Context-based Internationalization (i18n)** pattern to translate the entire website from English to Arabic. This is a lightweight, custom solution that doesn't require external libraries.

---

## 🏗️ Architecture

### 1. **Language Context Provider** (`LanguageContext.js`)
The core of the translation system using React Context API.

```javascript
// Structure:
LanguageProvider (Context Provider)
  ├── language state (current language: 'en' or 'ar')
  ├── translations state (object with all translations)
  ├── changeLanguage() function
  └── t() function (translation function)
```

**Key Features:**
- **Centralized Translation Storage**: All translations stored in one place
- **Language State Management**: Tracks current language
- **LocalStorage Persistence**: Saves user's language preference
- **Dynamic Translation Loading**: Loads translations based on selected language

---

## 🔧 How It Works

### Step 1: Context Provider Setup

```javascript
// frontend/src/contexts/LanguageContext.js

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')
  const [translations, setTranslations] = useState({})

  useEffect(() => {
    if (language === 'ar') {
      setTranslations({
        dashboard: 'لوحة التحكم',
        orders: 'الطلبات',
        // ... all Arabic translations
      })
    } else {
      setTranslations({
        dashboard: 'Dashboard',
        orders: 'Orders',
        // ... all English translations
      })
    }
  }, [language])

  const t = (key) => translations[key] || key

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
```

### Step 2: Custom Hook

```javascript
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
```

### Step 3: Usage in Components

```javascript
// In any component/page
import { useLanguage } from '@/contexts/LanguageContext'

export default function OrdersPage() {
  const { t, language, changeLanguage } = useLanguage()
  
  return (
    <div>
      <h1>{t('orders')}</h1>
      <p>{t('dashboardOrders')}</p>
      <button onClick={() => changeLanguage('ar')}>Switch to Arabic</button>
    </div>
  )
}
```

---

## 📋 Translation Key System

### Structure:
Each translation is stored as a **key-value pair**:

```javascript
// English
{
  orders: 'Orders',
  dashboard: 'Dashboard',
  viewDetails: 'View Details'
}

// Arabic
{
  orders: 'الطلبات',
  dashboard: 'لوحة التحكم',
  viewDetails: 'عرض التفاصيل'
}
```

### Naming Convention:
- **camelCase** for keys: `orderNumber`, `viewDetails`, `dashboardOrders`
- **Descriptive names**: Keys describe what they translate
- **Grouped by page/feature**: Comments organize translations

---

## 🔄 Translation Flow

```
User clicks Arabic language button
         ↓
changeLanguage('ar') called
         ↓
language state updates to 'ar'
         ↓
useEffect detects language change
         ↓
setTranslations() loads Arabic translations
         ↓
All components using t() function re-render
         ↓
All text displays in Arabic
```

---

## 💾 Persistence

### LocalStorage Integration:
```javascript
const changeLanguage = (lang) => {
  setLanguage(lang)
  localStorage.setItem('dashboard_language', lang) // Save preference
  document.documentElement.lang = lang
}

useEffect(() => {
  // Load saved preference on mount
  const savedLang = localStorage.getItem('dashboard_language') || 'en'
  setLanguage(savedLang)
}, [])
```

**Benefits:**
- User's language choice persists across page reloads
- No need to re-select language every visit

---

## 🎯 Implementation Pattern

### Before (Hardcoded):
```javascript
<h1>Orders</h1>
<button>View Details</button>
```

### After (Translated):
```javascript
const { t } = useLanguage()

<h1>{t('orders')}</h1>
<button>{t('viewDetails')}</button>
```

---

## 📦 Component Integration

### Example: Orders Page

```javascript
'use client'
import { useLanguage } from '@/contexts/LanguageContext'

export default function OrdersPage() {
  const { t, language } = useLanguage()
  
  return (
    <div>
      {/* Page Title */}
      <h1>{t('orders')}</h1>
      
      {/* Tabs */}
      <button>{t('all')}</button>
      <button>{t('pending')}</button>
      <button>{t('completed')}</button>
      
      {/* Table Headers */}
      <th>{t('orderNumber')}</th>
      <th>{t('placedOn')}</th>
      <th>{t('status')}</th>
      
      {/* Actions */}
      <button>{t('viewDetails')}</button>
      <button>{t('editOrder')}</button>
    </div>
  )
}
```

---

## 🌐 Language Switching

### Header Language Selector:
```javascript
// In Header component
const { language, changeLanguage } = useLanguage()

<button onClick={() => changeLanguage('ar')}>
  🇶🇦 Arabic
</button>
<button onClick={() => changeLanguage('en')}>
  🇬🇧 English
</button>
```

**What happens:**
1. User clicks Arabic button
2. `changeLanguage('ar')` is called
3. Language state updates
4. All components re-render with Arabic text
5. Preference saved to localStorage

---

## ✅ Advantages of This Technique

1. **No External Dependencies**: Pure React solution
2. **Lightweight**: No heavy i18n libraries
3. **Type-Safe**: Can add TypeScript for key validation
4. **Centralized**: All translations in one file
5. **Easy to Maintain**: Simple key-value structure
6. **Fast**: No runtime translation lookups
7. **Flexible**: Easy to add more languages

---

## 🔍 Key Components

### 1. **LanguageContext.js**
- Main translation provider
- Contains all translation objects
- Manages language state

### 2. **useLanguage Hook**
- Provides access to translations
- Returns: `{ language, changeLanguage, t }`

### 3. **Components/Pages**
- Import `useLanguage` hook
- Use `t('key')` for translations
- Access `language` for conditional logic

---

## 📝 Adding New Translations

### Step 1: Add to LanguageContext.js

```javascript
// In Arabic section
if (language === 'ar') {
  setTranslations({
    // ... existing translations
    newKey: 'النص العربي الجديد',
  })
}

// In English section
else {
  setTranslations({
    // ... existing translations
    newKey: 'New English Text',
  })
}
```

### Step 2: Use in Component

```javascript
const { t } = useLanguage()
<p>{t('newKey')}</p>
```

---

## 🎨 Conditional Rendering

Sometimes you need conditional logic based on language:

```javascript
const { language } = useLanguage()

// Option 1: Direct condition
{language === 'ar' ? 'النص العربي' : 'English Text'}

// Option 2: Using translation key (preferred)
{t('textKey')}
```

---

## 🚀 Performance Considerations

1. **Single Source of Truth**: Translations loaded once per language change
2. **No Runtime Lookups**: Translations pre-loaded in state
3. **Minimal Re-renders**: Only affected components update
4. **LocalStorage Caching**: Language preference cached

---

## 📊 Translation Coverage

Currently translated:
- ✅ Sidebar navigation
- ✅ Header (search, notifications, profile)
- ✅ Dashboard content
- ✅ Orders page
- ✅ Products page
- ✅ Transactions pages
- ✅ Settings pages
- ✅ All buttons, labels, messages

---

## 🔮 Future Enhancements

1. **TypeScript Support**: Type-safe translation keys
2. **Pluralization**: Handle singular/plural forms
3. **Date/Number Formatting**: Locale-specific formatting
4. **RTL Support**: Right-to-left layout for Arabic
5. **Translation Files**: Move to separate JSON files
6. **Missing Key Detection**: Warn about untranslated keys

---

## 📚 Summary

**Technique**: React Context API + Custom Hook Pattern
**Pattern**: Provider → Hook → Components
**Storage**: In-memory state + LocalStorage persistence
**Translation Method**: Key-value mapping with `t()` function
**Language Switch**: Instant, no page reload required

This is a **simple, effective, and maintainable** solution for bilingual websites!

