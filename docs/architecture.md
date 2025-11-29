# Архітектура Habit Tracker

Автор: Сас Євгеній
Група: ІО-31
Дата: 29 листопада 2025

## Огляд системи

Habit Tracker - це веб-застосунок побудований за принципом REST API на backend та SPA на frontend. Система використовує трирівневу архітектуру: презентаційний рівень (API endpoints), бізнес-логіка (services) та рівень доступу до даних (repositories/models).

## Компоненти системи

### Backend компоненти

Система складається з наступних основних модулів:

**API Layer** - точка входу для всіх HTTP запитів. Включає роутери для кожного ресурсу (users, habits, logs, categories), middleware для валідації, аутентифікації та обробки помилок. Відповідає за парсинг запитів, валідацію вхідних даних та формування відповідей.

**Service Layer** - містить бізнес-логіку застосунку. Модуль AuthService відповідає за реєстрацію, логін, генерацію JWT токенів. HabitService управляє CRUD операціями для звичок, валідує бізнес-правила. LogService обробляє записи виконання звичок, рахує streak. StatisticsService агрегує дані для звітів та аналітики.

**Repository Layer** - абстракція для роботи з базою даних через Prisma ORM. UserRepository, HabitRepository, LogRepository, CategoryRepository інкапсулюють SQL запити та забезпечують єдиний інтерфейс доступу до даних.

**Database Layer** - PostgreSQL база даних з таблицями users, habits, habit_logs, categories. Prisma виступає як ORM та забезпечує міграції схеми.

**Middleware** - проміжні обробники запитів. Authentication middleware перевіряє JWT токени. Validation middleware валідує payload через Zod схеми. Error handler middleware централізовано обробляє помилки. Logger middleware логує всі запити.

### Взаємодія компонентів

Типовий flow запиту виглядає наступним чином. Client надсилає HTTP запит до API endpoint. Request проходить через middleware chain (logger, authentication, validation). Router направляє запит до відповідного controller. Controller викликає потрібний service метод. Service виконує бізнес-логіку та звертається до repository. Repository через Prisma виконує запит до PostgreSQL. Результат повертається назад через всі шари до client.

### Діаграма компонентів

```
┌─────────────────────────────────────────────────────────┐
│                        Client                           │
│                    (Browser/Mobile)                     │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS
                     ▼
┌─────────────────────────────────────────────────────────┐
│                     API Gateway                         │
│              (Express.js Application)                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Auth       │  │   Logger     │  │  Validator   │   │
│  │  Middleware  │  │  Middleware  │  │  Middleware  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Router Layer                        │   │
│  │  /auth  /habits  /logs  /categories  /stats      │   │
│  └──────────────────────────────────────────────────┘   │
│                         │                               │
└─────────────────────────┼───────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Service Layer                         │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────────┐   │
│  │   Auth      │ │    Habit     │ │   Statistics    │   │
│  │   Service   │ │   Service    │ │    Service      │   │
│  └─────────────┘ └──────────────┘ └─────────────────┘   │
│  ┌─────────────┐ ┌──────────────┐                       │
│  │    Log      │ │   Category   │                       │
│  │   Service   │ │   Service    │                       │
│  └─────────────┘ └──────────────┘                       │
└─────────────────────────┬───────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 Repository Layer                        │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────────┐   │
│  │    User     │ │    Habit     │ │   HabitLog      │   │
│  │ Repository  │ │  Repository  │ │   Repository    │   │
│  └─────────────┘ └──────────────┘ └─────────────────┘   │
│  ┌─────────────┐                                        │
│  │  Category   │                                        │
│  │ Repository  │                                        │
│  └─────────────┘                                        │
└─────────────────────────┬───────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Prisma ORM                           │
└─────────────────────────┬───────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                    │
│         (users, habits, habit_logs, categories)         │
└─────────────────────────────────────────────────────────┘
```

## Структура проекту

Файлова структура організована наступним чином:

```
src/
├── index.ts                 # Entry point
├── config/                  # Configuration files
│   ├── database.ts          # DB connection
│   └── env.ts               # Environment variables
├── middleware/              # Express middleware
│   ├── auth.middleware.ts   # JWT authentication
│   ├── validation.middleware.ts
│   ├── error.middleware.ts
│   └── logger.middleware.ts
├── routes/                  # API routes
│   ├── auth.routes.ts
│   ├── habits.routes.ts
│   ├── logs.routes.ts
│   ├── categories.routes.ts
│   └── stats.routes.ts
├── controllers/             # Request handlers
│   ├── auth.controller.ts
│   ├── habits.controller.ts
│   ├── logs.controller.ts
│   ├── categories.controller.ts
│   └── stats.controller.ts
├── services/                # Business logic
│   ├── auth.service.ts
│   ├── habit.service.ts
│   ├── log.service.ts
│   ├── category.service.ts
│   └── statistics.service.ts
├── repositories/            # Data access layer
│   ├── user.repository.ts
│   ├── habit.repository.ts
│   ├── log.repository.ts
│   └── category.repository.ts
├── models/                  # TypeScript types/interfaces
│   ├── user.model.ts
│   ├── habit.model.ts
│   ├── log.model.ts
│   └── category.model.ts
├── utils/                   # Utility functions
│   ├── jwt.util.ts
│   ├── password.util.ts
│   ├── date.util.ts
│   └── streak.util.ts
└── validators/              # Zod validation schemas
    ├── auth.validator.ts
    ├── habit.validator.ts
    └── log.validator.ts
```

## Принципи проектування

**Separation of Concerns** - кожен шар має чітко визначену відповідальність. Controllers обробляють HTTP, services містять логіку, repositories працюють з даними.

**Dependency Injection** - залежності передаються через конструктори, що полегшує тестування та заміну імплементацій.

**Single Responsibility** - кожен модуль/клас має одну причину для зміни.

**DRY (Don't Repeat Yourself)** - спільна логіка винесена в утиліти та базові класи.

## Технологічний стек компонентів

**Runtime**: Node.js v20
**Framework**: Express.js
**Language**: TypeScript
**ORM**: Prisma
**Database**: PostgreSQL
**Validation**: Zod
**Authentication**: JWT + bcrypt
**Testing**: Jest + Supertest
**Documentation**: OpenAPI/Swagger (буде додано пізніше)
