# 🚀 HemaWeb - Руководство по Развертыванию

## Предварительные требования

- Node.js >= 22.14.0
- pnpm >= 10.22.0
- Docker Desktop (для PostgreSQL и Redis)
- Git

## 1. Клонирование и Установка

```bash
# Клонировать репозиторий
git clone https://github.com/a-voronkov/hemaweb.git
cd hemaweb

# Установить зависимости
pnpm install
```

## 2. Настройка Окружения

### 2.1 Запуск Docker (PostgreSQL + Redis)

```bash
# Запустить контейнеры
docker-compose up -d

# Проверить статус
docker-compose ps
```

### 2.2 Настройка переменных окружения

#### Backend (`apps/api/.env`):
```env
# Database
DATABASE_URL="postgresql://hemaweb:hemaweb@localhost:5432/hemaweb"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# Email (опционально - для тестирования используйте Ethereal)
EMAIL_PROVIDER="ethereal"  # или "mailjet" для production
MAILJET_API_KEY="your-mailjet-api-key"
MAILJET_SECRET_KEY="your-mailjet-secret-key"
EMAIL_FROM="noreply@hemaweb.world"
```

#### Frontend (`apps/web/.env.local`):
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

## 3. Инициализация Базы Данных

```bash
# Применить миграции
pnpm db:migrate add_notification_preferences_extended

# Заполнить справочные данные
pnpm db:seed
```

## 4. Сборка Проекта

```bash
# Собрать все пакеты
pnpm build
```

## 5. Запуск в Development Mode

```bash
# Запустить все приложения
pnpm dev

# Или запустить отдельно:
# Backend
pnpm --filter api dev

# Frontend
pnpm --filter @hemaweb/web dev
```

Приложения будут доступны:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Docs (Swagger): http://localhost:4000/api

## 6. Создание Тестовых Пользователей

### 6.1 Через API (Swagger UI)

1. Откройте http://localhost:4000/api
2. Используйте endpoint `POST /auth/register` для создания пользователей

### 6.2 Через SQL (для быстрого тестирования)

```sql
-- Создать донора
INSERT INTO users (id, email, password_hash, role_id, is_email_verified)
VALUES (
  'donor-test-id',
  'donor@test.com',
  '$2a$10$...',  -- хэш пароля "password123"
  (SELECT id FROM user_role_ref WHERE code = 'donor'),
  true
);

-- Создать staff
INSERT INTO users (id, email, password_hash, role_id, is_email_verified)
VALUES (
  'staff-test-id',
  'staff@test.com',
  '$2a$10$...',
  (SELECT id FROM user_role_ref WHERE code = 'staff'),
  true
);

-- Создать admin
INSERT INTO users (id, email, password_hash, role_id, is_email_verified)
VALUES (
  'admin-test-id',
  'admin@test.com',
  '$2a$10$...',
  (SELECT id FROM user_role_ref WHERE code = 'admin'),
  true
);
```

## 7. Production Deployment

### 7.1 Сборка для Production

```bash
pnpm build
```

### 7.2 Запуск в Production Mode

```bash
# Backend
cd apps/api
pnpm start:prod

# Frontend
cd apps/web
pnpm start
```

### 7.3 Deployment на Digital Ocean (из .augment/rules/ssh.md)

```bash
# SSH в droplet
ssh -i c:\Work\keys\t.openssh root@hemaweb.world

# Клонировать репозиторий
cd /srv
git clone https://github.com/a-voronkov/hemaweb.git
cd hemaweb

# Настроить .env файлы
# ... (скопировать production конфигурацию)

# Запустить через Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

## 8. Проверка Работоспособности

### 8.1 Checklist

- [ ] Frontend доступен на http://localhost:3000
- [ ] Backend API доступен на http://localhost:4000
- [ ] Swagger UI доступен на http://localhost:4000/api
- [ ] PostgreSQL работает (docker-compose ps)
- [ ] Redis работает (docker-compose ps)
- [ ] Можно зарегистрировать нового пользователя
- [ ] Email уведомления работают (проверить логи)
- [ ] Карта blood drives отображается
- [ ] Календарь донаций работает

### 8.2 Тестовый Workflow

1. **Регистрация донора:**
   - Перейти на /register
   - Зарегистрироваться как донор
   - Подтвердить email (проверить логи для ссылки)

2. **Заполнение профиля:**
   - Войти в систему
   - Перейти на /profile
   - Заполнить данные о крови

3. **Верификация донора (staff):**
   - Войти как staff
   - Перейти на /staff/verify-donor
   - Верифицировать донора

4. **Создание blood drive (staff):**
   - Перейти на /staff/blood-drives/create
   - Создать обычный и срочный blood drive

5. **Поиск и регистрация (donor):**
   - Войти как донор
   - Перейти на /blood-drives
   - Переключиться на Map view
   - Зарегистрироваться на blood drive

6. **Запись донации (staff):**
   - Войти как staff
   - Перейти на /staff/record-donation
   - Записать донацию

7. **Проверка календаря (donor):**
   - Войти как донор
   - Перейти на /calendar
   - Проверить отображение донации

## 9. Troubleshooting

### База данных не подключается
```bash
# Проверить статус контейнеров
docker-compose ps

# Перезапустить контейнеры
docker-compose restart

# Проверить логи
docker-compose logs postgres
```

### Ошибки миграций
```bash
# Сбросить базу данных (ВНИМАНИЕ: удалит все данные!)
pnpm db:reset

# Применить миграции заново
pnpm db:migrate add_notification_preferences_extended
pnpm db:seed
```

### Проблемы с картой
- Убедитесь, что Leaflet CSS загружается
- Проверьте консоль браузера на ошибки
- Проверьте, что координаты medical centers заполнены

### Email не отправляются
- Проверьте настройки EMAIL_PROVIDER в .env
- Для тестирования используйте "ethereal"
- Проверьте логи backend для ссылок на Ethereal

## 10. Полезные Команды

```bash
# Просмотр логов
docker-compose logs -f

# Остановить все контейнеры
docker-compose down

# Удалить все данные (volumes)
docker-compose down -v

# Пересобрать проект
pnpm clean
pnpm install
pnpm build

# Запустить тесты
pnpm test

# Проверить типы
pnpm type-check

# Форматирование кода
pnpm format
```

## 11. Дополнительная Информация

- **Документация API:** http://localhost:4000/api
- **Prisma Studio:** `pnpm db:studio`
- **Логи Backend:** `apps/api/logs/`
- **Конфигурация Docker:** `docker-compose.yml`

---

**Готово! Система развернута и готова к использованию.** 🎉

