import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                "FANTASY": "Fantasy",
                "fictional_literature": "Fictional Literature",
                // Adicione os outros gêneros aqui
            }
        },
        pt: {
            translation: {
                "FANTASY": "Fantasia",
                "fictional_literature": "Literatura Ficcional",
                // Traduções para outros gêneros aqui
            }
        }
    },
    lng: "pt", // idioma padrão
    fallbackLng: "en", // idioma de fallback
    interpolation: {
        escapeValue: false
    }
});

export default i18n;
