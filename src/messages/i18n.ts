import { writable, get } from 'svelte/store';
import fr from './fr.json';
import en from './en.json';

export type Locale = 'fr' | 'en';

export const translations = {
    fr,
    en
};

export function getTranslations(locale: Locale) {
    return translations[locale] || translations.fr;
}

// Store réactif pour la locale
export const locale = writable<Locale>('fr');

export const setLocale = (newLocale: Locale) => {
    locale.set(newLocale);
    return newLocale;
};
/*
Returns the translation for the given slug and locale.
The slug is a concatenation of the path to the translation ex. project.list.0.title
@param slug
@param locale
@returns The translation
*/
export function t(newLocale: Locale, slug: string) {
    return findSlugInT(translations[newLocale], slug);
}

function findSlugInT(t: any, slug: string) {
    let here = t;
    try {
        for (const key of slug.split('.')) {
            here = here[key];
        }
        return here;
    } catch (error) {
        console.error(`Translation not found for slug: ${slug}`);
        return slug;
    }
}