# АРХИТЕКТУРНЫЙ ПЛАН: К Студия — Сайт салона красоты

**Версия:** 1.0
**Дата:** 18 марта 2026
**Стек:** Next.js 14 + Tailwind CSS + Sanity.io + Yclients + Vercel

---

## 1. Общая архитектура системы

```
┌─────────────────────────────────────────────────────────────┐
│                        КЛИЕНТ (браузер)                      │
│         iPhone Safari / Android Chrome / Desktop             │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────────┐
│                    VERCEL CDN / Edge                         │
│              (глобальный CDN, SSL, деплой)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  NEXT.JS 14 APP                              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  Static pages│  │  SSR pages   │  │   API Routes      │  │
│  │  (SSG/ISR)   │  │  (на сервере)│  │  /api/contact     │  │
│  └──────────────┘  └──────────────┘  └───────────────────┘  │
└────┬───────────────────┬──────────────────────┬─────────────┘
     │                   │                      │
┌────▼────┐       ┌──────▼──────┐        ┌─────▼──────┐
│ Sanity  │       │  Yclients   │        │ Cloudinary │
│  CMS    │       │  Booking    │        │  Images    │
│(контент)│       │  API/Widget │        │   CDN      │
└─────────┘       └─────────────┘        └────────────┘
     │
     └── Данные: услуги, мастера, галерея, отзывы, тексты
```

---

## 2. Структура Next.js проекта

```
k-studio/
│
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx                # Root layout (Header, Footer, Analytics)
│   ├── page.tsx                  # Главная /
│   │
│   ├── uslugi/
│   │   ├── page.tsx              # /uslugi — все услуги
│   │   ├── volosy/
│   │   │   └── page.tsx          # /uslugi/volosy (SEO landing)
│   │   ├── manikyur/
│   │   │   └── page.tsx          # /uslugi/manikyur (SEO landing)
│   │   └── makiyazh/
│   │       └── page.tsx          # /uslugi/makiyazh (SEO landing)
│   │
│   ├── gallery/
│   │   └── page.tsx              # /gallery — галерея работ
│   │
│   ├── masters/
│   │   ├── page.tsx              # /masters — список мастеров
│   │   └── [slug]/
│   │       └── page.tsx          # /masters/[name] — профиль мастера
│   │
│   ├── about/
│   │   └── page.tsx              # /about — о студии
│   │
│   ├── contacts/
│   │   └── page.tsx              # /contacts — контакты
│   │
│   ├── booking/
│   │   └── page.tsx              # /booking — онлайн-запись
│   │
│   ├── faq/
│   │   └── page.tsx              # /faq — частые вопросы
│   │
│   ├── privacy/
│   │   └── page.tsx              # /privacy — политика
│   │
│   └── api/
│       └── contact/
│           └── route.ts          # POST /api/contact — форма обратной связи
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # Sticky header + мобильный drawer
│   │   ├── Footer.tsx            # Footer с адресом и соцсетями
│   │   ├── MobileBookingBtn.tsx  # Floating кнопка «Записаться» на mobile
│   │   └── WhatsAppButton.tsx    # Fixed WhatsApp кнопка
│   │
│   ├── home/
│   │   ├── HeroSection.tsx       # Hero с фото + CTA
│   │   ├── TrustBar.tsx          # «4.9★ · 68 отзывов · 10:00–21:00»
│   │   ├── ServicesPreview.tsx   # 4–6 карточек услуг
│   │   ├── AboutSnippet.tsx      # Мини-блок «О студии»
│   │   ├── GalleryPreview.tsx    # 9 лучших фото
│   │   ├── MastersPreview.tsx    # 3–4 карточки мастеров
│   │   ├── ReviewsCarousel.tsx   # Карусель отзывов
│   │   └── BookingCTA.tsx        # Полноширинный CTA блок
│   │
│   ├── services/
│   │   ├── ServiceCard.tsx       # Карточка одной услуги
│   │   ├── ServiceCategory.tsx   # Блок категории (волосы/маникюр/etc)
│   │   └── CategoryTabs.tsx      # Табы фильтрации
│   │
│   ├── gallery/
│   │   ├── MasonryGrid.tsx       # Masonry grid фотографий
│   │   ├── GalleryFilter.tsx     # Фильтры по категориям
│   │   ├── Lightbox.tsx          # Полноэкранный просмотр
│   │   └── BeforeAfterSlider.tsx # До/после слайдер
│   │
│   ├── masters/
│   │   ├── MasterCard.tsx        # Карточка мастера (список)
│   │   ├── MasterProfile.tsx     # Полный профиль мастера
│   │   └── MasterGallery.tsx     # Мини-галерея работ мастера
│   │
│   ├── booking/
│   │   └── YclientsWidget.tsx    # Виджет Yclients (iframe/script)
│   │
│   ├── ui/                       # Базовые UI компоненты
│   │   ├── Button.tsx            # Primary / Secondary / Ghost
│   │   ├── Card.tsx              # Базовая карточка
│   │   ├── Badge.tsx             # Бейдж (категория услуги)
│   │   ├── Section.tsx           # Обёртка секции с padding
│   │   ├── Container.tsx         # Max-width контейнер
│   │   └── OptimizedImage.tsx    # next/image обёртка (WebP)
│   │
│   └── seo/
│       ├── SchemaOrg.tsx         # LocalBusiness + BeautySalon JSON-LD
│       └── ServiceSchema.tsx     # Service JSON-LD для страниц услуг
│
├── lib/
│   ├── sanity/
│   │   ├── client.ts             # Sanity клиент
│   │   ├── queries.ts            # GROQ запросы
│   │   └── image.ts              # urlFor helper
│   │
│   ├── yclients/
│   │   └── config.ts             # Yclients виджет конфигурация
│   │
│   └── utils/
│       ├── seo.ts                # generateMetadata helper
│       └── analytics.ts          # GA4 события
│
├── sanity/                       # Sanity Studio (CMS)
│   ├── schemas/
│   │   ├── service.ts            # Схема: услуга
│   │   ├── master.ts             # Схема: мастер
│   │   ├── galleryPhoto.ts       # Схема: фото галереи
│   │   ├── review.ts             # Схема: отзыв
│   │   ├── faqItem.ts            # Схема: вопрос FAQ
│   │   └── siteSettings.ts       # Схема: настройки сайта
│   └── sanity.config.ts
│
├── public/
│   ├── logo.svg                  # Логотип К Студия
│   ├── favicon.ico
│   └── og-image.jpg              # Default Open Graph image
│
├── styles/
│   └── globals.css               # Tailwind base + custom CSS vars
│
├── tailwind.config.ts            # Tailwind: цвета бренда, шрифты
├── next.config.ts                # Next.js конфигурация
├── .env.local                    # Секреты (Sanity token, Yclients key)
└── package.json
```

