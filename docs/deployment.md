# Інструкція з розгортання Habit Tracker

Автор: Сас Євгеній
Група: ІО-31
Дата: 01 грудня 2025

## CI/CD Pipeline

Проєкт використовує GitHub Actions для автоматичного тестування та деплою.

### Continuous Integration (CI)

При кожному push або pull request на main запускається:

1. Lint перевірка коду
2. TypeScript type checking
3. Запуск unit, integration та E2E тестів
4. Білд проєкту

Конфігурація: `.github/workflows/ci.yml`

### Continuous Deployment (CD)

При push на main автоматично відбувається деплой на Railway.

Конфігурація: `.github/workflows/cd.yml`

## Railway Deployment

### Підготовка

1. PostgreSQL база даних створюється автоматично на Railway
2. Змінні оточення налаштовані через Railway Dashboard

### Необхідні змінні оточення

```
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-production-secret-key
PORT=3000
NODE_ENV=production
```

### Команди деплою

Build:

```bash
npm ci
npx prisma generate
npm run build
```

Start:

```bash
npx prisma migrate deploy
npm run start:prod
```

## Локальне тестування production білду

```bash
# Білд проєкту
npm run build

# Запуск production версії
npm run start:prod
```

## Endpoints

- GET / - API документація
- GET /health - Health check
- POST /api/auth/register - Реєстрація
- POST /api/auth/login - Логін
- GET /api/habits - Список звичок (auth)
- POST /api/habits - Створити звичку (auth)
- PATCH /api/habits/:id - Оновити звичку (auth)
- DELETE /api/habits/:id - Видалити звичку (auth)

## Моніторинг

- GitHub Actions: автоматичні тести при кожному push
- Railway Dashboard: логи, метрики, статус сервісу
- Health endpoint: /health для перевірки статусу

## Troubleshooting

**Проблема**: Тести падають в CI
**Рішення**: Перевірте PostgreSQL service в ci.yml

**Проблема**: Деплой не працює
**Рішення**: Перевірте змінні оточення в Railway Dashboard

**Проблема**: База даних не підключається
**Рішення**: Перевірте DATABASE_URL та доступність PostgreSQL
