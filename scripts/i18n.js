document.addEventListener('DOMContentLoaded', function () {
    const supportedLanguages = ['en', 'fr', 'es', 'pl', 'hr', 'cz', 'it', 'pt', 'de', 'ru', 'tr', 'el'];
    const languageLabels = {
        en: 'EN',
        fr: 'FR',
        es: 'ES',
        pl: 'PL',
        hr: 'HR',
        cz: 'CZ',
        it: 'IT',
        pt: 'PT',
        de: 'DE',
        ru: 'RU',
        tr: 'TR',
        el: 'EL'
    };
    const languageFlags = {
        en: '🇬🇧',
        fr: '🇫🇷',
        es: '🇪🇸',
        pl: '🇵🇱',
        hr: '🇭🇷',
        cz: '🇨🇿',
        it: '🇮🇹',
        pt: '🇵🇹',
        de: '🇩🇪',
        ru: '🇷🇺',
        tr: '🇹🇷',
        el: '🇬🇷'
    };
    const defaultLanguage = 'en';
    const storageKey = 'siteLanguage';
    const translationsCache = {};
    let currentLanguage = defaultLanguage;
    let dropdownsInitialized = false;

    function closeAllLanguageDropdowns() {
        const dropdowns = document.querySelectorAll('.language-switcher');
        dropdowns.forEach((dropdown) => {
            dropdown.classList.remove('open');
            const toggle = dropdown.querySelector('.language-switcher-toggle');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function initLanguageDropdowns() {
        if (dropdownsInitialized) {
            return;
        }
        dropdownsInitialized = true;
        const dropdowns = document.querySelectorAll('.language-switcher');
        dropdowns.forEach((dropdown) => {
            const toggle = dropdown.querySelector('.language-switcher-toggle');
            const menu = dropdown.querySelector('.language-switcher-menu');
            if (!toggle || !menu) {
                return;
            }
            toggle.addEventListener('click', (event) => {
                event.stopPropagation();
                const isOpen = dropdown.classList.contains('open');
                closeAllLanguageDropdowns();
                if (!isOpen) {
                    dropdown.classList.add('open');
                    toggle.setAttribute('aria-expanded', 'true');
                }
            });
            menu.addEventListener('click', (event) => {
                event.stopPropagation();
            });
        });
        document.addEventListener('click', closeAllLanguageDropdowns);
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeAllLanguageDropdowns();
            }
        });
    }

    function getValueByKey(dictionary, key) {
        if (!dictionary || !key) {
            return undefined;
        }
        return key.split('.').reduce((accumulator, part) => {
            if (accumulator && Object.prototype.hasOwnProperty.call(accumulator, part)) {
                return accumulator[part];
            }
            return undefined;
        }, dictionary);
    }

    function applyTranslations(activeDictionary, fallbackDictionary) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach((element) => {
            const key = element.getAttribute('data-i18n');
            const useHtml = element.getAttribute('data-i18n-html') === 'true';
            const activeValue = getValueByKey(activeDictionary, key);
            const fallbackValue = activeValue === undefined ? getValueByKey(fallbackDictionary, key) : undefined;
            const finalValue = activeValue !== undefined ? activeValue : fallbackValue !== undefined ? fallbackValue : '';

            if (useHtml) {
                element.innerHTML = finalValue;
            } else {
                element.textContent = finalValue;
            }
        });
    }

    function fetchTranslations(language) {
        if (translationsCache[language]) {
            return Promise.resolve(translationsCache[language]);
        }

        return fetch(`i18n/${language}.json`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Unable to load translations for ${language}`);
                }
                return response.json();
            })
            .then((data) => {
                translationsCache[language] = data;
                return data;
            });
    }

    function updateLanguageButtons(language) {
        const label = languageLabels[language] || language.toUpperCase();
        const flag = languageFlags[language] || '';
        const buttons = document.querySelectorAll('[data-lang-option]');
        buttons.forEach((button) => {
            const isActive = button.getAttribute('data-lang-option') === language;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
            button.setAttribute('aria-selected', String(isActive));
        });
        const currentLabels = document.querySelectorAll('[data-current-language]');
        currentLabels.forEach((node) => {
            node.textContent = label;
        });
        const currentFlags = document.querySelectorAll('[data-current-flag]');
        currentFlags.forEach((node) => {
            node.textContent = flag;
        });
    }

    function loadAndApplyLanguage(language) {
        return fetchTranslations(language)
            .then((dictionary) => {
                const fallbackDictionary = translationsCache[defaultLanguage] || dictionary;
                applyTranslations(dictionary, fallbackDictionary);
                currentLanguage = language;
                localStorage.setItem(storageKey, language);
                updateLanguageButtons(language);
                closeAllLanguageDropdowns();
            })
            .catch(() => {
                if (language !== defaultLanguage) {
                    currentLanguage = defaultLanguage;
                    updateLanguageButtons(defaultLanguage);
                    applyTranslations(translationsCache[defaultLanguage], translationsCache[defaultLanguage]);
                    closeAllLanguageDropdowns();
                }
            });
    }

    function initLanguageSwitcher() {
        const buttons = document.querySelectorAll('[data-lang-option]');
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const selectedLanguage = button.getAttribute('data-lang-option');
                if (selectedLanguage && supportedLanguages.includes(selectedLanguage) && selectedLanguage !== currentLanguage) {
                    loadAndApplyLanguage(selectedLanguage);
                }
            });
        });
    }

    fetchTranslations(defaultLanguage)
        .then((dictionary) => {
            applyTranslations(dictionary, dictionary);
            currentLanguage = defaultLanguage;
            initLanguageSwitcher();
            initLanguageDropdowns();
            const savedLanguage = localStorage.getItem(storageKey);
            const languageToLoad = savedLanguage && supportedLanguages.includes(savedLanguage) ? savedLanguage : defaultLanguage;
            updateLanguageButtons(languageToLoad);
            if (languageToLoad !== defaultLanguage) {
                return loadAndApplyLanguage(languageToLoad);
            }
            return null;
        })
        .catch(() => {
            initLanguageSwitcher();
            initLanguageDropdowns();
            updateLanguageButtons(defaultLanguage);
        });
});

