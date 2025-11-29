# Сценарії використання Habit Tracker

Автор: Сас Євгеній
Група: ІО-31
Дата: 29 листопада 2025

## Огляд

Документ описує ключові сценарії використання системи та як дані оновлюються і змінюються в процесі виконання цих сценаріїв.

## Сценарій 1: Реєстрація нового користувача

### Опис

Новий користувач реєструється в системі для початку відстеження звичок.

### Крок за кроком

**Крок 1**: Користувач надсилає POST запит на `/api/auth/register` з даними (email, password, name, timezone).

**Крок 2**: AuthController отримує запит і передає дані в ValidationMiddleware. Zod схема перевіряє формат email, довжину паролю (мінімум 8 символів), наявність обов'язкових полів.

**Крок 3**: AuthService отримує валідовані дані. Перевіряє чи email вже існує в базі через UserRepository.findByEmail(). Якщо існує - повертає помилку 409 Conflict.

**Крок 4**: AuthService хешує пароль за допомогою bcrypt (10 rounds). Генерує UUID для нового користувача.

**Крок 5**: AuthService викликає UserRepository.create() який через Prisma створює новий запис в таблиці users.

**Крок 6**: AuthService генерує JWT токен з payload (userId, email). Токен підписується секретним ключем та має термін дії 7 днів.

**Крок 7**: Відповідь повертається клієнту з статусом 201 Created. Payload містить JWT токен та базову інформацію користувача (без паролю).

### Зміни в базі даних

```sql
INSERT INTO users (id, email, password, name, timezone, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'user@example.com',
  '$2b$10$hashed_password',
  'Іван Петренко',
  'Europe/Kiev',
  NOW(),
  NOW()
);
```

### Діаграма потоку даних

```
Client → POST /api/auth/register
  ↓
ValidationMiddleware (Zod)
  ↓
AuthController.register()
  ↓
AuthService.register()
  ├→ UserRepository.findByEmail() → Prisma → DB (SELECT)
  ├→ bcrypt.hash(password)
  ├→ UserRepository.create() → Prisma → DB (INSERT)
  └→ jwt.sign({ userId, email })
  ↓
Response 201 { token, user }
```

## Сценарій 2: Створення нової звички

### Опис

Авторизований користувач створює нову звичку для відстеження.

### Крок за кроком

**Крок 1**: Користувач надсилає POST запит на `/api/habits` з JWT токеном в заголовку Authorization та даними звички (title, description, frequency, categoryId, targetDays).

**Крок 2**: AuthMiddleware перевіряє JWT токен. Витягує userId з токену та додає до req.user. Якщо токен невалідний або прострочений - повертає 401 Unauthorized.

**Крок 3**: ValidationMiddleware перевіряє дані звички. Title не порожній (1-200 символів), frequency може бути тільки 'daily' або 'weekly', targetDays валідний JSON масив чисел 0-6 для weekly звичок.

**Крок 4**: HabitController отримує запит і передає дані в HabitService.

**Крок 5**: HabitService перевіряє чи існує категорія (якщо categoryId передано) через CategoryRepository.findById(). Якщо не існує - повертає 404 Not Found.

**Крок 6**: HabitService валідує бізнес-правила. Для weekly звичок targetDays обов'язковий і не порожній. Для daily звичок targetDays має бути null або порожній.

**Крок 7**: HabitService викликає HabitRepository.create() який через Prisma створює новий запис в таблиці habits з user_id з токену.

**Крок 8**: Відповідь повертається клієнту з статусом 201 Created та даними створеної звички.

### Зміни в базі даних

```sql
INSERT INTO habits (id, user_id, category_id, title, description, frequency, target_days, is_active, created_at, updated_at)
VALUES (
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440000',
  '770e8400-e29b-41d4-a716-446655440002',
  'Ранкова пробіжка',
  'Біг 5 км в парку',
  'weekly',
  '[1,3,5]',
  true,
  NOW(),
  NOW()
);
```

### Діаграма потоку даних

```
Client → POST /api/habits (+ JWT token)
  ↓
AuthMiddleware (verify JWT)
  ↓
ValidationMiddleware (Zod)
  ↓
HabitController.create()
  ↓
HabitService.create()
  ├→ CategoryRepository.findById() → Prisma → DB (SELECT)
  ├→ Business rules validation
  └→ HabitRepository.create() → Prisma → DB (INSERT)
  ↓
Response 201 { habit }
```

