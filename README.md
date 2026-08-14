# Академия ДПО — многостраничный сайт

Премиальный сайт учебного центра дополнительного профессионального образования
(ДПО). Глубокий синий + золото, Playfair Display + Inter, mobile-first, GSAP,
particles.js, Swiper, доступность WCAG AA.

## ✨ Архитектура управления контентом

Контент вынесен в **единый конфигурационный файл** — админ меняет данные в одном
месте, обновление происходит на всех страницах автоматически.

### Как изменить контент (для администратора)

| Что изменить | Файл | Где именно |
|---|---|---|
| Телефон, email, адрес, лицензия | `js/config.js` | блок `SITE` |
| Пункты меню (шапка + футер) | `js/config.js` | `NAV_ITEMS` |
| Счётчики статистики hero | `js/config.js` | `STATS` |
| Направления и профессии | `js/config.js` | `DIRECTIONS` |
| Курсы (название, цена, формат, описание) | `js/config.js` | `COURSES` |
| Преимущества + иконки | `js/config.js` | `ADVANTAGES` |
| Отзывы | `js/config.js` | `REVIEWS` |
| Партнёры | `js/config.js` | `PARTNERS` |
| Вопросы FAQ | `js/config.js` | `FAQ_ITEMS` |
| Соцсети | `js/config.js` | `SOCIAL` |
| Ссылки футера | `js/config.js` | `FOOTER_LINKS` |
| Города (адреса, телефоны, координаты) | `js/geo-data.js` | `CITIES` |
| Пути к картинкам | `js/config.js` | `IMAGES` |

**Не нужно редактировать HTML-страницы** — header, footer, карточки курсов, форма
select, отзывы и FAQ рендерятся из конфига через `js/components.js`.

### Порядок подключения скриптов (важно!)

```html
<script src="js/config.js" defer></script>      <!-- 1. источник контента -->
<script src="js/geo-data.js" defer></script>    <!-- 2. данные городов -->
<script src="js/components.js" defer></script>   <!-- 3. рендер header/footer/блоков -->
<script src="js/main.js" defer></script>         <!-- 4. анимации, валидация, Schema.org -->
```

## 📂 Структура проекта

```
.
├── index.html              # Главная (hero, табы, курсы, отзывы, FAQ, форма)
├── about.html              # О компании
├── courses.html            # Каталог курсов с фильтром
├── teachers.html          # Преподаватели
├── reviews.html           # Отзывы
├── b2b.html               # Корпоративным клиентам
├── blog.html              # Блог
├── faq.html               # Частые вопросы
├── contacts.html          # Контакты + форма заявки
├── policy.html            # Политика конфиденциальности (152-ФЗ)
├── city.html              # Динамические гео-страницы (?city=slug)
├── css/
│   └── styles.css         # Дизайн-система (CSS-переменные, BEM, mobile-first)
├── js/
│   ├── config.js          # Единый конфиг контента (контакты, курсы, отзывы…)
│   ├── geo-data.js        # Данные 30 городов (координаты, адреса, расписание)
│   ├── components.js      # Рендер header/footer + переиспользуемые блоки + city selector
│   └── main.js            # GSAP, particles, Swiper, табы, FAQ, форма, Schema.org
├── robots.txt             # SEO
├── sitemap.xml            # 41 URL (11 страниц + 30 городов)
└── docs/                  # Анализ, концепция, отчёты
```

## 🎨 Дизайн-система

Цвета и шрифты — в CSS-переменных (`css/styles.css` → `:root`):

```css
--bg-deep: #1A2332;   --bg-deeper: #0F1623;   --bg-panel: #243049;
--gold: #FFD700;      --gold-dim: #E8B100;    --white: #FFFFFF;
--ff-head: "Playfair Display";  --ff-body: "Inter";
--radius-card: 16px;  --ease: cubic-bezier(0.4, 0, 0.2, 1);
```

Классы по BEM: `.hero__title`, `.course-card`, `.btn--primary`, `.section--dark`.

## 🗺️ Гео-страницы

`city.html?city=moscow` — динамически рендерит контакты филиала, карту
(Яндекс.Карты по координатам), доступные курсы и список всех 30 городов.
Город выбирается в шапке (city selector, запоминается в localStorage).

## ⚡ Микроразметка Schema.org

- `EducationalOrganization` + `Course` (с `offers`) — на всех страницах
- `LocalBusiness` (с `geo`) — на гео-страницах городов

## 🚀 Запуск

Сайт статичный, не требует сборки:

```bash
python3 -m http.server 8000
# или
npx serve
```

Откройте `http://localhost:8000`.

## ♿ Доступность

- ARIA-роли, контраст WCAG AA, фокус-стили, клавиатура
- `prefers-reduced-motion` отключает тяжёлые анимации
- Fallback'и: контент виден даже если CDN-библиотеки не загрузились

## 📝 Лицензия

Демонстрационный проект. Все контактные данные — демонстрационные.
