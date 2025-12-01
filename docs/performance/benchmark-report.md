# Звіт з аналізу продуктивності Habit Tracker

Автор: Сас Євгеній  
Група: ІО-31  
Дата: 01 грудня 2025

## Методологія тестування

### Інструменти

- **autocannon**: HTTP load testing
- **clinic.js**: CPU/Memory profiling
- **Node.js**: v20.19.6
- **PostgreSQL**: 16-alpine

### Середовище тестування

- OS: Ubuntu 24.04 (WSL2)
- CPU: 22 threads
- RAM: Доступна для Docker
- База даних: PostgreSQL в Docker

## Результати Load Testing

### Test 1: Health Endpoint (простий JSON response)

**Параметри:**

- Connections: 100
- Duration: 30 секунд
- Endpoint: GET /health

**Результати:**

- **Requests/sec: 9,164.74**
- **Latency (avg): 10.42ms**
- **Latency (p50): 9ms**
- **Latency (p99): 18ms**
- **Total requests: 275,000**
- **Throughput: 2.65 MB/sec**

**Аналіз:**
Відмінна продуктивність для простих endpoints. Сервер легко обробляє 9k+ запитів в секунду з низькою латентністю.

### Test 2: Auth Login Endpoint (bcrypt + DB)

**Параметри:**

- Connections: 50
- Duration: 20 секунд
- Endpoint: POST /api/auth/login
- Payload: JSON з email/password

**Результати:**

- **Requests/sec: 3,579.9**
- **Latency (avg): 13.47ms**
- **Latency (p50): 13ms**
- **Latency (p99): 24ms**
- **Total requests: 72,000**
- **Throughput: 988 KB/sec**

**Аналіз:**
Auth endpoint повільніший через bcrypt хешування (10 rounds) та запити до БД. Це очікувано і прийнятно для production. Латентність залишається низькою (<15ms середня).

## CPU Profiling

**Результати clinic doctor:**

- HTML звіт: `.clinic/29300.clinic-doctor.html`
- Event loop: стабільний, без блокувань
- CPU usage: помірне навантаження
- Bottlenecks: bcrypt операції (очікувано)

**Рекомендації:**

- Bcrypt - це CPU-intensive операція, що є нормальним
- Для масштабування можна додати rate limiting на auth endpoints
- Connection pooling для БД вже налаштований через Prisma

## Memory Profiling

**Базове використання:**

- Startup memory: ~50-80 MB
- Under load: стабільне, без memory leaks
- Garbage collection: працює коректно

## Аналіз БД

**PostgreSQL Performance:**

- Connection pooling: активний через Prisma
- Query performance: <5ms для простих запитів
- Index usage: ефективний (user_id, habit_id indices)

**Найчастіші запити:**

1. SELECT users (auth)
2. SELECT habits (list operations)
3. INSERT habit_logs (logging)

## Порівняння з industry standards

| Metric              | Наш результат | Industry Standard | Оцінка      |
| ------------------- | ------------- | ----------------- | ----------- |
| Health endpoint RPS | 9,164         | 5,000-10,000      | ✅ Відмінно |
| Auth RPS            | 3,579         | 1,000-5,000       | ✅ Відмінно |
| API Latency (p50)   | 9-13ms        | <50ms             | ✅ Відмінно |
| API Latency (p99)   | 18-24ms       | <100ms            | ✅ Відмінно |

## Висновки

### Сильні сторони

1. Висока пропускна здатність (9k+ RPS для простих endpoints)
2. Низька латентність (<15ms середня)
3. Стабільна робота під навантаженням
4. Ефективне використання БД через Prisma

### Слабкі місця

1. Auth endpoints повільніші через bcrypt (це security trade-off)
2. Без кешування для часто запитуваних даних

### Рекомендації для оптимізації (Lab 8)

1. Додати in-memory кешування (node-cache) для categories
2. Rate limiting для auth endpoints
3. Response compression (gzip)
4. Connection pooling optimization
5. Lazy loading для великих списків

## Метрики для моніторингу в production

- **Response time** (target: p95 < 50ms)
- **Throughput** (target: >1000 RPS)
- **Error rate** (target: <0.1%)
- **Database connection pool** (target: <80% usage)
- **Memory usage** (target: stable, no leaks)
