# 🚀 Инструкции по настройке сервера hemaweb.world

## Что было сделано

1. ✅ Упрощен `docker-compose.yml` - убран pgAdmin, добавлены переменные окружения
2. ✅ Переделан GitHub Actions workflow на self-hosted runner
3. ✅ Созданы скрипты для настройки сервера
4. ✅ Создана документация по деплою

## Что нужно сделать на сервере

### Шаг 1: Настроить GitHub Actions Runner как системный сервис

```bash
# Подключиться к серверу
ssh root@hemaweb.world

# Перейти в папку проекта
cd /srv/hemaweb

# Подтянуть последние изменения
git pull origin main

# Запустить скрипт настройки runner
cd scripts
chmod +x setup-runner-service.sh
./setup-runner-service.sh
```

Это создаст systemd сервис, который будет:
- Автоматически запускаться при старте системы
- Перезапускаться при сбоях
- Работать от имени пользователя `deployer`

### Шаг 2: Остановить Docker и изменить владельца папок

```bash
# Все еще от root
cd /srv/hemaweb/scripts
chmod +x change-ownership.sh
./change-ownership.sh
```

Это:
- Остановит все Docker контейнеры
- Изменит владельца `/srv/hemaweb` на `deployer:deployer`
- Изменит владельца Docker volumes на `deployer:deployer`

### Шаг 3: Добавить deployer в группу docker

```bash
# От root
usermod -aG docker deployer

# Проверить
groups deployer
```

### Шаг 4: Настроить переменные окружения

```bash
# Переключиться на deployer
su - deployer
cd /srv/hemaweb

# Скопировать пример
cp .env.production.example .env

# Отредактировать (используйте nano или vim)
nano .env
```

**Обязательно измените:**
- `POSTGRES_PASSWORD` - надежный пароль для PostgreSQL
- `REDIS_PASSWORD` - пароль для Redis
- `JWT_SECRET` - секретный ключ (минимум 32 символа, случайная строка)
- `MAILJET_API_KEY` и `MAILJET_SECRET_KEY` - если используете email

### Шаг 5: Запустить Docker контейнеры

```bash
# От deployer
cd /srv/hemaweb

# Собрать образы
docker compose build

# Запустить сервисы
docker compose up -d

# Проверить статус
docker compose ps

# Посмотреть логи
docker compose logs -f
```

### Шаг 6: Инициализировать базу данных

```bash
# Применить миграции
docker compose exec api pnpm db:migrate

# Заполнить начальными данными (опционально)
docker compose exec api pnpm db:seed
```

### Шаг 7: Проверить работу

```bash
# Проверить API
curl http://localhost:3001/health

# Проверить Web
curl http://localhost:3000

# Проверить через внешний URL
curl https://hemaweb.world
curl https://hemaweb.world/api/health
```

### Шаг 8: Проверить GitHub Actions Runner

```bash
# Проверить статус сервиса
sudo systemctl status actions-runner

# Посмотреть логи
sudo journalctl -u actions-runner -f
```

Также проверьте на GitHub:
1. Перейдите в Settings → Actions → Runners
2. Должен быть виден runner с меткой `hemaweb` и статусом "Idle"

## Проверка автоматического деплоя

После настройки сделайте тестовый коммит:

```bash
# На локальной машине
git commit --allow-empty -m "Test deployment"
git push origin main
```

Затем:
1. Перейдите в Actions на GitHub
2. Найдите запущенный workflow
3. Проверьте, что он выполняется на self-hosted runner
4. Дождитесь завершения
5. Проверьте, что сайт обновился

## Полезные команды

### Управление runner

```bash
# Статус
sudo systemctl status actions-runner

# Перезапуск
sudo systemctl restart actions-runner

# Логи
sudo journalctl -u actions-runner -f
```

### Управление Docker

```bash
cd /srv/hemaweb

# Статус
docker compose ps

# Логи
docker compose logs -f
docker compose logs api -f

# Перезапуск
docker compose restart

# Пересборка
docker compose build
docker compose up -d
```

### База данных

```bash
# Подключиться
docker compose exec postgres psql -U hemaweb -d hemaweb

# Backup
docker compose exec postgres pg_dump -U hemaweb hemaweb > backup.sql

# Применить миграции
docker compose exec api pnpm db:migrate
```

## Структура файлов

```
/srv/hemaweb/                    # Проект
├── .env                         # Переменные окружения (создать!)
├── docker-compose.yml           # Docker конфигурация
├── scripts/
│   ├── setup-runner-service.sh  # Настройка runner
│   ├── change-ownership.sh      # Смена владельца
│   ├── README.md                # Документация скриптов
│   └── QUICK_COMMANDS.md        # Шпаргалка команд
└── ...

/srv/actions-runner/             # GitHub Actions Runner
├── config.sh                    # Конфигурация
├── run.sh                       # Запуск
└── ...
```

## Документация

- [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) - Полное руководство по настройке
- [scripts/README.md](./scripts/README.md) - Документация скриптов
- [scripts/QUICK_COMMANDS.md](./scripts/QUICK_COMMANDS.md) - Шпаргалка команд
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Руководство по деплою

## Troubleshooting

Если что-то не работает, смотрите:
- [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) - раздел Troubleshooting
- [scripts/QUICK_COMMANDS.md](./scripts/QUICK_COMMANDS.md) - экстренные команды

## Контакты

Если возникнут вопросы - пишите в Issues на GitHub.

