# 🚀 Production Setup Guide - hemaweb.world

Руководство по настройке production окружения с self-hosted GitHub Actions runner.

## Архитектура

- **Сервер**: Digital Ocean Droplet (hemaweb.world)
- **Пользователь**: `deployer` (для запуска Docker и деплоя)
- **GitHub Actions**: Self-hosted runner на том же сервере
- **Docker**: Все сервисы в контейнерах

## Шаг 1: Подготовка сервера

### 1.1 Создание пользователя deployer

```bash
# На сервере от root
sudo adduser deployer
sudo usermod -aG sudo deployer
sudo usermod -aG docker deployer
```

### 1.2 Настройка SSH для deployer

```bash
# На сервере от deployer
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Добавьте свой публичный ключ в authorized_keys
nano ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

## Шаг 2: Установка GitHub Actions Runner

### 2.1 Скачивание и настройка runner

```bash
# На сервере от deployer
cd /srv
sudo mkdir actions-runner
sudo chown deployer:deployer actions-runner
cd actions-runner

# Скачать runner (проверьте актуальную версию на GitHub)
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# Распаковать
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz
```

### 2.2 Регистрация runner

1. Перейдите в настройки репозитория на GitHub
2. Settings → Actions → Runners → New self-hosted runner
3. Выберите Linux и скопируйте команду конфигурации
4. Выполните на сервере:

```bash
cd /srv/actions-runner
./config.sh --url https://github.com/a-voronkov/hemaweb --token YOUR_TOKEN --labels hemaweb
```

При настройке:
- Runner name: `hemaweb-production`
- Runner group: `Default`
- Labels: `hemaweb` (важно!)
- Work folder: `_work`

### 2.3 Установка runner как системного сервиса

```bash
# На сервере от root
cd /srv/hemaweb/scripts
chmod +x setup-runner-service.sh
sudo ./setup-runner-service.sh
```

Проверка:
```bash
sudo systemctl status actions-runner
```

## Шаг 3: Настройка проекта

### 3.1 Клонирование репозитория

```bash
# На сервере от deployer
cd /srv
sudo mkdir hemaweb
sudo chown deployer:deployer hemaweb
cd hemaweb
git clone https://github.com/a-voronkov/hemaweb.git .
```

### 3.2 Настройка переменных окружения

```bash
# Скопировать пример
cp .env.production.example .env

# Отредактировать
nano .env
```

Обязательно измените:
- `POSTGRES_PASSWORD` - надежный пароль для БД
- `REDIS_PASSWORD` - пароль для Redis
- `JWT_SECRET` - секретный ключ (минимум 32 символа)
- `MAILJET_API_KEY` и `MAILJET_SECRET_KEY` - если используете email

### 3.3 Смена владельца папок (если нужно)

Если папка была создана от root:

```bash
# На сервере от root
cd /srv/hemaweb/scripts
chmod +x change-ownership.sh
sudo ./change-ownership.sh
```

## Шаг 4: Первый запуск

### 4.1 Сборка и запуск контейнеров

```bash
# На сервере от deployer
cd /srv/hemaweb

# Собрать образы
docker compose build

# Запустить сервисы
docker compose up -d

# Проверить статус
docker compose ps
```

### 4.2 Инициализация базы данных

```bash
# Применить миграции
docker compose exec api pnpm db:migrate

# Заполнить начальными данными (опционально)
docker compose exec api pnpm db:seed
```

### 4.3 Проверка работы

```bash
# Проверить логи
docker compose logs -f

# Проверить API
curl http://localhost:3001/health

# Проверить Web
curl http://localhost:3000
```

## Шаг 5: Настройка автоматического деплоя

После настройки runner деплой происходит автоматически:

1. Push в ветку `main` → GitHub Actions запускает workflow
2. Self-hosted runner выполняет команды на сервере
3. Код обновляется, образы пересобираются, контейнеры перезапускаются

### Проверка деплоя

После push в main:
1. Перейдите в Actions на GitHub
2. Найдите последний workflow run
3. Проверьте логи выполнения

## Управление сервисами

### Docker Compose команды

```bash
# Запустить все сервисы
docker compose up -d

# Остановить все сервисы
docker compose down

# Пересобрать и перезапустить
docker compose up -d --build

# Просмотр логов
docker compose logs -f
docker compose logs api -f
docker compose logs web -f

# Проверка статуса
docker compose ps
```

### Systemd команды (для runner)

```bash
# Статус runner
sudo systemctl status actions-runner

# Перезапуск runner
sudo systemctl restart actions-runner

# Логи runner
sudo journalctl -u actions-runner -f
```

## Troubleshooting

### Runner не подключается

```bash
# Проверить статус
sudo systemctl status actions-runner

# Проверить логи
sudo journalctl -u actions-runner -n 100

# Перезапустить
sudo systemctl restart actions-runner
```

### Docker контейнеры не запускаются

```bash
# Проверить логи
docker compose logs

# Пересобрать без кеша
docker compose build --no-cache

# Очистить и пересоздать
docker compose down -v
docker compose up -d
```

### База данных недоступна

```bash
# Проверить статус PostgreSQL
docker compose ps postgres

# Проверить логи
docker compose logs postgres

# Подключиться к БД
docker compose exec postgres psql -U hemaweb -d hemaweb
```

## Безопасность

1. **Firewall**: Настройте UFW для ограничения доступа
2. **SSL**: Используйте Certbot для получения SSL сертификатов
3. **Пароли**: Используйте надежные пароли в `.env`
4. **Backup**: Настройте регулярное резервное копирование БД

## Мониторинг

```bash
# Использование ресурсов
docker stats

# Размер образов
docker images

# Размер volumes
docker system df
```