## Сценарій 3: Відмітка виконання звички

### Опис

Користувач відмічає звичку як виконану за конкретний день.

### Крок за кроком

**Крок 1**: Користувач надсилає POST запит на `/api/habits/:habitId/logs` з JWT токеном та даними (date, completed, note).

**Крок 2**: AuthMiddleware перевіряє токен та витягує userId.

**Крок 3**: ValidationMiddleware перевіряє формат дати (YYYY-MM-DD), completed має бути boolean.

**Крок 4**: LogController передає дані в LogService.

**Крок 5**: LogService перевіряє чи звичка належить користувачу. Викликає HabitRepository.findById() та порівнює habit.userId з req.user.userId. Якщо не співпадає - повертає 403 Forbidden.

**Крок 6**: LogService перевіряє чи вже існує запис для цієї звички на цю дату через LogRepository.findByHabitAndDate(). Якщо існує - оновлює його (UPDATE), якщо ні - створює новий (INSERT).

**Крок 7**: Після створення/оновлення запису LogService викликає StatisticsService.updateStreak() для перерахунку поточного streak користувача для цієї звички.

**Крок 8**: StatisticsService витягує всі записи для звички відсортовані по даті. Рахує найдовший streak (максимальна кількість днів поспіль) та поточний streak (кількість днів від останнього пропуску до сьогодні).

**Крок 9**: Streak зберігається в кеші або окремій таблиці statistics (буде визначено пізніше).

**Крок 10**: Відповідь повертається з оновленими даними log та поточним streak.

### Зміни в базі даних

```sql
-- Якщо запису немає (перша відмітка на цей день)
INSERT INTO habit_logs (id, habit_id, date, completed, note, created_at)
VALUES (
  '880e8400-e29b-41d4-a716-446655440003',
  '660e8400-e29b-41d4-a716-446655440001',
  '2025-11-29',
  true,
  'Пробіг 6 км',
  NOW()
);

-- Якщо запис вже існує (повторна відмітка)
UPDATE habit_logs
SET completed = true, note = 'Пробіг 6 км'
WHERE habit_id = '660e8400-e29b-41d4-a716-446655440001'
  AND date = '2025-11-29';
```

### Алгоритм підрахунку streak

```
1. Витягти всі habit_logs для звички де completed = true, ORDER BY date DESC
2. Ініціалізувати current_streak = 0, max_streak = 0, temp_streak = 0
3. Для кожного запису:
   - Якщо це перший запис: temp_streak = 1, prev_date = date
   - Якщо date = prev_date - 1 день: temp_streak++
   - Якщо date < prev_date - 1 день:
       max_streak = MAX(max_streak, temp_streak)
       temp_streak = 1
   - prev_date = date
4. current_streak = temp_streak (якщо останній запис був вчора або сьогодні)
5. max_streak = MAX(max_streak, temp_streak)
```

### Діаграма потоку даних

```
Client → POST /api/habits/:habitId/logs (+ JWT)
  ↓
AuthMiddleware
  ↓
ValidationMiddleware
  ↓
LogController.create()
  ↓
LogService.create()
  ├→ HabitRepository.findById() → DB (SELECT habits)
  ├→ Check ownership (habit.userId === req.user.userId)
  ├→ LogRepository.findByHabitAndDate() → DB (SELECT habit_logs)
  ├→ LogRepository.createOrUpdate() → DB (INSERT/UPDATE habit_logs)
  └→ StatisticsService.updateStreak()
      └→ LogRepository.findAllByHabit() → DB (SELECT habit_logs)
      └→ Calculate streak algorithm
  ↓
Response 200 { log, currentStreak, maxStreak }
```

## Сценарій 4: Отримання статистики за період

### Опис

Користувач переглядає статистику виконання звичок за обраний період.

### Крок за кроком

**Крок 1**: Користувач надсилає GET запит на `/api/stats?period=week&habitId=xxx` з JWT токеном.

**Крок 2**: AuthMiddleware перевіряє токен.

**Крок 3**: ValidationMiddleware перевіряє параметри. Period може бути 'week', 'month', 'year'. HabitId опціональний (якщо не вказано - статистика по всіх звичках).

**Крок 4**: StatisticsController передає параметри в StatisticsService.

