import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

i18n
	.use(initReactI18next)
	.use(
		resourcesToBackend(
			(language: String, namespace: String) =>
				import(`./locales/${language}/${namespace}.json`)
		)
	)
	.init({
		fallbackLng: 'en',
		defaultNS: 'common',
		interpolation: {
			escapeValue: false // React already escapes by default.
		},
		ns: ['common', 'pages']
	});