---

## 3. Sanity CMS — Схемы данных

### 3.1 Услуга (`service`)
```typescript
{
  name: string           // «Окрашивание волос»
  slug: string           // «okrashivanie-volos»
  category: enum         // 'volosy' | 'manikyur' | 'makiyazh' | 'spa'
  description: text      // 2–3 строки описания
  duration: string       // «60–90 мин»
  priceFrom: number      // 8000 (в тенге)
  priceTo: number        // 25000 (необязательно)
  image: image           // Фото услуги (Cloudinary)
  isPopular: boolean     // Показывать на главной
  sortOrder: number
}
```

### 3.2 Мастер (`master`)
```typescript
{
  name: string           // «Айгуль Сейткали»
  slug: string           // «ajgul-sejtkali»
  photo: image           // Профессиональный портрет
  specialization: string // «Колорист, парикмахер»
  experience: string     // «7 лет в профессии»
  bio: text              // 2–3 предложения
  services: service[]    // Ссылки на услуги которые оказывает
  gallery: image[]       // 6 работ мастера
  isActive: boolean
  sortOrder: number
}
```

### 3.3 Фото галереи (`galleryPhoto`)
```typescript
{
  image: image           // Фото работы
  category: enum         // 'volosy' | 'manikyur' | 'makiyazh' | 'spa'
  master: master         // Ссылка на мастера
  service: service       // Ссылка на услугу
  isBeforeAfter: boolean // Это пара до/после?
  beforeImage: image     // Фото «до» (если isBeforeAfter)
  caption: string        // Короткое описание (необязательно)
  isFeatured: boolean    // Показывать на главной
  publishedAt: datetime
}
```

### 3.4 Отзыв (`review`)
```typescript
{
  author: string         // «Айгерим К.»
  avatar: image          // Фото клиента (необязательно)
  rating: number         // 5
  text: text             // Текст отзыва
  service: string        // «Окрашивание»
  source: enum           // '2gis' | 'google' | 'instagram' | 'direct'
  date: date
  isVisible: boolean
}
```

