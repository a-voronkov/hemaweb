# Server Setup Scripts

Скрипты для настройки сервера hemaweb.world

## 1. Настройка GitHub Actions Runner как системного сервиса

Запустите на сервере от имени root:

```bash
cd /srv/hemaweb/scripts
chmod +x setup-runner-service.sh
sudo ./setup-runner-service.sh
```

Это создаст systemd сервис, который будет автоматически запускать runner при старте системы и перезапускать его при сбоях.

### Управление сервисом

```bash
# Проверить статус
sudo systemctl status actions-runner

# Остановить
sudo systemctl stop actions-runner

# Запустить
sudo systemctl start actions-runner

# Перезапустить
sudo systemctl restart actions-runner

# Просмотр логов
sudo journalctl -u actions-runner -f
```

## 2. Смена владельца папок на deployer

Запустите на сервере от имени root:

```bash
cd /srv/hemaweb/scripts
chmod +x change-ownership.sh
sudo ./change-ownership.sh
```

Это:
- Остановит все Docker контейнеры
- Изменит владельца `/srv/hemaweb` на `deployer:deployer`
- Изменит владельца всех Docker volumes на `deployer:deployer`

## 3. Добавление deployer в группу docker

Чтобы пользователь deployer мог управлять Docker без sudo:

```bash
sudo usermod -aG docker deployer
```

После этого deployer нужно выйти и войти снова, чтобы изменения вступили в силу.

## 4. Настройка GitHub Actions Runner

1. Перейдите в настройки репозитория на GitHub
2. Settings → Actions → Runners → New self-hosted runner
3. Выберите Linux и следуйте инструкциям для настройки runner
4. При настройке добавьте label `hemaweb`
5. После настройки запустите скрипт `setup-runner-service.sh`

## 5. Проверка настройки

После выполнения всех шагов проверьте:

```bash
# Проверить, что runner работает
sudo systemctl status actions-runner

# Проверить, что deployer может управлять Docker
sudo -u deployer docker ps

# Проверить владельца папок
ls -la /srv/hemaweb
```

## Структура деплоя

После настройки деплой работает следующим образом:

1. Push в main ветку → GitHub Actions запускает workflow
2. Workflow выполняется на self-hosted runner (на том же сервере)
3. Runner выполняет команды от имени deployer:
   - Подтягивает код из GitHub
   - Собирает Docker образы
   - Перезапускает контейнеры
4. Сервисы обновляются без простоя (благодаря Docker Compose)

## Переменные окружения

Создайте файл `.env` в `/srv/hemaweb`:

```bash
# Database
POSTGRES_USER=hemaweb
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=hemaweb
DATABASE_URL=postgresql://hemaweb:your_secure_password@postgres:5432/hemaweb

# Redis
REDIS_PASSWORD=your_redis_password
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# App
NODE_ENV=production
CORS_ORIGIN=https://hemaweb.world
FRONTEND_URL=https://hemaweb.world
NEXT_PUBLIC_API_URL=https://hemaweb.world/api
NEXT_PUBLIC_APP_URL=https://hemaweb.world
NEXT_PUBLIC_APP_NAME=HemaWeb
```

## Troubleshooting

### Runner не запускается

```bash
# Проверить логи
sudo journalctl -u actions-runner -n 50

# Проверить права
ls -la /srv/actions-runner
```

### Docker не работает для deployer

```bash
# Проверить группы пользователя
groups deployer

# Добавить в группу docker
sudo usermod -aG docker deployer

# Перелогиниться
```

### Контейнеры не запускаются

```bash
# Проверить логи
docker compose logs

# Проверить статус
docker compose ps

# Пересобрать
docker compose build --no-cache
docker compose up -d
```

