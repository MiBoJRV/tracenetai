document.addEventListener('DOMContentLoaded', function () {
    const supportedLanguages = ['en', 'fr'];
    const defaultLanguage = 'en';
    const storageKey = 'siteLanguage';
    const translationsCache = {};
    let currentLanguage = defaultLanguage;

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
        const buttons = document.querySelectorAll('[data-lang-option]');
        buttons.forEach((button) => {
            const isActive = button.getAttribute('data-lang-option') === language;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
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
            })
            .catch(() => {
                if (language !== defaultLanguage) {
                    currentLanguage = defaultLanguage;
                    updateLanguageButtons(defaultLanguage);
                    applyTranslations(translationsCache[defaultLanguage], translationsCache[defaultLanguage]);
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
            updateLanguageButtons(defaultLanguage);
        });
});

