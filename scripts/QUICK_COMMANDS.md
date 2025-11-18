# Quick Commands Cheatsheet

## SSH подключение

```bash
# От пользователя deployer
ssh deployer@hemaweb.world

# От root (если нужно)
ssh root@hemaweb.world
```

## GitHub Actions Runner

```bash
# Статус
sudo systemctl status actions-runner

# Запустить
sudo systemctl start actions-runner

# Остановить
sudo systemctl stop actions-runner

# Перезапустить
sudo systemctl restart actions-runner

# Логи (live)
sudo journalctl -u actions-runner -f

# Последние 100 строк логов
sudo journalctl -u actions-runner -n 100
```

## Docker Compose

```bash
# Перейти в папку проекта
cd /srv/hemaweb

# Запустить все сервисы
docker compose up -d

# Остановить все сервисы
docker compose down

# Пересобрать и запустить
docker compose up -d --build

# Пересобрать только API и Web
docker compose build web api
docker compose up -d web api

# Статус сервисов
docker compose ps

# Логи всех сервисов
docker compose logs -f

# Логи конкретного сервиса
docker compose logs api -f
docker compose logs web -f
docker compose logs postgres -f
docker compose logs nginx -f

# Последние 50 строк логов
docker compose logs api --tail 50
```

## База данных

```bash
# Подключиться к PostgreSQL
docker compose exec postgres psql -U hemaweb -d hemaweb

# Выполнить SQL запрос
docker compose exec postgres psql -U hemaweb -d hemaweb -c "SELECT COUNT(*) FROM users;"

# Применить миграции
docker compose exec api pnpm db:migrate

# Заполнить тестовыми данными
docker compose exec api pnpm db:seed

# Открыть Prisma Studio (осторожно на проде!)
docker compose exec api pnpm db:studio

# Backup базы данных
docker compose exec postgres pg_dump -U hemaweb hemaweb > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановить из backup
docker compose exec -T postgres psql -U hemaweb -d hemaweb < backup.sql
```

## Git операции

```bash
cd /srv/hemaweb

# Проверить статус
git status

# Посмотреть последние коммиты
git log --oneline -10

# Подтянуть изменения
git pull origin main

# Сбросить локальные изменения
git reset --hard origin/main

# Посмотреть изменения
git diff
```

## Мониторинг

```bash
# Использование ресурсов контейнерами
docker stats

# Размер образов
docker images

# Размер volumes
docker system df

# Очистка неиспользуемых ресурсов
docker system prune -a

# Проверка дискового пространства
df -h

# Использование памяти
free -h

# Процессы
top
htop
```

## Проверка работоспособности

```bash
# Проверить API
curl http://localhost:3001/health

# Проверить Web
curl http://localhost:3000

# Проверить через внешний URL
curl https://hemaweb.world
curl https://hemaweb.world/api/health

# Проверить SSL сертификат
curl -vI https://hemaweb.world 2>&1 | grep -i "SSL\|TLS"
```

## Перезапуск сервисов

```bash
cd /srv/hemaweb

# Перезапустить все
docker compose restart

# Перезапустить конкретный сервис
docker compose restart api
docker compose restart web
docker compose restart nginx

# Полный перезапуск (с пересборкой)
docker compose down
docker compose build
docker compose up -d
```

## Очистка

```bash
# Остановить и удалить контейнеры
docker compose down

# Остановить и удалить контейнеры + volumes (ОСТОРОЖНО!)
docker compose down -v

# Удалить неиспользуемые образы
docker image prune -a

# Удалить все (ОЧЕНЬ ОСТОРОЖНО!)
docker system prune -a --volumes
```

## Права доступа

```bash
# Проверить владельца
ls -la /srv/hemaweb

# Изменить владельца на deployer
sudo chown -R deployer:deployer /srv/hemaweb

# Проверить группы пользователя
groups deployer

# Добавить в группу docker
sudo usermod -aG docker deployer
```

## Переменные окружения

```bash
# Редактировать .env
nano /srv/hemaweb/.env

# Посмотреть переменные (без значений)
grep -v '^#' /srv/hemaweb/.env | grep -v '^$'

# После изменения .env - перезапустить
docker compose down
docker compose up -d
```

## Экстренные команды

```bash
# Остановить все контейнеры
docker stop $(docker ps -q)

# Убить все контейнеры
docker kill $(docker ps -q)

# Перезагрузить сервер
sudo reboot

# Проверить место на диске
du -sh /srv/hemaweb/*
du -sh /var/lib/docker/*
```

