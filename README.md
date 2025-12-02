# Habit Tracker

Веб-застосунок для відстеження звичок та формування позитивних життєвих паттернів через систематизацію щоденних дій.

## Опис проєкту

Habit Tracker - це інструмент для формування та підтримки корисних звичок через візуалізацію прогресу, систему streak (послідовних днів виконання) та детальну аналітику. Застосунок допомагає користувачам створювати, відслідковувати та аналізувати свої щоденні звички для досягнення особистих цілей.

## Цільова аудиторія

- Студенти, які хочуть систематизувати навчання
- Спортсмени для відстеження тренувань
- Люди, які працюють над self-improvement
- Будь-хто, хто прагне сформувати нові позитивні звички

## Функціональність

### MVP (Minimum Viable Product)

- Реєстрація та аутентифікація користувачів
- Створення, редагування та видалення звичок
- Категоризація звичок (здоров'я, спорт, навчання, фінанси)
- Щоденне відстеження виконання звичок
- Базова статистика (streak, completion rate)
- Календарний вигляд історії виконання

### Розширений функціонал

- Система досягнень та нагород
- Графіки та візуалізація прогресу
- Встановлення цілей та дедлайнів
- Push-нагадування
- Експорт даних та звітів
- Social features (поділитися досягненнями)

## Технологічний стек

### Backend

- **Runtime**: Node.js v20+ (асинхронна обробка запитів)
- **Framework**: Express.js (швидкий та мінімалістичний)
- **Мова**: TypeScript (type safety, краща підтримка IDE)
- **База даних**: PostgreSQL (ACID властивості, складні запити з датами)
- **ORM**: Prisma (type-safe database access)
- **Аутентифікація**: JWT (stateless authentication)
- **Валідація**: Zod (runtime type checking)
- **Тестування**: Jest, Supertest (unit, integration, e2e tests)
- **Мутаційне тестування**: Stryker
- **Performance**: autocannon, clinic.js

### DevOps

- **Контейнеризація**: Docker (PostgreSQL)
- **CI/CD**: GitHub Actions
- **Deployment**: Railway (або Render)
- **Version Control**: Git, GitHub

### Оптимізації

- **Кешування**: node-cache (in-memory)
- **Compression**: gzip
- **Rate Limiting**: express-rate-limit
- **Utils Package**: @freazg/habit-tracker-utils

## Обґрунтування вибору технологій

### Node.js + Express.js

- Асинхронна обробка запитів для високої продуктивності
- Великий ecosystem пакетів
- Єдина мова (JavaScript/TypeScript) для всього стеку
- Легке масштабування

### PostgreSQL

- ACID властивості для консистентності даних
- Чудова підтримка роботи з датами та часовими рядами
- Ефективні JOIN операції для складних запитів
- Надійність та стабільність

### Prisma ORM

- Type-safe database queries
- Автоматична міграція схеми
- Генерація TypeScript типів
- Чудова підтримка PostgreSQL

### Docker

- Консистентність середовища розробки та production
- Легке розгортання та масштабування
- Ізоляція залежностей

### GitHub Actions

- Безкоштовний CI/CD для open-source проєктів
- Інтеграція з GitHub
- Гнучкі workflow

## Етапи розробки

### Lab 0: Вибір ідеї та опис проєкту

- Опис проєкту та функціональності
- Вибір технологічного стеку
- Обґрунтування рішень

### Lab 1: Налаштування середовища розробки

- Ініціалізація проєкту (npm, TypeScript)
- Налаштування ESLint, Prettier
- Git hooks (Husky, lint-staged)
- Базова структура проєкту

### Lab 2: Проектування архітектури

- ER діаграма бази даних
- API endpoints документація
- Архітектурні рішення
- User flow діаграми
- Prisma schema

### Lab 3: Розробка інтерактивного прототипу

- REST API з in-memory storage
- CRUD операції для звичок
- Аутентифікація (JWT)
- Валідація даних (Zod)
- Базові тести

### Lab 4: Інтеграція з віддаленими джерелами даних

- Підключення PostgreSQL через Docker
- Prisma міграції
- Repositories layer з Prisma
- Database seeding

### Lab 5: Тестування програмного забезпечення

- Unit тести (Jest)
- Integration тести
- E2E тести (Supertest)
- Мутаційне тестування (Stryker)
- Code coverage (68%)

### Lab 6: Розгортання програмного забезпечення

- GitHub Actions CI (lint, tests, build)
- GitHub Actions CD
- Railway configuration
- Production deployment

### Lab 7: Аналіз продуктивності

- Load testing (autocannon): 9,164 req/sec
- CPU profiling (clinic.js)
- Latency analysis: 10ms (p50)
- Performance benchmarks

### Lab 8: Оптимізація та рефакторинг

- Кешування (node-cache)
- Compression (gzip)
- Rate limiting
- Створення npm пакету

## Метрики успіху

- Покриття тестами: 68%
- Mutation score: 68%
- API response time: 10-13ms (p50)
- Performance: 9,164 req/sec
- Lighthouse score: 90+ (плановано для frontend)
- Zero критичних вразливостей
- CI/CD повністю автоматизовано

## Оптимізації (Lab 8)

### Реалізовані покращення

- In-memory кешування (node-cache)
- Response compression (gzip)
- Rate limiting (захист від зловживань)
- Окремий npm пакет для utils

### Створений пакет

**@freazg/habit-tracker-utils**  
Репозиторій: https://github.com/Freazg/habit-tracker-utils

Містить переиспользуємі функції для роботи з паролями та JWT токенами.

## Документація

- [Архітектура](docs/architecture.md)
- [База даних](docs/database.md)
- [Користувацькі сценарії](docs/user-scenarios.md)
- [Тестування](docs/testing/test-report.md)
- [CI/CD](docs/ci-cd-report.md)
- [Деплой](docs/deployment.md)
- [Продуктивність](docs/performance/benchmark-report.md)
- [Оптимізація](docs/optimization-report.md)

## Результати

### Метрики

- **Code Coverage**: 68%
- **Mutation Score**: 68%
- **Performance**: 9,164 req/sec (health endpoint)
- **Latency**: 10ms (p50), 18ms (p99)
- **CI/CD**: GitHub Actions

### Технології

Node.js, TypeScript, Express, PostgreSQL, Prisma, Jest, Docker, GitHub Actions

## Автор

Сас Євгеній  
Група: ІО-31  
Email: qwerty2015f5@gmail.com  
GitHub: [@Freazg](https://github.com/Freazg)
