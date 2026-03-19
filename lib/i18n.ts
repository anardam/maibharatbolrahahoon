export type Locale = "hi" | "en";

const translations = {
  hi: {
    siteName: "Mai Bharat Bol Raha Hoon",
    tagline: "भारत की आवाज़, भारत की कहानी",
    heroSubtitle: "News, Stories & Videos",
    noArticles: "अभी कोई लेख प्रकाशित नहीं हुआ है।",
    noArticlesHint: "लेख प्रकाशित होने पर यहाँ दिखाई देंगे।",
    home: "होम",
    search: "खोजें",
    admin: "एडमिन",
    allRights: "सर्वाधिकार सुरक्षित।",
    readMore: "और पढ़ें",
    categories: "विषय",
    latestArticles: "ताज़ा लेख",
  },
  en: {
    siteName: "Mai Bharat Bol Raha Hoon",
    tagline: "Voice of India, Story of India",
    heroSubtitle: "News, Stories & Videos",
    noArticles: "No articles published yet.",
    noArticlesHint: "Articles will appear here once published.",
    home: "Home",
    search: "Search",
    admin: "Admin",
    allRights: "All rights reserved.",
    readMore: "Read more",
    categories: "Categories",
    latestArticles: "Latest Articles",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["hi"];

export function getTranslations(locale: Locale) {
  return translations[locale];
}

export function getDateLocale(locale: Locale) {
  return locale === "hi" ? "hi-IN" : "en-IN";
}
