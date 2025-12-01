# Звіт про CI/CD для Habit Tracker

Автор: Сас Євгеній  
Група: ІО-31  
Дата: 01 грудня 2025

## Continuous Integration

### Налаштування

- **Платформа**: GitHub Actions
- **Тригер**: push/pull_request на main
- **PostgreSQL**: Service container (postgres:16-alpine)

### Етапи CI Pipeline

1. Checkout коду
2. Встановлення Node.js 20
3. Встановлення залежностей (npm ci)
4. Lint перевірка
5. Type checking (TypeScript)
6. Генерація Prisma Client
7. Міграції БД
8. Запуск тестів (38 unit/integration/e2e)
9. Білд проєкту

### Результати

- Всі тести проходять
- Code coverage: 68%
- Білд успішний
- Час виконання: ~1 хвилина

## Continuous Deployment

### Налаштування

- **Платформа**: Railway
- **Тригер**: push на main
- **База даних**: PostgreSQL (автоматично створюється)

### Етапи CD Pipeline

1. Build: `npm ci && npx prisma generate && npm run build`
2. Міграції: `npx prisma migrate deploy`
3. Start: `npm run start:prod`

## Проблеми та рішення

**Проблема 1**: Race conditions в тестах
**Рішення**: maxWorkers: 1 в Jest config

**Проблема 2**: Різні емейли між тестами
**Рішення**: Унікальні емейли для кожного тесту

## Висновок

CI/CD pipeline повністю автоматизований. Кожен push перевіряється тестами і автоматично деплоїться на production.
