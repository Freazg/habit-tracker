# Звіт з тестування Habit Tracker

Автор: Сас Євгеній  
Група: ІО-31  
Дата: 01 грудня 2025

## Статистика тестів

- Unit тести: 25 (AuthService, HabitService, CategoryService, LogService)
- Integration тести: 6 (Auth endpoints)
- E2E тести: 8 (повний workflow звичок)
- Всього: 38 тестів, всі пройшли

## Code Coverage

- Statements: 68.82%
- Branches: 44.04%
- Functions: 68.85%
- Lines: 67.97%

## Мутаційне тестування

- Mutation Score: 68.13%
- Мутантів вбито: 124 з 182
- Виживших: 9

### Результати по модулях

- AuthService: 100%
- CategoryService: 100%
- HabitService: 72.15%
- LogService: 50%

## Висновок

Проєкт має якісне покриття тестами. Критичні модулі (Auth) покриті на 100%. Мутаційне тестування підтвердило високу якість тестів.
