"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "RU" | "EN";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  RU: {
    dashboard: "Дашборд",
    documents: "Документы",
    account: "Аккаунт",
    settings: "Настройки",
    logout: "Выйти",
    login: "Войти",
    register: "Регистрация",
    welcome: "Добро пожаловать",
    newDocument: "Создать документ",
    save: "Сохранить",
    cancel: "Отмена",
    theme: "Тема оформления",
    language: "Язык интерфейса",
    light: "Светлая",
    dark: "Темная",
    totalDocs: "Всего документов",
    pending: "На согласовании",
    approved: "Утвержден",
    rejected: "Отклонен",
    title: "Название",
    status: "Статус",
    author: "Автор",
    date: "Дата",
    open: "Открыть",
    features: "Возможности",
    about: "О сервисе",
    heroTitle: "Управляйте документами быстрее и безопаснее",
    heroDesc: "AuroDocs — это современная система электронного документооборота для малого и среднего бизнеса.",
    startWork: "Начать работу",
    createAccount: "Создать аккаунт",
    statsTotal: "Всего документов",
    statsPending: "На согласовании",
    statsApproved: "Утверждено",
    statsRejected: "Отклонено",
    recentDocs: "Недавние документы",
    viewAll: "Посмотреть все",
    noDocs: "У вас пока нет документов",
    createFirst: "Создайте свой первый документ прямо сейчас",
    newDocBtn: "Новый документ",
    nameLabel: "Имя",
    lastNameLabel: "Фамилия",
    emailLabel: "Email",
    saveChanges: "Сохранить изменения",
    profileInfo: "Управление личной информацией",
    interfaceSettings: "Базовые параметры интерфейса",
    themeToggle: "Переключение темы",
    langToggle: "Язык интерфейса",
  },
  EN: {
    dashboard: "Dashboard",
    documents: "Documents",
    account: "Account",
    settings: "Settings",
    logout: "Sign Out",
    login: "Login",
    register: "Register",
    welcome: "Welcome",
    newDocument: "New Document",
    save: "Save",
    cancel: "Cancel",
    theme: "Theme Mode",
    language: "Language",
    light: "Light",
    dark: "Dark",
    totalDocs: "Total Documents",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    title: "Title",
    status: "Status",
    author: "Author",
    date: "Date",
    open: "Open",
    features: "Features",
    about: "About",
    heroTitle: "Manage documents faster and safer",
    heroDesc: "AuroDocs is a modern document management system for small and medium businesses.",
    startWork: "Get Started",
    createAccount: "Create Account",
    statsTotal: "Total Documents",
    statsPending: "Pending Approval",
    statsApproved: "Approved",
    statsRejected: "Rejected",
    recentDocs: "Recent Documents",
    viewAll: "View All",
    noDocs: "No documents yet",
    createFirst: "Create your first document right now",
    newDocBtn: "New Document",
    nameLabel: "First Name",
    lastNameLabel: "Last Name",
    emailLabel: "Email",
    saveChanges: "Save Changes",
    profileInfo: "Manage your personal information",
    interfaceSettings: "Basic interface settings",
    themeToggle: "Theme Switching",
    langToggle: "Interface Language",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("RU");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language;
    if (savedLang) setLangState(savedLang);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  };

  const t = (key: string) => {
    return translations[lang][key as keyof typeof translations["RU"]] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
