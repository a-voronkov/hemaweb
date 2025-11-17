# GitHub Actions CI/CD Setup

## Overview

Автоматический деплой на hemaweb.world при каждом push в ветку `main`.

## Workflow File

Создан файл `.github/workflows/deploy.yml` который:
1. ✅ Подключается к серверу по SSH
2. ✅ Обновляет код из GitHub
3. ✅ Устанавливает зависимости
4. ✅ Генерирует Prisma Client
5. ✅ Применяет миграции БД
6. ✅ Перезапускает Docker сервисы
7. ✅ Проверяет статус

## Настройка GitHub Secrets

### Шаг 1: Получить SSH приватный ключ с сервера

На сервере hemaweb.world уже настроен SSH ключ для GitHub. Нужно получить **приватный** ключ:

```bash
# SSH to server
ssh -i c:\Work\keys\t.openssh root@hemaweb.world

# Display private key
cat ~/.ssh/id_rsa
# или
cat ~/.ssh/id_ed25519
```

Скопируйте **весь** вывод, включая строки:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

### Шаг 2: Добавить Secret в GitHub

1. Перейдите в репозиторий: https://github.com/a-voronkov/hemaweb
2. Откройте **Settings** → **Secrets and variables** → **Actions**
3. Нажмите **New repository secret**
4. Создайте secret:
   - **Name**: `SSH_PRIVATE_KEY`
   - **Value**: Вставьте скопированный приватный ключ
5. Нажмите **Add secret**

### Шаг 3: Проверить workflow

После добавления secret:

1. Закоммитьте `.github/workflows/deploy.yml`:
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "ci: add GitHub Actions deployment workflow"
   git push origin main
   ```

2. Перейдите в **Actions** tab на GitHub
3. Вы увидите запущенный workflow "Deploy to hemaweb.world"
4. Кликните на него, чтобы посмотреть логи

## Workflow Triggers

Деплой запускается автоматически при:
- ✅ Push в ветку `main`
- ✅ Ручной запуск через GitHub UI (workflow_dispatch)

## Ручной запуск

Чтобы запустить деплой вручную:

1. Перейдите в **Actions** tab
2. Выберите workflow "Deploy to hemaweb.world"
3. Нажмите **Run workflow**
4. Выберите ветку `main`
5. Нажмите **Run workflow**

## Что происходит при деплое

```
1. Checkout code from GitHub
   ↓
2. Setup SSH connection to hemaweb.world
   ↓
3. Pull latest code on server
   ↓
4. Install dependencies (pnpm install)
   ↓
5. Generate Prisma Client
   ↓
6. Run database migrations
   ↓
7. Restart Docker services
   ↓
8. Verify deployment (check services, DB)
   ↓
9. ✅ Success notification
```

## Troubleshooting

### Ошибка: "Permission denied (publickey)"

**Проблема**: SSH ключ не добавлен в GitHub Secrets или неправильный формат.

**Решение**:
1. Проверьте, что скопировали **приватный** ключ (не публичный)
2. Убедитесь, что скопировали весь ключ, включая заголовки
3. Проверьте, что нет лишних пробелов или переносов строк

### Ошибка: "Host key verification failed"

**Проблема**: Сервер не добавлен в known_hosts.

**Решение**: Workflow автоматически добавляет сервер в known_hosts. Если ошибка повторяется, проверьте DNS hemaweb.world.

### Ошибка: "pnpm: command not found"

**Проблема**: pnpm не установлен на сервере.

**Решение**:
```bash
ssh root@hemaweb.world
npm install -g pnpm
```

### Ошибка: "docker compose: command not found"

**Проблема**: Docker Compose не установлен.

**Решение**: Docker Compose уже установлен на hemaweb.world. Проверьте:
```bash
ssh root@hemaweb.world
docker compose version
```

## Мониторинг деплоев

### Просмотр логов на сервере

```bash
# SSH to server
ssh -i c:\Work\keys\t.openssh root@hemaweb.world

# View Docker logs
cd /srv/hemaweb
docker compose logs -f

# View git log
git log --oneline -10

# Check service status
docker compose ps
```

### Email уведомления

GitHub автоматически отправляет email при:
- ❌ Деплой failed
- ✅ Деплой успешен (опционально, настраивается в Settings)

## Безопасность

### ✅ Best Practices

1. **SSH ключ хранится в GitHub Secrets** - зашифрован и недоступен в логах
2. **Используется SSH, не пароли** - более безопасно
3. **Приватный ключ никогда не коммитится** - только в Secrets
4. **Логи не показывают sensitive данные** - пароли скрыты

### ⚠️ Важно

- **НЕ** коммитьте `.env` файлы с production credentials
- **НЕ** коммитьте SSH ключи
- **НЕ** показывайте пароли в логах

## Следующие шаги

После настройки CI/CD:

1. ✅ Каждый push в `main` автоматически деплоится
2. ✅ Можно работать локально и пушить изменения
3. ✅ Сервер всегда синхронизирован с GitHub

### Рекомендуемый workflow

```bash
# Локальная разработка
git checkout -b feature/my-feature
# ... делаем изменения ...
git add .
git commit -m "feat: add new feature"
git push origin feature/my-feature

# Создаём Pull Request на GitHub
# После review и approve:
git checkout main
git merge feature/my-feature
git push origin main

# 🚀 Автоматический деплой запускается!
```

## Дополнительные возможности

### Деплой только при изменении определённых файлов

Можно настроить деплой только при изменении backend или frontend:

```yaml
on:
  push:
    branches:
      - main
    paths:
      - 'apps/api/**'
      - 'packages/database/**'
```

### Staging окружение

Можно добавить staging сервер:

```yaml
on:
  push:
    branches:
      - main        # Production
      - develop     # Staging
```

### Rollback

Если деплой сломал production:

```bash
# На сервере
cd /srv/hemaweb
git log --oneline -10
git reset --hard <previous-commit-hash>
docker compose restart
```

---

**Готово!** После настройки GitHub Secret `SSH_PRIVATE_KEY`, каждый push в main будет автоматически деплоиться на hemaweb.world 🚀