### 3.5 Настройки сайта (`siteSettings`) — singleton
```typescript
{
  salonName: string      // «К Студия»
  address: string        // «Кабанбай батыр пр., 58Б, Астана»
  phone: string          // «+7-705-117-XXXX»
  whatsapp: string       // «+7-705-117-XXXX»
  instagram: string      // «k_studio_01»
  workingHours: string   // «Ежедневно 10:00–21:00»
  twoGisUrl: string      // 2GIS ссылка
  yclientsId: string     // ID компании в Yclients
  ogImage: image         // Default OG image
}
```

---

## 4. Рендеринг страниц (SSG vs SSR)

| Страница | Стратегия | Ревалидация | Причина |
|----------|-----------|-------------|---------|
| Главная `/` | **ISR** | 60 мин | Меняется контент (галерея, акции) |
| Услуги `/uslugi` | **SSG** | При изменении | Редко обновляется, критично для SEO |
| `/uslugi/volosy` и др. | **SSG** | При изменении | SEO landing pages — максимальная скорость |
| Галерея `/gallery` | **ISR** | 30 мин | Часто добавляются фото |
| Мастера `/masters` | **ISR** | 24 ч | Редко меняется |
| `/masters/[slug]` | **ISR** | 24 ч | Профиль мастера |
| О студии `/about` | **SSG** | При изменении | Статичный контент |
| Контакты `/contacts` | **SSG** | При изменении | Статичный + карта |
| FAQ `/faq` | **ISR** | 6 ч | Иногда обновляется |
| Booking `/booking` | **CSR** | — | Виджет Yclients работает на клиенте |
| Политика `/privacy` | **SSG** | При изменении | Полностью статичный |

---

## 5. SEO архитектура

### 5.1 Metadata для каждой страницы

```typescript
// lib/utils/seo.ts — шаблон метаданных
export function generateMetadata(page: PageType): Metadata {
  return {
    title: `${page.title} | К Студия — Астана`,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      images: [{ url: page.ogImage, width: 1200, height: 630 }],
      locale: 'ru_KZ',
      type: 'website',
    },
    alternates: {
      canonical: `https://kstudio.kz${page.path}`,
    },
  }
}
```

### 5.2 Schema.org разметка (JSON-LD)

**На главной странице — LocalBusiness:**
```json
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "BeautySalon"],
  "name": "К Студия",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Кабанбай батыр проспект, 58Б",
    "addressLocality": "Астана",
    "addressCountry": "KZ"
  },
  "telephone": "+7-705-117-XXXX",
  "openingHours": "Mo-Su 10:00-21:00",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "68"
  },
  "url": "https://kstudio.kz",
  "sameAs": [
    "https://www.instagram.com/k_studio_01/",
    "https://2gis.kz/astana/firm/70000001104862663"
  ]
}
```

### 5.3 URL структура (финальная)

```
/                              → Главная
/uslugi                        → Все услуги
/uslugi/volosy                 → Волосы (SEO: «стрижка Астана»)
/uslugi/manikyur               → Маникюр (SEO: «маникюр Астана»)
/uslugi/makiyazh               → Макияж + брови + ресницы
/gallery                       → Галерея
/masters                       → Команда
/masters/[slug]                → Профиль мастера
/about                         → О студии
/contacts                      → Контакты
/booking                       → Онлайн-запись
/faq                           → FAQ
/privacy                       → Политика конфиденциальности
```

---

## 6. Производительность — критические решения

### 6.1 Изображения
```
Загружает клиент → Sanity → Cloudinary CDN → WebP автоматически
                                           → Resize по viewport
                                           → Lazy loading (below fold)
                                           → Blur placeholder (LQIP)
```

**Лимиты:**
- Hero image: `priority={true}` — загружается немедленно (LCP)
- Gallery: lazy loading + `sizes` атрибут
- Максимум 200 КБ на изображение в мобильном viewport

### 6.2 Шрифты
```typescript
// app/layout.tsx
import { Cormorant_Garamond, Montserrat } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600'],
  display: 'swap',           // Не блокирует рендер
  variable: '--font-heading',
})

const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-body',
})
```

### 6.3 Целевые показатели
| Метрика | Цель | Как достигаем |
|---------|------|--------------|
| LCP | < 2.5 сек | Hero image `priority`, Cloudinary CDN |
| CLS | < 0.1 | Зарезервированные размеры для изображений |
| INP | < 200 мс | Минимум JS на клиенте (SSG/ISR) |
| Bundle size | < 150 КБ JS | Tree-shaking, динамический импорт для тяжёлых компонентов |

---

## 7. Интеграции — архитектура

### 7.1 Yclients Booking Widget
```typescript
// components/booking/YclientsWidget.tsx
// Виджет встраивается как iframe или через JS SDK
// Конфигурация: ID компании + цветовая схема бренда

