import uiZh from '../locales/ui.zh-CN.js';
import uiJa from '../locales/ui.ja.js';
import htmlZh from '../locales/html.zh-CN.js';
import htmlJa from '../locales/html.ja.js';
import skillsZh from '../locales/skills.zh-CN.js';
import skillsJa from '../locales/skills.ja.js';
import contentZh from '../locales/content.zh-CN.js';
import contentJa from '../locales/content.ja.js';

export const SUPPORTED_LOCALES = Object.freeze(['zh-CN', 'ja']);
export const DEFAULT_LOCALE = 'zh-CN';
export function resolveLocale(search = '') {
  const requested = new URLSearchParams(search).get('lang');
  return SUPPORTED_LOCALES.includes(requested) ? requested : DEFAULT_LOCALE;
}
export const locale = resolveLocale(globalThis.location?.search);
export const catalogs = Object.freeze({
  'zh-CN': Object.freeze({ ...uiZh, ...htmlZh, ...skillsZh, ...contentZh }),
  ja: Object.freeze({ ...uiJa, ...htmlJa, ...skillsJa, ...contentJa }),
});

// Messages and markup are repository-owned. Never pass user-authored HTML here.
// Replace in a single pass so values containing {braces} remain literal values.
export function translate(language, key, params = {}) {
  const messages = catalogs[language] || catalogs[DEFAULT_LOCALE];
  const message = messages[key] ?? catalogs[DEFAULT_LOCALE][key];
  if (message == null) throw new RangeError(`Missing translation: ${key}`);
  return message.replace(/\{([a-zA-Z][\w]*)\}/g, (token, name) => {
    if (!Object.hasOwn(params, name)) throw new TypeError(`Missing ${name} for ${key}`);
    return String(params[name]);
  });
}
export const t = (key, params) => translate(locale, key, params);

export function applyTranslations(root = document) {
  root.documentElement.lang = locale;
  for (const element of root.querySelectorAll('[data-i18n]')) {
    element.textContent = t(element.dataset.i18n);
  }
  for (const attribute of ['aria-label', 'content']) {
    for (const element of root.querySelectorAll(`[data-i18n-${attribute}]`)) {
      element.setAttribute(attribute, t(element.getAttribute(`data-i18n-${attribute}`)));
    }
  }
  for (const element of root.querySelectorAll('.logo-top [data-c]')) element.dataset.c = element.textContent;
}

// Reload deliberately: module-time catalogs and the tour then share one locale.
// Keeping language in the URL leaves the existing progress storage untouched.
export function changeLocale(language) {
  if (!SUPPORTED_LOCALES.includes(language)) throw new RangeError('Unsupported locale');
  const url = new URL(location.href);
  url.searchParams.set('lang', language);
  location.assign(url.href);
}
