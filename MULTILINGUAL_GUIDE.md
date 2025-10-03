# Multilingual Support Documentation

## Overview

The Certify application now supports **7 languages** including:

- 🇬🇧 **English** (en)
- 🇮🇳 **Hindi (हिंदी)** (hi)
- 🇮🇳 **Tamil (தமிழ்)** (ta)
- 🇮🇳 **Bengali (বাংলা)** (bn)
- 🇮🇳 **Telugu (తెలుగు)** (te)
- 🇮🇳 **Marathi (मराठी)** (mr)
- 🇪🇸 **Spanish (Español)** (es)

## Features

### 1. **Language Switcher Component**

- Beautiful dropdown UI with flag emojis
- Persistent language selection (saved in localStorage)
- Smooth animations and transitions
- Mobile-responsive design

### 2. **Automatic Language Detection**

- Detects browser language on first visit
- Falls back to English if language not supported
- Remembers user's language preference

### 3. **Complete Coverage**

All pages are translated including:

- ✅ Landing Page
- ✅ Login Page
- ✅ Registration Page
- ✅ Dashboard
- ✅ Issue Certificate
- ✅ Verify Certificate
- ✅ Navigation & Footer

## File Structure

```
client/src/
├── i18n.js                          # i18n configuration
├── locales/                         # Translation files
│   ├── en.json                      # English
│   ├── hi.json                      # Hindi
│   ├── ta.json                      # Tamil
│   ├── bn.json                      # Bengali
│   ├── te.json                      # Telugu
│   ├── mr.json                      # Marathi
│   └── es.json                      # Spanish
└── components/
    ├── LanguageSwitcher.js          # Language selector component
    └── LanguageSwitcher.css         # Styles
```

## Usage

### Adding Translation to a Page

1. Import the translation hook:

```javascript
import { useTranslation } from "react-i18next";
```

2. Use the hook in your component:

```javascript
const { t } = useTranslation();
```

3. Use translations in JSX:

```javascript
<h1>{t('hero.title')}</h1>
<p>{t('hero.subtitle')}</p>
```

### Example Implementation

```javascript
import React from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const MyPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <LanguageSwitcher />
      <h1>{t("nav.features")}</h1>
      <p>{t("hero.subtitle")}</p>
      <button>{t("common.submit")}</button>
    </div>
  );
};

export default MyPage;
```

## Translation Keys Structure

### Navigation (`nav.*`)

- `nav.features` - Features link
- `nav.howItWorks` - How it Works link
- `nav.benefits` - Benefits link
- `nav.verifyCertificate` - Verify Certificate button
- `nav.issueCertificate` - Issue Certificate button
- `nav.dashboard` - Dashboard link
- `nav.profile` - Profile link
- `nav.logout` - Logout button
- `nav.login` - Login button
- `nav.register` - Register button

### Hero Section (`hero.*`)

- `hero.title` - Main title
- `hero.subtitle` - Subtitle
- `hero.getStarted` - Get Started button
- `hero.stats.certificates` - Certificates stat label
- `hero.stats.institutes` - Institutes stat label
- `hero.stats.verified` - Verified stat label

### Features (`features.*`)

- `features.title` - Section title
- `features.subtitle` - Section subtitle
- `features.blockchain.title` - Blockchain feature title
- `features.blockchain.description` - Blockchain feature description
- etc.

### Common Elements (`common.*`)

- `common.loading` - Loading text
- `common.error` - Error message
- `common.success` - Success message
- `common.save` - Save button
- `common.cancel` - Cancel button
- `common.submit` - Submit button
- etc.

## Adding a New Language

1. **Create translation file**:

   - Create a new JSON file in `src/locales/` (e.g., `fr.json` for French)
   - Copy the structure from `en.json`
   - Translate all values

2. **Import in i18n.js**:

```javascript
import frTranslations from "./locales/fr.json";
```

3. **Add to resources**:

```javascript
const resources = {
  // ... existing languages
  fr: {
    translation: frTranslations,
  },
};
```

4. **Update LanguageSwitcher.js**:

```javascript
const languages = [
  // ... existing languages
  { code: "fr", name: "Français", flag: "🇫🇷" },
];
```

## Best Practices

### 1. **Consistent Key Naming**

- Use dot notation for nested keys
- Group related translations together
- Use descriptive names

### 2. **Avoid Hardcoded Text**

❌ Bad:

```javascript
<button>Submit</button>
```

✅ Good:

```javascript
<button>{t("common.submit")}</button>
```

### 3. **Handle Plurals**

For plural forms, use i18next's plural feature:

```json
{
  "certificate": "Certificate",
  "certificate_plural": "Certificates"
}
```

### 4. **Dynamic Values**

Use interpolation for dynamic content:

```javascript
{
  t("welcome", { name: user.name });
}
```

Translation file:

```json
{
  "welcome": "Welcome, {{name}}!"
}
```

## Testing

### Manual Testing

1. Open the application
2. Click the language switcher (Globe icon)
3. Select different languages
4. Verify all text changes correctly
5. Check that language persists on page reload

### Verify Coverage

- Navigate through all pages
- Check all buttons, labels, and messages
- Test form validation messages
- Verify error messages display correctly

## Browser Compatibility

The i18next library works on:

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

## Performance

- Translation files are loaded only once
- Lazy loading can be implemented for larger apps
- Minimal bundle size impact (~50KB for all languages)

## Future Enhancements

### Planned Features

1. **More Languages**

   - Kannada (ಕನ್ನಡ)
   - Gujarati (ગુજરાતી)
   - Malayalam (മലയാളം)
   - Punjabi (ਪੰਜਾਬੀ)

2. **RTL Support**

   - Add support for right-to-left languages (Arabic, Urdu)

3. **Language Auto-Detection**

   - Detect user location and suggest language

4. **Translation Management**
   - Admin panel for managing translations
   - Community translation contributions

## Support

For issues or questions about multilingual support:

1. Check translation files in `src/locales/`
2. Verify i18n configuration in `src/i18n.js`
3. Ensure `useTranslation` hook is imported correctly

## Contributing

To add or improve translations:

1. Fork the repository
2. Add/edit translation files in `src/locales/`
3. Test thoroughly
4. Submit a pull request

---

**Last Updated**: October 2025
**Version**: 1.0.0