**Крок 5**: StatisticsService визначає діапазон дат на основі period. Для 'week' - останні 7 днів, 'month' - 30 днів, 'year' - 365 днів.

**Крок 6**: Якщо habitId вказано - перевіряє чи звичка належить користувачу.

**Крок 7**: StatisticsService викликає LogRepository.findByDateRange() з фільтрами (userId, habitId, startDate, endDate). Prisma виконує складний JOIN запит.

**Крок 8**: StatisticsService агрегує дані. Рахує total виконань, відсоток успішності (completed / total days), розподіл по днях тижня, середню кількість виконань на тиждень.

**Крок 9**: Для кожної звички рахує поточний та максимальний streak.

**Крок 10**: Дані форматуються та повертаються клієнту.

### SQL запит для агрегації

```sql
SELECT
  h.id,
  h.title,
  COUNT(hl.id) as total_logs,
  SUM(CASE WHEN hl.completed = true THEN 1 ELSE 0 END) as completed_count,
  ROUND(AVG(CASE WHEN hl.completed = true THEN 1.0 ELSE 0.0 END) * 100, 2) as completion_rate
FROM habits h
LEFT JOIN habit_logs hl ON h.id = hl.habit_id
WHERE h.user_id = '550e8400-e29b-41d4-a716-446655440000'
  AND hl.date BETWEEN '2025-11-22' AND '2025-11-29'
GROUP BY h.id, h.title
ORDER BY completion_rate DESC;
```

### Діаграма потоку даних

```
Client → GET /api/stats?period=week (+ JWT)
  ↓
AuthMiddleware
  ↓
ValidationMiddleware
  ↓
StatisticsController.getStats()
  ↓
StatisticsService.calculateStats()
  ├→ Calculate date range based on period
  ├→ HabitRepository.findById() (if habitId provided)
  ├→ LogRepository.findByDateRange() → DB (SELECT with JOIN and aggregation)
  ├→ Aggregate data (total, percentage, distribution)
  └→ Calculate streaks
  ↓
Response 200 { statistics, habits, period }
```

## Сценарій 5: Редагування звички

### Опис

Користувач оновлює інформацію про існуючу звичку.

### Крок за кроком

**Крок 1**: Користувач надсилає PATCH запит на `/api/habits/:habitId` з JWT токеном та оновленими даними (title, description, frequency, targetDays).

**Крок 2**: AuthMiddleware перевіряє токен.

**Крок 3**: ValidationMiddleware перевіряє нові дані за тими ж правилами що і при створенні.

**Крок 4**: HabitController передає дані в HabitService.

**Крок 5**: HabitService витягує звичку з бази через HabitRepository.findById().

**Крок 6**: Перевіряє чи звичка належить користувачу (habit.userId === req.user.userId). Якщо ні - 403 Forbidden.

**Крок 7**: Валідує зміни. Якщо frequency змінюється з 'daily' на 'weekly' - вимагає targetDays. Якщо з 'weekly' на 'daily' - очищає targetDays.

**Крок 8**: Якщо змінюється categoryId - перевіряє чи нова категорія існує.

**Крок 9**: HabitRepository.update() виконує UPDATE запит. Оновлює поле updated_at.

**Крок 10**: Відповідь повертається з оновленими даними звички.

### Зміни в базі даних

```sql
UPDATE habits
SET
  title = 'Вечірня пробіжка',
  description = 'Біг 3 км перед сном',
  frequency = 'daily',
  target_days = NULL,
  updated_at = NOW()
WHERE id = '660e8400-e29b-41d4-a716-446655440001'
  AND user_id = '550e8400-e29b-41d4-a716-446655440000';
```

## Загальні принципи роботи з даними

**Транзакційність** - всі операції що змінюють кілька таблиць виконуються в транзакціях через Prisma для забезпечення ACID властивостей.

**Валідація на кількох рівнях** - дані перевіряються на рівні middleware (Zod), service (бізнес-правила) та database (constraints).

**Оптимістичні оновлення** - клієнт може оновлювати UI оптимістично перед отриманням відповіді від сервера для кращого UX.

**Кешування** - статистика та streak можуть кешуватись на певний час (5-15 хвилин) для зменшення навантаження на БД.

**Soft delete** - звички не видаляються фізично, а позначаються як неактивні (is_active = false) для збереження історії.