const YCLIENTS_CONFIG = {
  companyId: process.env.NEXT_PUBLIC_YCLIENTS_ID,
  primaryColor: '#C9A96E',  // Золотой акцент К Студии
  lang: 'ru',
}
```

**Flow записи:**
```
Пользователь нажимает «Записаться»
  → Открывается /booking (или drawer поверх страницы)
  → Yclients виджет: выбор услуги
  → Выбор мастера
  → Выбор даты и времени
  → Ввод имени и телефона
  → Подтверждение → SMS/WhatsApp уведомление клиенту
  → Уведомление администратору
```

### 7.2 Аналитика
```typescript
// lib/utils/analytics.ts — кастомные события GA4

export const trackEvent = {
  bookingStarted: () => gtag('event', 'booking_started'),
  bookingCompleted: () => gtag('event', 'booking_completed'),
  whatsappClicked: () => gtag('event', 'whatsapp_clicked'),
  phoneClicked: () => gtag('event', 'phone_clicked'),
  galleryOpened: (category: string) =>
    gtag('event', 'gallery_opened', { category }),
  masterViewed: (masterName: string) =>
    gtag('event', 'master_profile_viewed', { master: masterName }),
}
```

### 7.3 Карта 2GIS (приоритет для Казахстана)
```typescript
// components/contacts/Map2GIS.tsx
// Embed через iframe — самый надёжный способ для KZ аудитории

<iframe
  src="https://widgets.2gis.com/widget?type=firmsonmap&options=..."
  width="100%"
  height="400"
  loading="lazy"
/>
// + ссылка «Открыть в 2GIS» для мобильных (открывает приложение)
```

---

## 8. Переменные окружения

```bash
# .env.local (НИКОГДА не коммитить в git!)

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=xxx          # Только серверная сторона

# Yclients
NEXT_PUBLIC_YCLIENTS_COMPANY_ID=xxx

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx

# Analytics
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_YM_ID=XXXXXXXX     # Яндекс.Метрика

# Contact form (Resend или SendGrid)
RESEND_API_KEY=xxx
CONTACT_EMAIL=info@kstudio.kz
```

---

## 9. Что важно НЕ делать (Anti-patterns)

| ❌ Антипаттерн | ✅ Правильно | Причина |
|---------------|-------------|---------|
| Все страницы на CSR | SSG/ISR для контентных страниц | SEO — Google не видит CSR контент |
| Хранить фото в `/public` | Cloudinary CDN | Размер репозитория, нет WebP конвертации |
| `import` всей иконочной библиотеки | Импортировать только нужные иконки | Bundle size |
| Один файл стилей на всё | Tailwind utility classes + CSS Modules | Поддерживаемость |
| Телефоны клиентов в БД сайта | Yclients обрабатывает данные | GDPR / закон РК о персональных данных |
| Автозапуск видео на hero | Статичное фото для hero | LCP, расход трафика клиента |
| Встроить Google Fonts через `<link>` | `next/font/google` | Нет дополнительных запросов |
| Кириллические URL | Транслит URL `/uslugi/volosy` | Копируемость ссылок, SEO |

---

## 10. Порядок разработки (рекомендуемый)

```
1. Настройка среды (Next.js + Tailwind + Sanity + Vercel)    — 1 день
2. UI Kit: цвета, шрифты, Button, Card, Container            — 1 день
3. Header + Footer + Layout                                  — 1 день
4. Главная страница (все секции без реального контента)      — 2 дня
5. Страница услуг + карточки                                 — 1 день
6. Галерея + Lightbox + Before/After                         — 2 дня
7. Мастера + профили                                         — 1 день
8. О студии + Контакты + FAQ                                 — 1 день
9. Booking страница + Yclients виджет                        — 1 день
10. Sanity CMS схемы + подключение данных                    — 2 дня
11. SEO: Schema, метатеги, sitemap                           — 1 день
12. Аналитика: GA4 + Яндекс.Метрика события                 — 0.5 дня
13. Производительность: WebP, lazy, Lighthouse audit         — 1 день
14. Наполнение контентом через Sanity                        — 2 дня
15. Кросс-браузерное тестирование                           — 1 день
─────────────────────────────────────────────────────────────
ИТОГО: ~18–19 рабочих дней (≈ 4 недели)
```

---

*Архитектурный план К Студия v1.0 — 18 марта 2026*
